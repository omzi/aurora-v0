import { NextRequest, NextResponse } from 'next/server';

import { InvoiceStatus } from '@prisma/client';
import { getToken } from 'next-auth/jwt';

import prisma from '#/lib/prisma';

const GET = async (request: NextRequest) => {
	const token = await getToken({ req: request });
	const businessId = request.nextUrl.searchParams.get('id') as string;

	try {
		if (!token) {
			return NextResponse.json({ message: 'Unauthenticated!' }, { status: 401 });
		}

		const existingBusiness = await prisma.business.findFirst({
			where: { id: businessId, userId: token.sub }
		});

		if (!existingBusiness) throw new Error('Business not found!');

		// Fetch monthly revenue data
		const monthlyRevenue = await prisma.invoice.groupBy({
			by: ['dueDate'],
			where: {
				businessId,
				status: InvoiceStatus.PAID,
				dueDate: {
					gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
					lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
				}
			},
			_sum: { amount: true }
		});

		const chartData = Array.from({ length: 12 }, (_, i) => {
			const month = new Date(0, i).toLocaleDateString('en-US', { month: 'short' });
			const monthlyRevenueData = monthlyRevenue.reduce((totalData, currentData) => {
				const itemMonth = new Date(currentData.dueDate).getMonth();
				const itemYear = new Date(currentData.dueDate).getFullYear();

				if (itemMonth === i && itemYear === new Date().getFullYear()) {
					totalData.amount += currentData._sum.amount || 0;
				}

				return totalData;
			}, { amount: 0 });

			return { month, 'Monthly Revenue': monthlyRevenueData.amount };
		});

		console.log('Monthly Revenue :>>', monthlyRevenue);
		console.log('Chart Data :>>', chartData);

		return NextResponse.json({ message: 'Monthly revenue fetched successfully', data: chartData }, { status: 200 });
	} catch (error) {
		console.error('Server Error [GET/MonthlyRevenue]:>>', error);
		return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
	}
};

export { GET };
