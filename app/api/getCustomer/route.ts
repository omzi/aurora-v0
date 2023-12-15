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
		const customerId = searchParams.get('customerId');

		if (!businessId) {
			return NextResponse.json({ message: 'Invalid request. Provide businessId.' }, { status: 400 });
		}

		if (!customerId) {
			return NextResponse.json({ message: 'Invalid request. Provide customerId.' }, { status: 400 });
		}
		
		const customer = await prisma.customer.findUnique({
			where: { id: customerId, businessId }
		});

		return NextResponse.json({ message: 'Customer', data: customer }, { status: 200 });
	} catch (error) {
		console.error('Server Error [GET/Customer]:>>', error);
		return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
	}
}

export { GET };
