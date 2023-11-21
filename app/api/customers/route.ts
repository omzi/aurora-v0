import prisma from '#/lib/prisma';
import { Prisma } from '@prisma/client';
import { getToken } from 'next-auth/jwt';
import { CustomerSchema } from '#/lib/schema';
import { NextRequest, NextResponse } from 'next/server';

const GET = async (request: NextRequest) => {
	const token = await getToken({ req: request });

  try {
		if (!token) throw new Error('Unauthenticated!');

    const searchParams = request.nextUrl.searchParams;
    const businessId = searchParams.get('businessId');

    if (!businessId) {
      throw new Error('Invalid request. Provide businessId.');
    }

    const business = await prisma.business.findUnique({
      where: { id: businessId, userId: token.sub }
    });

    if (!business) {
      throw new Error('Business not found!');
    }
		
    const customers = await prisma.customer.findMany({
      where: { businessId }
    });

    return NextResponse.json({ message: 'All customers', data: customers }, { status: 200 });
  } catch (error) {
		console.error('Server Error [GET/Customers]:>>', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

const POST = async (request: NextRequest) => {
  const body = await request.json();
	const token = await getToken({ req: request });

  try {
		if (!token) throw new Error('Unauthenticated!');
    
    const searchParams = request.nextUrl.searchParams;
    const businessId = searchParams.get('businessId');

    if (!businessId) {
      throw new Error('Invalid request. Provide businessId.');
    }

		const business = await prisma.business.findUnique({
      where: { id: businessId, userId: token.sub }
    });

    if (!business) {
      throw new Error('Business not found!');
    }

    const data = CustomerSchema.parse(body) as Prisma.CustomerCreateInput;
    data.business.connect = { id: businessId };

		const customer = await prisma.customer.create({ data });

    return NextResponse.json({ message: 'Customer created!', data: customer }, { status: 201 });
  } catch (error) {
		console.error('Server Error [POST/Customers]:>>', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export { POST };
