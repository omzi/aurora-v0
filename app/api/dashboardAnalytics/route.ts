import * as z from 'zod';
import prisma from '#/lib/prisma';
import { InvoiceStatus, Prisma } from '@prisma/client';
import { getToken } from 'next-auth/jwt';
import { BusinessSchema } from '#/lib/schema';
import { NextRequest, NextResponse } from 'next/server';

const GET = async (request: NextRequest) => {
	const token = await getToken({ req: request });
    const businessId = request.nextUrl.searchParams.get('id') as string

  try {
		if (!token) {
      return NextResponse.json({ message: 'Unauthenticated!' }, { status: 401 });
    }
    const existingBusiness = await prisma.business.findFirst({
        where: { id: businessId, userId: token.sub }
      });
  
      if (!existingBusiness) throw new Error('Business not found!');
    const customers = await prisma.customer.findMany({
        where : { businessId  }
    })
    {/* i need the remaining schemas to get their data e.g invoice schema to get outstading payments and paid ones. */}
    const invoices = await prisma.invoice.findMany({
        where: {businessId}
    })
    var revenue = 0.00
    let outstading = 0.00
    if(invoices.length > 0){
        invoices.forEach((invoice) => {
            if(invoice.status === InvoiceStatus.PAID){
                revenue += invoice.amount
            };
            if(invoice.status === InvoiceStatus.UNPAID){
                outstading += invoice.amount
            }
        }  )
    }
    const analytics = {
        id: businessId,
        customers: `${customers.length}` || 'no see',
        revenue: `${revenue.toFixed(2)}`,
        outstanding: `${outstading.toFixed(2)}`,
        withdrawals: '0.00',

    }

    return NextResponse.json({ message: 'Analytics fetch successful', data: analytics }, { status: 200 });
  } catch (error) {
		console.error('Server Error [GET/Businesses]:>>', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export { GET };