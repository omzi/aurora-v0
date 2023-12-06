import prisma from '#/lib/prisma';
import { getToken } from 'next-auth/jwt';
import { InvoiceStatus } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { formatNumberWithCommas } from '#/lib/utils';

const GET = async (request: NextRequest) => {
  const token = await getToken({ req: request });
  const businessId = request.nextUrl.searchParams.get('id') as string;

  try {
    if (!token) {
      return NextResponse.json(
        { message: 'Unauthenticated!' },
        { status: 401 }
      );
    }

    const existingBusiness = await prisma.business.findFirst({
      where: { id: businessId, userId: token.sub },
    });

    if (!existingBusiness) throw new Error('Business not found!');

    // Parallelize queries
    const [customersCount, revenue, outstanding] = await Promise.all([
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

    console.log('Customer Count', 'Revenue', 'Outstanding');
    console.log([customersCount, revenue, outstanding]);

    const analytics = {
      customers: `${customersCount}`,
      revenue: `${formatNumberWithCommas(revenue._sum.amount || 0)}`,
      outstanding: `${formatNumberWithCommas(outstanding._sum.amount || 0)}`,
      withdrawals: '0'
    };

    return NextResponse.json({ message: 'Analytics fetched successfully', data: analytics }, { status: 200 });
  } catch (error) {
    console.error('Server Error [GET/DashboardAnalytics]:>>', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
};

export { GET };
