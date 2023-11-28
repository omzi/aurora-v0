'use client';

import Image from 'next/image';
import config from '#/lib/config';
import Loader from 'react-ts-loaders';
import { toast } from 'react-toastify';
import { Prisma } from '@prisma/client';
import Status from '#/components/Status';
import { PaystackButton } from 'react-paystack';
import { Button } from '#/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { formatNumberWithCommas } from '#/lib/utils';
import { useParams, useRouter } from 'next/navigation';
import { format, formatDistanceToNow } from 'date-fns';
import { Item, SuccessResponse } from '#/common.types';
import { DownloadIcon, PrinterIcon } from 'lucide-react';
import getInvoiceByInvoiceId from '#/lib/actions/getInvoiceByInvoiceId';
import { CardTitle, CardHeader, CardContent, Card, CardFooter } from '#/components/ui/card';

type InvoiceDetails = Prisma.InvoiceGetPayload<{
  include: {
    customer: true;
    business: true;
  };
}>;

const ViewInvoice = () => {
  const params = useParams();
  const router = useRouter();
  const { invoiceId } = params;
  if (!invoiceId) router.push('/');

  const { data: invoiceDetails, isPending } = useQuery({
    queryKey: [`invoiceDetails-${invoiceId}`],
    queryFn: async () => {
      try {
        const response = (await getInvoiceByInvoiceId(invoiceId as string)) as SuccessResponse<InvoiceDetails>;

        console.log('Get Customers Query :>>', response);
        return response.data;
      } catch (error) {
        toast.error('An error occurred while fetching your customers ;(');
        throw error;
      }
    }
  });

  if (isPending && !invoiceDetails) {
    return <div className='fixed top-0 left-0 right-0 bottom-0 z-[99999] flex items-center justify-center bg-white dark:bg-black'>
      <Loader size={48} type='spinner' className='text-black dark:text-white' />
    </div>;
  }

  const date = new Date(invoiceDetails?.createdAt as Date);
  const paystackProps = {
    email: invoiceDetails!.customer.email,
    amount: invoiceDetails!.amount,
    metadata: {
      businessName: invoiceDetails!.business.name,
      businessEmail: invoiceDetails!.business.email,
      customerName: invoiceDetails!.customer.name,
      customerEmail: invoiceDetails!.customer.email,
      'custom_fields': []
    },
    publicKey: 'pk_test_18f56206df7669ce0096bb5c52145f552f741e88',
    text: 'Pay Now',
    onSuccess: () => {
      // Show success toast, then verify the transaction...
    },
    onClose: () => {
      // Show indismissable modal checking if the transaction was successful...
    }
  };

  return (
    <div className='flex flex-col p-6'>
      <Card className='p-6'>
        <CardHeader className='pl-0'>
          <div className='flex flex-row items-center justify-between'>
            <CardTitle>
              Invoice{' '}
              <span className='font-thin leading-none opacity-70'>
                #{invoiceDetails?.invoiceId}
              </span>
            </CardTitle>
            <div className='flex flex-row gap-2'>
              <Button className='self-start bg-core hover:bg-blue-800 text-white' variant='outline'>
                <DownloadIcon className='h-4 w-4 mr-2' />
                Download Invoice
              </Button>
              <Button className='self-start bg-transparent hover:bg-gray-500 text-gray-300' variant='outline'>
                <PrinterIcon className='h-4 w-4 mr-2' />
                Print
              </Button>
            </div>
          </div>
        </CardHeader>
        <div className='flex flex-row items-center justify-between'>
          <Card className='flex flex-col gap-2 my-4 sm:w-96'>
            <CardHeader>
              <Image
                width={32}
                height={32}
                src={invoiceDetails?.business.logo as string || '/images/logo.png'}
                alt={`${invoiceDetails?.business.name} Business Logo`}
                className='object-cover'
              />
            </CardHeader>
            <CardContent className='flex flex-col gap-2'>
              <h3>{invoiceDetails?.business.name}</h3>
              <div>{invoiceDetails?.business.address}</div>
              <div>{format(new Date(invoiceDetails?.createdAt as Date), 'do MMM, yyyy')}</div>
            </CardContent>
          </Card>
          <Card className='flex flex-col items-end gap-2 my-4 sm:w-96'>
            <CardHeader>
              <CardTitle className='text-base font-bold mb-2 uppercase text-gray-900 dark:text-white'>
                Billed To:
              </CardTitle>
            </CardHeader>
            <CardContent className='flex flex-col items-end gap-2'>
              <div>{invoiceDetails?.customer.name} ({invoiceDetails?.customer.email})</div>
              <div>{invoiceDetails?.customer.phoneNumber}</div>
              <div>{invoiceDetails?.customer.address}</div>
            </CardContent>
          </Card>
        </div>
        <Card className='flex flex-col gap-6 mt-4'>
          <CardHeader className='border-b'>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className='flex flex-col gap-4'>
            <div className='flex items-center gap-2'>
              <div>Invoice ID:</div>
              <span className='font-thin leading-none opacity-70'>#{invoiceDetails?.invoiceId}</span>
            </div>
            <div className='flex items-center gap-2'>
              <div>Due Date:</div>
              <div className='font-thin leading-none opacity-70'>
                {format(date, 'do MMM, yyyy')} ({formatDistanceToNow(date, { addSuffix: true })})
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <div>Amount:</div>
              <div className='font-thin leading-none opacity-70'>₦ {formatNumberWithCommas(invoiceDetails?.amount as number)}</div>
            </div>
            <div className='flex items-center gap-2'>
              <div>Status:</div>
              {invoiceDetails?.status === 'PAID' ? (
                <Status status='PAID' />
              ) : (
                <Status status='UNPAID' />
              )}
            </div>
            <table className='table-auto w-full mt-4'>
              <thead className='bg-white/20'>
                <tr className='rounded-md'>
                  <th className='p-3 uppercase text-sm tracking-wide font-thin text-left'>Description</th>
                  <th className='p-3 uppercase text-sm tracking-wide font-thin text-left'>Quantity</th>
                  <th className='p-3 uppercase text-sm tracking-wide font-thin text-left'>Price</th>
                  <th className='p-3 uppercase text-sm tracking-wide font-thin text-left'>Total</th>
                </tr>
              </thead>
              <tbody>
                {(invoiceDetails?.items as Item[]).map((item, idx) => (
                  <tr className='bg-transparent' key={idx}>
                    <td className='p-3'>{item.description}</td>
                    <td className='p-3'>{item.quantity}</td>
                    <td className='p-3'>₦ {formatNumberWithCommas(item.price)}</td>
                    <td className='p-3'>₦ {formatNumberWithCommas(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
        <Card className='flex flex-col my-4 sm:w-96 ml-auto'>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent className='flex items-center justify-between'>
            <span className='mr-4'>Discount:</span>
            <span className='text-lg font-semibold'>0%</span>
          </CardContent>
          <CardContent className='flex items-center justify-between'>
            <span className='mr-4'>Total Amount (₦):</span>
            <span className='text-lg font-semibold'>{formatNumberWithCommas(invoiceDetails?.amount as number)}</span>
          </CardContent>
          <CardFooter>
            {invoiceDetails!.status === 'UNPAID' && <PaystackButton {...paystackProps} />}
            <Button className='ml-auto'>Initialize Payment</Button>
          </CardFooter>
        </Card>
      </Card>
    </div>
  );
}

export default ViewInvoice;
