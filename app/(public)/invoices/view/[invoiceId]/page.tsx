'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Loader from 'react-ts-loaders';
import { Prisma } from '@prisma/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { format, formatDistanceToNow } from 'date-fns';
import html2canvas from 'html2canvas';
import { DownloadIcon, ExternalLinkIcon, RotateCcwIcon } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Item, SuccessResponse } from '#/common.types';
import VerifyPaymentModal from '#/components/modals/VerifyPaymentModal';
import Status from '#/components/Status';
import { Button } from '#/components/ui/button';
import { Card, CardContent, CardFooter,CardHeader, CardTitle } from '#/components/ui/card';
import getInvoiceByInvoiceId from '#/lib/actions/getInvoiceByInvoiceId';
import { cn, formatNumberWithCommas } from '#/lib/utils';

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
  
	const { resolvedTheme } = useTheme();
	const queryClient = useQueryClient();
	const [showVerifyPaymentModal, setShowVerifyPaymentModal] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { data: invoiceDetails, isPending } = useQuery({
		queryKey: [`invoiceDetails-${invoiceId}`],
		queryFn: async () => {
			try {
				const response = (await getInvoiceByInvoiceId(invoiceId as string)) as SuccessResponse<InvoiceDetails>;
				console.log('Get Invoice Query :>>', response);
        
				return response.data;
			} catch (error) {
				toast.error('An error occurred while fetching invoice detail ;(');
				throw error;
			}
		},
		refetchOnWindowFocus: false
	});

	useEffect(() => {
		if (invoiceDetails?.status === 'PAID' && isSubmitting) {
			toast.success('Payment successful!', { icon: '🥳' });
			setIsSubmitting(false);
			setShowVerifyPaymentModal(false);
		} else if (!showVerifyPaymentModal && isSubmitting) {
			setShowVerifyPaymentModal(true);
		}
	}, [showVerifyPaymentModal, isSubmitting, invoiceDetails]);

	if (isPending) {
		return <div className='fixed top-0 left-0 right-0 bottom-0 z-[99999] flex items-center justify-center bg-white dark:bg-black'>
			<Loader size={48} type='spinner' className='text-black dark:text-white' />
		</div>;
	}

	if (!invoiceDetails) {
		return <div className='h-full flex flex-col items-center justify-center space-y-4'>
			<Image
				src='/images/error-state.png'
				height='400'
				width='400'
				alt='Invoice not found ;('
			/>
			<h2 className='text-xl font-medium'>Invoice not found ;(</h2>
			<Button asChild>
				<Link href='/'>Go home</Link>
			</Button>
		</div>;
	}

	const date = new Date(invoiceDetails?.createdAt as Date);

	const downloadInvoice = () => {
		const input = document.getElementById('invoice')!;

		html2canvas(input, {
			windowWidth: 900,
			backgroundColor: resolvedTheme === 'light' ? '#fff' : '#000'
		}).then(screenshot => {
			const link = document.createElement('a');
			link.href = screenshot.toDataURL('image/png');
			link.download = `Invoice #${invoiceDetails.invoiceId} - ${invoiceDetails.business.name}.png`;

			link.click();
			link.remove();
		});
	};

	const verifyPayment = async () => {
		try {
			setIsSubmitting(true);
			setShowVerifyPaymentModal(true);
			const response = await axios.get(`/api/paystack/verify?invoiceId=${invoiceId}`);
			console.log('Verify Response :>>', response);

			queryClient.invalidateQueries({ queryKey: [`invoiceDetails-${invoiceId}`] });
		} catch (error) {
			setIsSubmitting(false);
			setShowVerifyPaymentModal(false);
      
			console.error('Error verifying payment :>>', error);
			toast.error('Verification unsuccessful ;(. Please try again.');
		}
	}

	const handleClose = () => {
		setShowVerifyPaymentModal(false);
	}

	return (
		<div className='flex flex-col p-2 sm:p-6' id='invoice'>
			<VerifyPaymentModal
				paymentLink={invoiceDetails.paymentLink!}
				isOpen={showVerifyPaymentModal && isSubmitting}
				onOpenChange={handleClose}
			/>
			{/* <Card className='p-3 my-4 w-52 h-52 mx-auto'>
        <Image
          width={200}
          height={200}
          className='rounded'
          src={`/api/getInvoiceQR?invoiceId=${invoiceDetails.invoiceId}`}
          alt={`Invoice #${invoiceDetails.invoiceId} QR code`}
        />
      </Card> */}
			<Card className='p-6'>
				<CardHeader className='px-0'>
					<div className='flex flex-col sm:flex-row gap-7 items-center justify-between'>
						<CardTitle>
              Invoice{' '}
							<span className='font-thin leading-none opacity-70'>
                #{invoiceDetails?.invoiceId}
							</span>
						</CardTitle>
						<div className='flex flex-row gap-2'>
							<Button
								className='self-start bg-core hover:bg-blue-800 text-white'
								variant='outline'
								onClick={downloadInvoice}
								data-html2canvas-ignore
							>
								<DownloadIcon className='h-4 w-4 mr-2' />
                Download Invoice
							</Button>
						</div>
					</div>
				</CardHeader>
				<div className='flex flex-col gap-3 lg:flex-row items-center justify-between'>
					<Card className='flex flex-col gap-2 my-2 w-full'>
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
					<Card className='flex flex-col gap-2 my-4 w-full'>
						<CardHeader>
							<CardTitle className='text-base font-bold text-left sm:text-right mb-4 uppercase text-gray-900 dark:text-white'>
                Billed To:
							</CardTitle>
						</CardHeader>
						<CardContent className='flex text-left sm:text-right flex-col gap-2'>
							<div className=''>{invoiceDetails?.customer.name} <span className='font-thin leading-none opacity-70'>({invoiceDetails?.customer.email})</span></div>
							<div>{invoiceDetails?.customer.phoneNumber}</div>
							<div className='font-thin leading-none opacity-70'>{invoiceDetails?.customer.address}</div>
						</CardContent>
					</Card>
				</div>
				<Card className='flex flex-col gap-6 mt-4'>
					<CardHeader className='border-b'>
						<CardTitle>Details</CardTitle>
					</CardHeader>
					<CardContent className='flex flex-col gap-4'>
						<div className='flex flex-col md:flex-row items-start md:items-center gap-2'>
							<div>Invoice ID:</div>
							<span className='font-thin leading-none opacity-70'>#{invoiceDetails?.invoiceId}</span>
						</div>
						<div className='flex flex-col md:flex-row items-start md:items-center gap-2'>
							<div>Due Date:</div>
							<div className='font-thin leading-none opacity-70'>
								{format(date, 'do MMM, yyyy')} ({formatDistanceToNow(date, { addSuffix: true })})
							</div>
						</div>
						<div className='flex flex-col md:flex-row items-start md:items-center gap-2'>
							<div>Amount:</div>
							<div className='font-thin leading-none opacity-70'>₦ {formatNumberWithCommas(invoiceDetails?.amount as number)}</div>
						</div>
						<div className='flex flex-col md:flex-row items-start md:items-center gap-2'>
							<div>Status:</div>
							{invoiceDetails?.status === 'PAID' ? (
								<Status status='PAID' />
							) : (
								<Status status='UNPAID' />
							)}
						</div>
						<table className='table-auto overflow-y-auto block mt-4'>
							<thead className='rounded-md bg-white/20 min-w-[24rem] flex w-full'>
								<tr className='flex justify-between w-full items-center'>
									<th className='p-3 uppercase text-sm flex-1 min-w-[10rem] tracking-wide font-thin text-left'>Description</th>
									<div className='sm:w-full max-w-[28rem] text-center  sm:grid grid-cols-3'>
										<th className='p-3 uppercase hidden sm:flex mx-auto text-sm tracking-wide font-thin text-left'>Quantity</th>
										<th className='p-3 uppercase hidden  sm:flex mx-auto text-sm tracking-wide font-thin text-left'>Price</th>
										<th className='p-3 uppercase text-sm m-0 sm:mx-auto tracking-wide font-thin text-left'>Total</th>
									</div>
								</tr>
							</thead>
							<tbody className='flex min-w-[24rem] flex-col'>
								{(invoiceDetails?.items as Item[]).map((item, idx) => (
									<tr className='bg-transparent flex w-full items-start justify-between' key={idx}>
										<td className='p-3 flex flex-1 items-center w-full min-w-[10rem]'>{item.description} <span className='ml-2 block sm:hidden font-thin leading-none opacity-70'>{`- (${item.quantity} * ₦ ${formatNumberWithCommas(item.price)})`}</span></td>
										<div className='sm:w-full max-w-[28rem] items-end text-center sm:grid grid-cols-3'>
											<td className='p-3 hidden mx-auto sm:flex'>{item.quantity}</td>
											<td className='p-3 hidden mx-auto sm:flex'>₦ {formatNumberWithCommas(item.price)}</td>
											<td className='p-3 whitespace-nowrap w-full m-0 sm:mx-auto  sm:text-center '>₦ {formatNumberWithCommas(item.total)}</td>
										</div>
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
					{invoiceDetails.status === 'UNPAID' && <>
						<CardFooter className='justify-between flex-col sm:flex-row gap-3'>
							<Button
								onClick={verifyPayment}
								disabled={showVerifyPaymentModal}
								variant='outline'
								data-html2canvas-ignore
							>
								<RotateCcwIcon className='h-4 w-4 mr-2' />
                Verify Payment
							</Button>
							<Button
								onClick={verifyPayment}
								disabled={showVerifyPaymentModal}
								className='bg-core hover:bg-blue-800 text-white'
								asChild
								data-html2canvas-ignore
							>
								<Link href={invoiceDetails.paymentLink!} target='_blank' className={cn(showVerifyPaymentModal && 'pointer-events-none opacity-50')}>
                  Make Payment
									<ExternalLinkIcon className='h-4 w-4 ml-2' />
								</Link>
							</Button>
						</CardFooter>
					</>}
				</Card>
			</Card>
		</div>
	);
}

export default ViewInvoice;
