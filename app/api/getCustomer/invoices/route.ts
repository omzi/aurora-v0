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

		const invoices = await prisma.invoice.findMany({
			where: { customerId, businessId },
			orderBy: { createdAt: 'desc' },
			select: { id: true, invoiceId: true, amount: true, dueDate: true, status: true }
		});

		return NextResponse.json({ message: 'Customer invoice history', data: invoices }, { status: 200 });
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
