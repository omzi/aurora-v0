import { NextRequest, NextResponse } from 'next/server';

import { InvoiceStatus } from '@prisma/client';
import { getToken } from 'next-auth/jwt';

import prisma from '#/lib/prisma';
import { formatNumberWithCommas } from '#/lib/utils';

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

		// Get the current month and the previous month
		const currentMonth = new Date().getMonth();
		const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;

		// Parallelize queries
		const [currentMonthStats, previousMonthStats, customersCount, revenue, outstanding] = await Promise.all([
			getStatsForMonth(businessId, currentMonth),
			getStatsForMonth(businessId, previousMonth),
			prisma.customer.count({ where: { businessId } }),
			prisma.invoice.aggregate({
				where: { businessId, status: InvoiceStatus.PAID },
				_sum: { amount: true }
			}),
			prisma.invoice.aggregate({
				where: { businessId, status: InvoiceStatus.UNPAID },
				_sum: { amount: true }
			})
		]);

		console.log('Current Month Stats :>>', currentMonthStats);
		console.log('Previous Month Stats :>>', previousMonthStats);

		const analytics = {
			customers: {
				count: customersCount,
				monthlyPercentageChange: calculateMonthlyPercentageChange(currentMonthStats.customers, previousMonthStats.customers)
			},
			revenue: {
				amount: formatNumberWithCommas(revenue._sum.amount || 0),
				monthlyPercentageChange: calculateMonthlyPercentageChange(currentMonthStats.revenue, previousMonthStats.revenue)
			},
			outstanding: {
				amount: formatNumberWithCommas(outstanding._sum.amount || 0),
				monthlyPercentageChange: calculateMonthlyPercentageChange(currentMonthStats.outstanding, previousMonthStats.outstanding)
			},
			withdrawals: {
				amount: '0',
				monthlyPercentageChange: '0'
			}
		};

		return NextResponse.json({ message: 'Analytics fetched successfully', data: analytics }, { status: 200 });
	} catch (error) {
		console.error('Server Error [GET/DashboardAnalytics]:>>', error);
		return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
	}
};

const getStatsForMonth = async (businessId: string, month: number) => {
	const [customersCount, revenue, outstanding] = await Promise.all([
		prisma.customer.count({ where: { businessId, createdAt: { gte: getFirstDayOfMonth(month), lt: getLastDayOfMonth(month) } } }),
		prisma.invoice.aggregate({
			where: { businessId, status: InvoiceStatus.PAID, dueDate: { gte: getFirstDayOfMonth(month), lt: getLastDayOfMonth(month) } },
			_sum: { amount: true }
		}),
		prisma.invoice.aggregate({
			where: { businessId, status: InvoiceStatus.UNPAID, dueDate: { gte: getFirstDayOfMonth(month), lt: getLastDayOfMonth(month) } },
			_sum: { amount: true }
		})
	]);

	return {
		customers: customersCount,
		revenue: revenue._sum.amount || 0,
		outstanding: outstanding._sum.amount || 0
	};
};

const calculateMonthlyPercentageChange = (currentValue: number, previousValue: number) => {
	if (previousValue === 0) {
		return currentValue > 0 ? '100' : '0'; // If it's the first month, consider it as a 100% increase
	}

	const monthlyPercentageChange = ((currentValue - previousValue) / previousValue) * 100;
	return monthlyPercentageChange.toFixed(2);
};

const getFirstDayOfMonth = (month: number) => new Date(new Date().getFullYear(), month, 1);
const getLastDayOfMonth = (month: number) => new Date(new Date().getFullYear(), month + 1, 0);

export { GET };
