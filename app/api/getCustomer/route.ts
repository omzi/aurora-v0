import { NextRequest, NextResponse } from 'next/server';

import { InvoiceStatus } from '@prisma/client';
import { getToken } from 'next-auth/jwt';

import prisma from '#/lib/prisma';
import { calculateMonthlyPercentageChange, formatNumberWithCommas, getFirstDayOfMonth, getLastDayOfMonth } from '#/lib/utils';

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

		const business = await prisma.business.findUnique({
			where: { id: businessId, userId: token.sub }
		});

		if (!business) {
			return NextResponse.json({ message: 'Business not found!' }, { status: 404 });
		}

		if (!customerId) {
			return NextResponse.json({ message: 'Invalid request. Provide customerId.' }, { status: 400 });
		}

		const customer = await prisma.customer.findUnique({
			where: { id: customerId, businessId }
		});

		if (!customer) {
			return NextResponse.json({ message: 'Customer not found!' }, { status: 404 });
		}

		// Get the current month and the previous month
		const currentMonth = new Date().getMonth();
		const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;

		const [currentMonthStats, previousMonthStats, invoices, paid, unpaid] = await Promise.all([
			getStatsForMonth(businessId, customerId, currentMonth),
			getStatsForMonth(businessId, customerId, previousMonth),
			prisma.invoice.findMany({
				where: { customerId, businessId },
				orderBy: { createdAt: 'desc' },
				select: { id: true, invoiceId: true, amount: true, dueDate: true, status: true },
				take: 5
			}),
			prisma.invoice.aggregate({
				where: { businessId, customerId, status: InvoiceStatus.PAID },
				_sum: { amount: true }
			}),
			prisma.invoice.aggregate({
				where: { businessId, customerId, status: InvoiceStatus.UNPAID },
				_sum: { amount: true }
			})
		]);

		// Fetch paid & unpaid data
		const [monthlyPaid, monthlyUnpaid] = await Promise.all([
			prisma.invoice.groupBy({
				by: ['dueDate'],
				where: {
					businessId,
					customerId,
					status: InvoiceStatus.PAID,
					dueDate: {
						gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
						lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
					}
				},
				_sum: { amount: true }
			}),
			prisma.invoice.groupBy({
				by: ['dueDate'],
				where: {
					businessId,
					customerId,
					status: InvoiceStatus.UNPAID,
					dueDate: {
						gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
						lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
					}
				},
				_sum: { amount: true }
			})
		]);

		const chartData = Array.from({ length: 12 }, (_, i) => {
			const month = new Date(0, i).toLocaleDateString('en-US', { month: 'short' });

			const monthlyPaidData = monthlyPaid.find(item => new Date(item.dueDate).getMonth() === i);
			const monthlyPaidAmount = monthlyPaidData ? monthlyPaidData._sum.amount || 0 : 0;

			const monthlyUnpaidData = monthlyUnpaid.find(item => new Date(item.dueDate).getMonth() === i);
			const monthlyUnpaidAmount = monthlyUnpaidData ? monthlyUnpaidData._sum.amount || 0 : 0;

			return { Month: month, Paid: monthlyPaidAmount, Unpaid: monthlyUnpaidAmount };
		});

		console.log('Monthly Paid :>>', monthlyPaid);
		console.log('Monthly Unpaid :>>', monthlyUnpaid);
		console.log('Chart Data :>>', chartData);

		const data = {
			customer,
			invoices,
			stats: {
				paid: {
					amount: formatNumberWithCommas(paid._sum.amount || 0),
					monthlyPercentageChange: calculateMonthlyPercentageChange(currentMonthStats.paid, previousMonthStats.paid)
				},
				unpaid: {
					amount: formatNumberWithCommas(unpaid._sum.amount || 0),
					monthlyPercentageChange: calculateMonthlyPercentageChange(currentMonthStats.unpaid, previousMonthStats.unpaid)
				},
				chart: chartData
			}
		};

		return NextResponse.json({ message: 'Customer data', data }, { status: 200 });
	} catch (error) {
		console.error('Server Error [GET/Customer]:>>', error);
		return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
	}
};

const getStatsForMonth = async (businessId: string, customerId: string, month: number) => {
	const [paid, unpaid] = await Promise.all([
		prisma.invoice.aggregate({
			where: { businessId, customerId, status: InvoiceStatus.PAID, dueDate: { gte: getFirstDayOfMonth(month), lt: getLastDayOfMonth(month) } },
			_sum: { amount: true }
		}),
		prisma.invoice.aggregate({
			where: { businessId, customerId, status: InvoiceStatus.UNPAID, dueDate: { gte: getFirstDayOfMonth(month), lt: getLastDayOfMonth(month) } },
			_sum: { amount: true }
		})
	]);

	return {
		paid: paid._sum.amount || 0,
		unpaid: unpaid._sum.amount || 0
	};
};

export { GET };
