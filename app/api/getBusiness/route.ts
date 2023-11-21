import prisma from '#/lib/prisma';
import { getToken } from 'next-auth/jwt';
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

    return NextResponse.json({ message: `User's business`, data: business }, { status: 200 });
  } catch (error) {
		console.error('Server Error [GET/Business]:>>', error);
		return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export { GET };
