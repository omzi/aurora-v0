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
      return NextResponse.json({ message: 'Unauthenticated!' }, { status: 401 });
    }

    const existingBusiness = await prisma.business.findFirst({
      where: { id: businessId, userId: token.sub },
    });

    if (!existingBusiness) throw new Error('Business not found!');

    const customersCount = await prisma.customer.count({
      where: { businessId },
    });

    const invoices = await prisma.invoice.findMany({
      where: { businessId },
    });

    const revenue = invoices.reduce((total, invoice) => {
      if (invoice.status === InvoiceStatus.PAID) {
        return total + invoice.amount;
      }
      return total;
    }, 0);

    const outstanding = invoices.reduce((total, invoice) => {
      if (invoice.status === InvoiceStatus.UNPAID) {
        return total + invoice.amount;
      }
      return total;
    }, 0);

    const analytics = {
      id: businessId,
      customers: `${customersCount}`,
      revenue: `${formatNumberWithCommas(revenue)}`,
      outstanding: `${formatNumberWithCommas(outstanding)}`,
      withdrawals: '0'
    };

    return NextResponse.json({ message: 'Analytics fetched successfully', data: analytics }, { status: 200 });
  } catch (error) {
    console.error('Server Error [GET/Businesses]:>>', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
};

export { GET };
