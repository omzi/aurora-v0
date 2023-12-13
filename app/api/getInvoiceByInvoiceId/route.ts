import { NextRequest, NextResponse } from 'next/server';

import prisma from '#/lib/prisma';

const GET = async (request: NextRequest) => {
	try {
		const {searchParams} = request.nextUrl;
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

		return NextResponse.json({ message: `User's invoice`, data: invoice }, { status: 200 });
	} catch (error) {
		console.error('Server Error [GET/InvoiceByInvoiceId]:>>', error);
		return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
	}
}

export { GET };
