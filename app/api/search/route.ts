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
    const query = searchParams.get('query');

    if (!query) {
      throw new Error('Invalid request. Provide search query.');
    }
		
    const searchedBusinesses = await prisma.business.findMany({
      where: {
        userId: token.sub,
        name: {
          contains: query
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ message: 'Searched businesses', data: searchedBusinesses }, { status: 200 });
  } catch (error) {
    console.error('Server Error [GET/Search]:>>', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export { GET };
