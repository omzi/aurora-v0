import { NextRequest, NextResponse } from 'next/server';

import { getToken } from 'next-auth/jwt';

import prisma from '#/lib/prisma';

const GET = async (request: NextRequest) => {
	const token = await getToken({ req: request });

	try {
		if (!token) {
			return NextResponse.json({ message: 'Unauthenticated!' }, { status: 401 });
		}

		// Fetch the user's last created business
		const lastCreatedBusiness = await prisma.business.findFirst({
			where: { userId: token.sub },
			orderBy: { createdAt: 'desc' }
		});

		if (!lastCreatedBusiness) {
			return NextResponse.json({ message: 'User has no created businesses.' }, { status: 400 });
		}

		return NextResponse.json({ message: `User's last created business`, data: lastCreatedBusiness }, { status: 200 });
	} catch (error) {
		console.error('Server Error [GET/LastCreatedBusiness]:>>', error);
		return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
	}
};

export { GET };
