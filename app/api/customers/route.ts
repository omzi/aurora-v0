import { NextRequest, NextResponse } from 'next/server';

import { Prisma } from '@prisma/client';
import { getToken } from 'next-auth/jwt';
import * as z from 'zod';

import prisma from '#/lib/prisma';
import { CustomerSchema } from '#/lib/schema';

const GET = async (request: NextRequest) => {
	const token = await getToken({ req: request });

	try {
		if (!token) {
			return NextResponse.json({ message: 'Unauthenticated!' }, { status: 401 });
		}

		const {searchParams} = request.nextUrl;
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
		
		const customers = await prisma.customer.findMany({
			where: { businessId },
			orderBy: { createdAt: 'desc' }
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
		if (!token) {
			return NextResponse.json({ message: 'Unauthenticated!' }, { status: 401 });
		}
    
		const {searchParams} = request.nextUrl;
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

		body.business = { connect: { id: businessId } };
		const data = CustomerSchema.parse(body) as Prisma.CustomerCreateInput;

		const existingCustomer = await prisma.customer.findFirst({
			where: { businessId, email: data.email }
		});

		if (existingCustomer) {
			return NextResponse.json({ message: 'Customer already exists!' }, { status: 400 });
		}

		const customer = await prisma.customer.create({ data });

		return NextResponse.json({ message: 'Customer created!', data: customer }, { status: 201 });
	} catch (error: any) {
		console.error('Server Error [POST/Customers]:>>', error);
		if (error instanceof z.ZodError) {
			return NextResponse.json({ message: 'A validation error occurred', errors: error.formErrors.fieldErrors }, { status: 400 });
		} else {
			return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
		}
	}
}

export { GET, POST };
