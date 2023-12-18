'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import { toast } from 'react-toastify';
import Loader from 'react-ts-loaders';
import { useQuery } from '@tanstack/react-query';
import { AreaChart, BadgeDelta,Card as TremorCard, Metric, Text } from '@tremor/react';
import { ArrowLeftIcon } from 'lucide-react';

import { columns } from '#/app/(main)/invoices/components/Columns';
import { SelectedInvoiceFields, SuccessResponse } from '#/common.types';
import { useUserContext } from '#/components/contexts/UserContext';
import DataTable from '#/components/DataTable';
import { Button } from '#/components/ui/button';
import getCustomerInvoices from '#/lib/actions/getCustomerInvoices';

const valueFormatter = (number: number) => `₦ ${Intl.NumberFormat('us').format(number).toString()}`;

const ViewCustomerInvoices = () => {
	const params = useParams();
	const { customerId } = params;
	const { selectedBusiness } = useUserContext();

	const { data: customerInvoices, isPending } = useQuery({
		queryKey: [`customerInvoices-${customerId}`],
		queryFn: async () => {
			try {
				const response = await getCustomerInvoices(selectedBusiness!.id, customerId as string) as SuccessResponse<SelectedInvoiceFields[]>;
				console.log('Get Customer Invoices :>>', response);
        
				return response.data;
			} catch (error) {
				toast.error('An error occurred while fetching customer invoices ;(');
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

	if (!customerInvoices) {
		return <div className='h-full flex flex-col items-center justify-center space-y-4'>
			<Image
				src='/images/error-state.png'
				height='400'
				width='400'
				alt='Invalid customer ID ;('
			/>
			<h2 className='text-xl font-medium'>Invalid customer ID ;(</h2>
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
				<h1 className='text-2xl font-semibold'>Invoice History</h1>
			</div>
			<DataTable columns={columns} data={isPending ? [] : customerInvoices} isLoading={isPending} />
		</div>
	);
};

export default ViewCustomerInvoices;
