import * as z from 'zod';
import prisma from '#/lib/prisma';
import { Prisma } from '@prisma/client';
import { getToken } from 'next-auth/jwt';
import { InvoiceSchema } from '#/lib/schema';
import { NextRequest, NextResponse } from 'next/server';
import { generateRandomChars } from '#/lib/utils';

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
      where: { businessId }
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

    const invoice = await prisma.invoice.create({ data });

    return NextResponse.json({ message: 'Invoice created successfully!', data: invoice }, { status: 201 });
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
