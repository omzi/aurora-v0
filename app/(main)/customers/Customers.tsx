'use client';

import { toast } from 'react-toastify';
import { useQuery } from '@tanstack/react-query';
import { PlusIcon } from 'lucide-react';

import { columns } from './components/Columns';

import { Customer, SuccessResponse } from '#/common.types';
import { useUserContext } from '#/components/contexts/UserContext';
import DataTable from '#/components/DataTable';
import { Button } from '#/components/ui/button';
import { useCustomerModal } from '#/hooks/useCustomerModal';
import getCustomers from '#/lib/actions/getCustomers';

const Customers = () => {
	const customerModal = useCustomerModal();
	const { selectedBusiness } = useUserContext();

	const { data: customers, isPending } = useQuery({
		queryKey: ['userCustomers'],
		queryFn: async () => {
			try {
				const response = (await getCustomers(
          selectedBusiness!.id
				)) as SuccessResponse<Customer[]>;

				console.log('Get Customers Query :>>', response);
				return response.data;
			} catch (error) {
				toast.error('An error occurred while fetching your customers ;(');
				throw error;
			}
		}
	});

	return (
		<div className='h-full px-2 sm:px-6 flex flex-col py-5'>
			<div className='flex flex-col sm:flex-row gap-3 items-center justify-between'>
				<h2 className='text-2xl font-semibold'>Customers</h2>
				<Button onClick={customerModal.onOpen} className='bg-core hover:bg-blue-800 text-white'>
					<PlusIcon className='h-4 w-4 mr-2' />
          Add A Customer
				</Button>
			</div>
			<DataTable columns={columns} data={isPending ? [] : customers as Customer[]} isLoading={isPending} />
		</div>
	);
};

export default Customers;
