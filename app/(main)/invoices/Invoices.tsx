'use client';

import Link from 'next/link';

import { toast } from 'react-toastify';
import { useQuery } from '@tanstack/react-query';
import { PlusIcon } from 'lucide-react';

import { columns } from './components/Columns';

import { Invoice, SuccessResponse } from '#/common.types';
import { useUserContext } from '#/components/contexts/UserContext';
import DataTable from '#/components/DataTable';
import { Button } from '#/components/ui/button';
import { Separator } from '#/components/ui/separator';
import getInvoices from '#/lib/actions/getInvoices';

const Invoices = () => {
	const { selectedBusiness } = useUserContext();

	const { data: invoices, isPending } = useQuery({
		queryKey: ['userInvoices'],
		queryFn: async () => {
			try {
				const response = await getInvoices(selectedBusiness!.id) as SuccessResponse<Invoice[]>;

				console.log('Get Invoices Query :>>', response);
				return response.data;
			} catch (error) {
				toast.error('An error occurred while fetching your invoices ;(');
				throw error;
			}
		}
	});

	return (
		<div className='h-full px-2 sm:px-6 flex flex-col py-5'>
			<div className='flex flex-col sm:flex-row gap-3 items-center justify-between'>
				<h2 className='text-2xl font-semibold'>Invoices</h2>
				<Link href={'/invoices/new'}>
					<Button type='button' className='relative bg-core hover:bg-blue-800 text-white'>
						<PlusIcon className='h-4 w-4 mr-2' />
            New Invoice
					</Button>
				</Link>
			</div>
			<DataTable columns={columns} data={isPending ? [] : (invoices as Invoice[])} isLoading={isPending} />
		</div>
	);
};

export default Invoices;
