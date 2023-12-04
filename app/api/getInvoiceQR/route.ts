import fs from 'fs';
import path from 'path';
import prisma from '#/lib/prisma';
import { AwesomeQR } from 'awesome-qr';
import { NextRequest, NextResponse } from 'next/server';

const GET = async (request: NextRequest) => {
  try {
		const searchParams = request.nextUrl.searchParams;
    const invoiceId = searchParams.get('invoiceId');

    if (!invoiceId) {
      return NextResponse.json({ message: 'Invalid request. Provide invoiceId.' }, { status: 400 });
    }

		const invoice = await prisma.invoice.findUnique({
      where: { invoiceId }
    });

    if (!invoice) {
      return NextResponse.json({ message: 'Invoice not found!' }, { status: 404 });
    }

		const logo = fs.readFileSync(path.join(process.cwd(), 'public/images/logo.png'));
		const qrBuffer = await new AwesomeQR({
      text: invoice.paymentLink!,
      size: 400,
      colorDark: '#2B66DD',
      logoImage: logo,
      logoScale: 0.16,
      logoMargin: 10,
      logoCornerRadius: 8
    }).draw();

		return new Response(qrBuffer, { headers: { 'content-type': 'image/png' } });
  } catch (error) {
		console.error('Server Error [GET/InvoiceQR]:>>', error);
		return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export { GET };
