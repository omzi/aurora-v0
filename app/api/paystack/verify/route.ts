import { NextRequest, NextResponse } from 'next/server';

import axios from 'axios';
import { format } from 'date-fns';

import { PaystackVerifyResponse } from '#/common.types';
import config from '#/lib/config';
import paymentCompletedBusinessEmailTemplate from '#/lib/emails/templates/paymentCompletedBusiness';
import paymentCompletedCustomerEmailTemplate from '#/lib/emails/templates/paymentCompletedCustomer';
import sendBrevoEmail from '#/lib/emails/transport';
import prisma from '#/lib/prisma';
import { formatNumberWithCommas } from '#/lib/utils';

const GET = async (request: NextRequest) => {
	try {
		const { searchParams } = request.nextUrl;
		const invoiceId = searchParams.get('invoiceId');

		if (!invoiceId) {
			return NextResponse.json({ message: 'Invalid request. Provide invoiceId.' }, { status: 400 });
		}
		
		const invoice = await prisma.invoice.findUnique({
			where: { invoiceId },
			include: {
				customer: true,
				business: true
			}
		});

		if (!invoice) {
			return NextResponse.json({ message: 'Invoice not found!' }, { status: 404 });
		}

		if (invoice.status === 'PAID') {
			return NextResponse.json({ message: 'Invoice has already been paid!' }, { status: 200 });
		}

		const url = `https://api.paystack.co/transaction/verify/${invoiceId}`;
		const { data: paystackVerificationResponse } = await axios.get<PaystackVerifyResponse>(url, {
			headers: {
				Authorization: `Bearer ${config.PAYSTACK_TEST_SK}`,
				'Content-Type': 'application/json',
				'Cache-Control': 'no-cache'
			}
		});

		console.log('Verification Response :>>', paystackVerificationResponse);
		
		if (paystackVerificationResponse.data.status === 'success') {
			await prisma.invoice.update({
				where: { id: invoice.id },
				data: { status: 'PAID' }
			});
			
			await Promise.all([
				// Send success email to customer here...
				sendBrevoEmail({
					sender: { email: 'no-reply@useaurora.com.ng', name: `${invoice.business.name} from Aurora` },
					to: [{ email: invoice.customer.email, name: invoice.customer.name }],
					subject: `✅ Payment completed successfully (#${invoice.invoiceId})`,
					htmlContent: paymentCompletedCustomerEmailTemplate({
						invoiceLink: `${config.NEXTAUTH_URL}/invoices/view/${invoice.invoiceId}`,
						invoiceId: invoice.invoiceId,
						customerName: invoice.customer.name,
						email: invoice.customer.email
					})
				}),
				// Send success email to business owner here...
				sendBrevoEmail({
					sender: { email: 'no-reply@useaurora.com.ng', name: 'Aurora' },
					to: [{ email: invoice.business.email, name: invoice.business.name }],
					subject: `🤑 Payment received successfully (#${invoice.invoiceId})`,
					htmlContent: paymentCompletedBusinessEmailTemplate({
						invoicesPageLink: `${config.NEXTAUTH_URL}/invoices`,
						invoiceId: invoice.invoiceId,
						customerName: invoice.customer.name,
						businessName: invoice.business.name,
						email: invoice.business.email,
						amount: formatNumberWithCommas(invoice.amount),
						paymentDate: format(new Date(), 'do MMM, yyyy')
					})
				})
			]);

			return NextResponse.json({ message: 'Payment successful!' }, { status: 200 });
		} else {
			return NextResponse.json({ message: 'Payment unsuccessful!' }, { status: 400 });
		}
	} catch (error) {
		console.error('Server Error [GET/PaystackVerify]:>>', error);
		return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
	}
}

export { GET };
