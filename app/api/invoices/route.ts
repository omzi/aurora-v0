import * as z from 'zod';
import axios from 'axios';
import prisma from '#/lib/prisma';
import config from '#/lib/config';
import { format } from 'date-fns';
import { Prisma } from '@prisma/client';
import { getToken } from 'next-auth/jwt';
import { InvoiceSchema } from '#/lib/schema';
import sendBrevoEmail from '#/lib/emails/transport';
import { NextRequest, NextResponse } from 'next/server';
import { PaystackInitializeResponse } from '#/common.types';
import { formatNumberWithCommas, generateRandomChars } from '#/lib/utils';
import invoiceReceivedEmailTemplate from '#/lib/emails/templates/invoiceReceived';

const GET = async (request: NextRequest) => {
  const token = await getToken({ req: request });

  try {
    if (!token) {
      return NextResponse.json({ message: 'Unauthenticated!' }, { status: 401 });
    }

		const searchParams = request.nextUrl.searchParams;
    const businessId = searchParams.get('businessId');

    if (!businessId) {
      return NextResponse.json({ message: 'Invalid request. Provide businessId.' }, { status: 400 });
    }

		const business = await prisma.business.findUnique({
      where: { id: businessId, userId: token.sub }
    });

    if (!business) {
      return NextResponse.json({ message: 'Business not found!' }, { status: 404 });
    }

    const invoices = await prisma.invoice.findMany({
      where: { businessId },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ message: 'All user invoices', data: invoices }, { status: 200 });
  } catch (error) {
    console.error('Server Error [GET/Invoices]:>>', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
};

const POST = async (request: NextRequest) => {
  const body = await request.json();
  const token = await getToken({ req: request });

  try {
    if (!token) {
      return NextResponse.json({ message: 'Unauthenticated!' }, { status: 401 });
    }

		const searchParams = request.nextUrl.searchParams;
    const businessId = searchParams.get('businessId');
    const customerId = searchParams.get('customerId');

    if (!businessId) {
      return NextResponse.json({ message: 'Invalid request. Provide businessId.' }, { status: 400 });
    }

    if (!customerId) {
      return NextResponse.json({ message: 'Invalid request. Provide customerId.' }, { status: 400 });
    }

		const customer = await prisma.customer.findUnique({
      where: { id: customerId, business: {
				id: businessId,
				userId: token.sub
			}}
    });

    if (!customer) {
      return NextResponse.json({ message: 'Customer not found!' }, { status: 404 });
    }

		body.status = 'UNPAID';
		body.invoiceId = generateRandomChars(12, ...generateRandomChars.alphanumeric);
    body.business = { connect: { id: businessId } };
    body.customer = { connect: { id: customerId } };
    const data = InvoiceSchema.parse(body) as Prisma.InvoiceCreateInput;

    const invoice = await prisma.invoice.create({
      data,
      include: {
        customer: true,
        business: true
      }
    });
    
    const paystackData = {
			email: invoice!.customer.email,
			amount: invoice!.amount * 100, // Converting it to kobo...
			reference: invoice!.invoiceId,
			metadata: {
				businessName: invoice!.business.name,
				businessEmail: invoice!.business.email,
				customerName: invoice!.customer.name,
				customerEmail: invoice!.customer.email
			}
		};

		const { data: paystackResponse } = await axios.post<PaystackInitializeResponse>('https://api.paystack.co/transaction/initialize', paystackData, {
			headers: {
				Authorization: `Bearer ${config.PAYSTACK_TEST_SK}`,
				'Content-Type': 'application/json',
				'Cache-Control': 'no-cache'
			}
		});

    const updatedInvoice = await prisma.invoice.update({
      where: { id: invoice.id },
      data: {
        paymentLink: paystackResponse.data.authorization_url
      }
    });

		console.log('Initialization Response :>>', paystackResponse);
		// Send invoice email to customer here...
    const emailVariables = {
      invoiceLink: `${config.NEXTAUTH_URL}/invoices/view/${invoice.invoiceId}`,
      invoiceId: updatedInvoice.invoiceId,
      businessName: invoice.business.name,
      customerName: invoice.customer.name,
      amount: formatNumberWithCommas(invoice.amount),
      dueDate: format(invoice.dueDate, 'do MMM, yyyy'),
      email: invoice.customer.email
    }

    const emailTemplate = invoiceReceivedEmailTemplate(emailVariables);
    await sendBrevoEmail({
      sender: { email: 'no-reply@useaurora.com.ng', name: `${invoice.business.name} from Aurora` },
      to: [{ email: invoice.customer.email, name: invoice.customer.name }],
      subject: `💲 Invoice #${invoice.invoiceId} received from ${invoice.business.name}`,
      htmlContent: emailTemplate
    });

    return NextResponse.json({ message: 'Invoice created successfully!', data: updatedInvoice }, { status: 201 });
  } catch (error) {
    console.error('Server Error [POST/Invoices]:>>', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: 'A validation error occurred', errors: error.formErrors.fieldErrors }, { status: 400 });
    } else {
      return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
  }
};

const PUT = async (request: NextRequest) => {
  const body = await request.json();
  const token = await getToken({ req: request });

  try {
    if (!token) {
      return NextResponse.json({ message: 'Unauthenticated!' }, { status: 401 });
    }
    const { id, ...data } = body;

		const searchParams = request.nextUrl.searchParams;
		const businessId = searchParams.get('businessId');
    const customerId = searchParams.get('customerId');

    if (!businessId) {
      return NextResponse.json({ message: 'Invalid request. Provide businessId.' }, { status: 400 });
    }

    if (!customerId) {
      return NextResponse.json({ message: 'Invalid request. Provide customerId.' }, { status: 400 });
    }

		const existingBusiness = await prisma.business.findFirst({
      where: { id, userId: token.sub }
    });

    if (!existingBusiness) {
      return NextResponse.json({ message: 'Business not found!' }, { status: 404 });
		}

		const existingCustomer = await prisma.customer.findUnique({
      where: { id: customerId, businessId }
    });

    if (!existingCustomer) {
      return NextResponse.json({ message: 'Customer not found!' }, { status: 404 });
    }

    const existingInvoice = await prisma.invoice.findFirst({
      where: { id, businessId, customerId }
    });

    if (!existingInvoice) {
      return NextResponse.json({ message: 'Invoice not found!' }, { status: 404 });
		}

    // Ensure sensitive fields are not changed
    const allowedFields = ['amount', 'dueDate', 'status', 'items'];

    for (const field in data) {
      if (!allowedFields.includes(field)) {
        delete data[field];
      }
    }

    const updatedInvoice = await prisma.invoice.update({ where: { id }, data: data as Prisma.InvoiceUpdateInput });

    return NextResponse.json({ message: 'Invoice updated successfully!', data: updatedInvoice }, { status: 200 });
  } catch (error) {
    console.error('Server Error [PUT/Invoices]:>>', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
};

export { GET, POST, PUT };
