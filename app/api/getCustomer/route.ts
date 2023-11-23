import prisma from '#/lib/prisma';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

const GET = async (request: NextRequest) => {
	const token = await getToken({ req: request });

  try {
		if (!token) {
      return NextResponse.json({ message: 'Unauthenticated!' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const businessId = searchParams.get('businessId');
    const customerId = searchParams.get('customerId');

    if (!businessId) {
      throw new Error('Invalid request. Provide businessId.');
    }

    if (!customerId) {
      throw new Error('Invalid request. Provide customerId.');
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
