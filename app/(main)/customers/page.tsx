'use client';

import { toast } from 'react-toastify';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@tremor/react';
import { PlusIcon } from 'lucide-react';

import { columns } from './components/Columns';

import { Customer, SuccessResponse } from '#/common.types';
import { useUserContext } from '#/components/contexts/UserContext';
import DataTable from '#/components/DataTable';
import { Button } from '#/components/ui/button';
import { Separator } from '#/components/ui/separator';
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
		<Card className="ring-0 w-[calc(100%-50px)] container flex my-6 sm:my-10 flex-col py-5">
			<div className="flex items-center justify-between">
				<h2 className="text-2xl font-semibold">Customers</h2>
				<Button
					onClick={customerModal.onOpen}
					type="button"
					className="bg-core flex items-center justify-center gap-2 hover:bg-blue-800 text-white"
				>
					<PlusIcon /> <span>New Customer</span>
				</Button>
			</div>
			<Separator className="my-5" />
			<DataTable
				columns={columns}
				data={isPending ? [] : (customers as Customer[])}
				isLoading={isPending}
			/>
		</Card>
	);
};

export default Customers;
