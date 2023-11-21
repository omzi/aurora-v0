import * as z from 'zod';
import prisma from '#/lib/prisma';
import { Prisma } from '@prisma/client';
import { getToken } from 'next-auth/jwt';
import { BusinessSchema } from '#/lib/schema';
import { NextRequest, NextResponse } from 'next/server';

const GET = async (request: NextRequest) => {
	const token = await getToken({ req: request });

  try {
		if (!token) throw new Error('Unauthenticated!');

		const businesses = await prisma.business.findMany({
      where: { userId: token.sub }
    });

    return NextResponse.json({ message: 'All user businesses', data: businesses }, { status: 200 });
  } catch (error) {
		console.error('Server Error [GET/Businesses]:>>', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

const POST = async (request: NextRequest) => {
  const body = await request.json();
  const token = await getToken({ req: request });

  try {
		if (!token) throw new Error('Unauthenticated!');
    
    const data = BusinessSchema.parse(body) as Prisma.BusinessCreateInput;
    data.user = { connect: { id: token.sub } };

		const business = await prisma.business.create({ data });

    return NextResponse.json({ message: 'Business created successfully!', data: business }, { status: 201 });
  } catch (error) {
		console.error('Server Error [POST/Businesses]:>>', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: 'A validation error occurred', errors: error.formErrors.fieldErrors }, { status: 400 });
    } else {
      return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
  }
}

const PUT = async (request: NextRequest) => {
  const body = await request.json();
  const token = await getToken({ req: request });

  try {
    if (!token) throw new Error('Unauthenticated!');
    const { id, ...data } = body;

    const existingBusiness = await prisma.business.findFirst({
      where: { id, userId: token.sub }
    });

    if (!existingBusiness) throw new Error('Business not found!');

    // Ensure sensitive fields like userId, id, createdAt, updatedAt, and parentDocumentId are not changed
    const allowedFields = ['title', 'content', 'coverImage', 'icon', 'isPublished'];

    for (const field in data) {
      if (!allowedFields.includes(field)) {
        delete data[field];
      }
    }

    const updatedBusiness = await prisma.business.update({ where: { id }, data: data as Prisma.BusinessUpdateInput });

    return NextResponse.json({ message: 'Business updated successfully!', data: updatedBusiness }, { status: 200 });
  } catch (error) {
    console.error('Server Error [PUT/Businesses]:>>', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export { GET, POST, PUT };
