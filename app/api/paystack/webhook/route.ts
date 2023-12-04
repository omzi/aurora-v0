import axios from 'axios';
import config from '#/lib/config';
import prisma from '#/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { PaystackInitializeResponse } from '#/common.types';

const POST = async (request: NextRequest) => {
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
      return NextResponse.json({ message: 'Invoice has already been paid!' }, { status: 400 });
		}

		// Try fetching the transaction to know if it has been initialized...
		// const previousInitialization = await axios.get(`https://api.paystack.co/transaction/${invoice!.invoiceId}`, {
		// 	headers: {
		// 		Authorization: `Bearer ${config.PAYSTACK_TEST_SK}`
		// 	}
		// });

		// console.log('previousInitialization :>>', previousInitialization.data);

    return NextResponse.json({ message: 'Payment initialized', data: {} }, { status: 200 });
  } catch (error) {
		console.error('Server Error [POST/PaystackInitialize]:>>', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export { POST };
