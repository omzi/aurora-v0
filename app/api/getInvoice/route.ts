import { NextRequest, NextResponse } from 'next/server';

import { getToken } from 'next-auth/jwt';

import prisma from '#/lib/prisma';

const GET = async (request: NextRequest) => {
	const token = await getToken({ req: request });

	try {
		if (!token) {
			return NextResponse.json({ message: 'Unauthenticated!' }, { status: 401 });
		}

		const { searchParams } = request.nextUrl;
		const businessId = searchParams.get('businessId');
		const invoiceId = searchParams.get('invoiceId');

		if (!businessId) {
			return NextResponse.json({ message: 'Invalid request. Provide businessId.' }, { status: 400 });
		}

		if (!invoiceId) {
			return NextResponse.json({ message: 'Invalid request. Provide invoiceId.' }, { status: 400 });
		}

		const invoice = await prisma.invoice.findUnique({
			where: { id: invoiceId, business: {
				id: businessId,
				userId: token.sub
			}}
		});

		if (!invoice) {
			return NextResponse.json({ message: 'Invoice not found!' }, { status: 404 });
		}

		return NextResponse.json({ message: `User's invoice`, data: invoice }, { status: 200 });
	} catch (error) {
		console.error('Server Error [GET/Invoice]:>>', error);
		return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
	}
}

export { GET };
