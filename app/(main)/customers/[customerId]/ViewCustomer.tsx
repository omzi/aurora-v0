'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import { toast } from 'react-toastify';
import Loader from 'react-ts-loaders';
import { useQuery } from '@tanstack/react-query';
import { AreaChart, BadgeDelta,Card as TremorCard, Metric, Text } from '@tremor/react';
import { format, formatDistanceToNow } from 'date-fns';
import { ArrowLeftIcon, EyeIcon, MoreHorizontal, PenIcon, ReceiptIcon, TrashIcon } from 'lucide-react';

import { GetCustomerResponse, SuccessResponse } from '#/common.types';
import { useUserContext } from '#/components/contexts/UserContext';
import Status from '#/components/Status';
import { Avatar, AvatarImage } from '#/components/ui/avatar';
import { Button } from '#/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '#/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '#/components/ui/table';
import { useCustomerModal } from '#/hooks/useCustomerModal';
import getCustomer from '#/lib/actions/getCustomer';
import { chartColors, copyToClipboard, formatNumberWithCommas, formatPercentageDelta, generateDefaultAvatar } from '#/lib/utils';

const data = [
	{
		Month: 'Jan',
		'Paid': 28900,
		'Unpaid': 2400
	},
	{
		Month: 'Feb',
		'Paid': 178900,
		'Unpaid': 100
	},
	{
		Month: 'Mar',
		'Paid': 35890,
		'Unpaid': 2950
	},
	{
		Month: 'Apr',
		'Paid': 40000,
		'Unpaid': 1500
	},
	{
		Month: 'May',
		'Paid': 42000,
		'Unpaid': 1200
	},
	{
		Month: 'Jun',
		'Paid': 0,
		'Unpaid': 0
	},
	{
		Month: 'Jul',
		'Paid': 45000,
		'Unpaid': 1000
	},
	{
		Month: 'Aug',
		'Paid': 87950,
		'Unpaid': 12800
	},
	{
		Month: 'Sep',
		'Paid': 39000,
		'Unpaid': 1600
	},
	{
		Month: 'Oct',
		'Paid': 0,
		'Unpaid': 12100
	},
	{
		Month: 'Nov',
		'Paid': 240000,
		'Unpaid': 1500
	},
	{
		Month: 'Dec',
		'Paid': 42000,
		'Unpaid': 1200
	}
];

const valueFormatter = (number: number) => `₦ ${Intl.NumberFormat('us').format(number).toString()}`;

