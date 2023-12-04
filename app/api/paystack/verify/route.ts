import axios from 'axios';
import config from '#/lib/config';
import prisma from '#/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { PaystackVerifyResponse } from '#/common.types';

const GET = async (request: NextRequest) => {
	try {
		const searchParams = request.nextUrl.searchParams;
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
			// TODO: Send success email to customer here...
			// TODO: Send success email to business owner here...
			await prisma.invoice.update({
        where: { id: invoice.id },
        data: { status: 'PAID' }
      });

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