const ViewCustomers = () => {
	const params = useParams();
	const { customerId } = params;
	const customerModal = useCustomerModal();
	const { selectedBusiness } = useUserContext();

	const { data: customerDetails, isPending } = useQuery({
		queryKey: [`customerDetails-${customerId}`],
		queryFn: async () => {
			try {
				const response = await getCustomer(selectedBusiness!.id, customerId as string) as SuccessResponse<GetCustomerResponse>;
				console.log('Get Customer Details :>>', response);
        
				return response.data;
			} catch (error) {
				toast.error('An error occurred while fetching customer details ;(');
				throw error;
			}
		},
		refetchOnWindowFocus: false
	});

	if (isPending) {
		return <div className='h-full px-2 sm:px-6 flex flex-col py-5 items-center justify-center bg-white dark:bg-black'>
			<Loader size={48} type='spinner' className='text-black dark:text-white' />
		</div>;
	}

	if (!customerDetails) {
		return <div className='h-full flex flex-col items-center justify-center space-y-4'>
			<Image
				src='/images/error-state.png'
				height='400'
				width='400'
				alt='Customer not found ;('
			/>
			<h2 className='text-xl font-medium'>Customer not found ;(</h2>
			<Button asChild>
				<Link href='/customers'>Back to Customers</Link>
			</Button>
		</div>;
	}

	return (
		<div className='h-full px-2 sm:px-6 flex flex-col py-5'>
			<div className='flex items-center justify-start gap-4 w-full'>
				<Link href='/customers'>
					<Button variant='outline' size='icon' className='rounded-full'>
						<ArrowLeftIcon />
					</Button>
				</Link>
				<h1 className='text-2xl font-semibold'>Customer Overview</h1>
			</div>
			<div className='flex flex-col lg:grid lg:grid-cols-3 gap-6 py-4'>
				<Card className='lg:col-span-1'>
					<CardHeader>
						<CardTitle>Personal Information</CardTitle>
					</CardHeader>
					<CardContent className='space-y-4'>
						<div className='flex items-center gap-3'>
							<Avatar className='h-12 w-12'>
								<AvatarImage alt='Customer avatar' src={generateDefaultAvatar(customerDetails.customer.email)} />
							</Avatar>
							<div className='truncate'>
								<h2 className='font-medium'>{customerDetails.customer.name}</h2>
								<Link className='text-blue-600' href={`mailto:${customerDetails.customer.email}`} target='_blank'>
									{customerDetails.customer.email}
								</Link>
							</div>
						</div>
						<h3 className='font-medium'>Phone Number</h3>
						<p className='font-thin leading-none opacity-70'>{customerDetails.customer.phoneNumber}</p>
						<h3 className='font-medium mt-2'>Address</h3>
						<p className='font-thin leading-none opacity-70'>{customerDetails.customer.address}</p>
						<Button
							onClick={() => customerModal.toggleEditMode(customerDetails.customer)}
							className='mt-10 h-auto py-1 px-3 bg-core hover:bg-blue-800 text-white'
						>
							<PenIcon className='h-4 w-4 mr-2' />
							Edit Customer
						</Button>
						<Button
							onClick={() => toast.info('Feature coming soon ;)')}
							className='flex h-auto py-1 px-3 bg-red-600 hover:bg-red-800 text-white'
						>
							<TrashIcon className='h-4 w-4 mr-2' />
							Delete Customer
						</Button>
					</CardContent>
				</Card>
				<Card className='lg:col-span-2'>
					<CardHeader>
						<CardTitle>Customer Analytics</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='flex flex-col md:flex-row gap-4'>
							<TremorCard className='flex-1 p-3'>
								<Text>Total Paid</Text>
								<Metric>₦ {customerDetails.stats.paid.amount}</Metric>
								<div className='flex justify-start items-center space-x-2 mt-2'>
									<BadgeDelta deltaType={formatPercentageDelta(customerDetails.stats.paid.monthlyPercentageChange).deltaType} />
									<div className='flex justify-start space-x-1 truncate'>
										<Text color={chartColors[formatPercentageDelta(customerDetails.stats.paid.monthlyPercentageChange).deltaType] as any}>
											{formatPercentageDelta(customerDetails.stats.paid.monthlyPercentageChange).absoluteValue}%
										</Text>
										<Text>from previous month</Text>
									</div>
								</div>
							</TremorCard>
							<TremorCard className='flex-1 p-3'>
								<Text>Total Unpaid</Text>
								<Metric>₦ {customerDetails.stats.unpaid.amount}</Metric>
								<div className='flex justify-start items-center space-x-2 mt-2'>
									<BadgeDelta deltaType={formatPercentageDelta(customerDetails.stats.unpaid.monthlyPercentageChange).deltaType} />
									<div className='flex justify-start space-x-1 truncate'>
										<Text color={chartColors[formatPercentageDelta(customerDetails.stats.unpaid.monthlyPercentageChange).deltaType] as any}>
											{formatPercentageDelta(customerDetails.stats.unpaid.monthlyPercentageChange).absoluteValue}%
										</Text>
										<Text>from previous month</Text>
									</div>
								</div>
							</TremorCard>
						</div>
						<AreaChart
							className='mt-8 h-36'
							data={customerDetails.stats.chart}
							categories={['Paid', 'Unpaid']}
							index='Month'
							colors={['green', 'red']}
							valueFormatter={valueFormatter}
							showXAxis={false}
							showYAxis={false}
							showLegend={false}
							showGridLines={false}
							startEndOnly={true}
						/>
					</CardContent>
				</Card>
				<Card className='lg:col-span-3'>
					<CardHeader>
						<div className='flex flex-col sm:flex-row gap-3 items-center justify-between'>
							<CardTitle>Invoice History</CardTitle>
							<Link href={`/customer/${customerDetails.customer.id}/invoices`}>
								<Button type='button' className='relative bg-core hover:bg-blue-800 text-white'>
									<EyeIcon className='h-4 w-4 mr-2' />
									View All Invoices
								</Button>
							</Link>
						</div>
					</CardHeader>
					<CardContent>
						<Table className='min-w-[42rem] overflow-y-auto'>
							<TableHeader>
								<TableRow>
									<TableHead>Invoice ID</TableHead>
									<TableHead>Amount</TableHead>
									<TableHead>Due Date</TableHead>
									<TableHead>Status</TableHead>
									<TableHead className='w-10' />
								</TableRow>
							</TableHeader>
							<TableBody>
								{customerDetails.invoices.map((invoice, idx) => {
									const dateString = invoice.dueDate;
									const date = new Date(dateString as string);

									return (
										<TableRow key={idx}>
											<TableCell>
												<span
													onClick={() => copyToClipboard(invoice.invoiceId, 'Invoice ID copied!')}
													className='ml-auto cursor-pointer inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100'
												>
													#{invoice.invoiceId}
												</span>
											</TableCell>
											<TableCell>₦ {formatNumberWithCommas(invoice.amount)}</TableCell>
											<TableCell>
												<div className='font-medium'>
													<span>{format(date, 'do MMM, yyyy')}</span>
													{invoice.status === 'UNPAID' && <>
														<br />
														<small className='mt-1 uppercase ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100'>
															{formatDistanceToNow(date, { addSuffix: true })}
														</small>
													</>}
												</div>
											</TableCell>
											<TableCell><Status status={invoice.status} /></TableCell>
											<TableCell className='w-10'>
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button variant='ghost' className='h-8 w-8 p-0'>
															<span className='sr-only'>Open menu</span>
															<MoreHorizontal className='h-4 w-4' />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align='end'>
														<DropdownMenuItem onClick={() => copyToClipboard(invoice.invoiceId, 'Invoice ID copied!')}>
															Copy Invoice ID
														</DropdownMenuItem>
														<Link href={`/invoices/view/${invoice.invoiceId}`} target='_blank' rel='noopener noreferrer'>
															<DropdownMenuItem>View Invoice</DropdownMenuItem>
														</Link>
													</DropdownMenuContent>
												</DropdownMenu>
											</TableCell>
										</TableRow>
									)
								})}
							</TableBody>
						</Table>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default ViewCustomers;
