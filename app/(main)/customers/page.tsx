'use client';

import { toast } from 'react-toastify';
import { columns } from './components/Columns';
import { useQuery } from '@tanstack/react-query';
import DataTable from '#/components/DataTable';
import getCustomers from '#/lib/actions/getCustomers';
import { Customer, SuccessResponse } from '#/common.types';
import { useUserContext } from '#/components/contexts/UserContext';
import { Button } from '#/components/ui/button';
import { useCustomerModal } from '#/hooks/useCustomerModal';

const Customers = () => {
	const customerModal = useCustomerModal();
  const { selectedBusiness } = useUserContext();

	const { data: customers, isPending } = useQuery({
    queryKey: ['userCustomers'],
    queryFn: async () => {
      try {
        const response = (await getCustomers(selectedBusiness!.id)) as SuccessResponse<Customer[]>;

        console.log('Get Customers Query :>>', response);
        return response.data;
      } catch (error) {
        toast.error('An error occurred while fetching your customers ;(');
        throw error;
      }
    }
  });
	
	return (
    <div className='h-full container flex flex-col py-5'>
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl font-semibold'>Customers</h2>
        <Button onClick={customerModal.onOpen} type='button' className='bg-core hover:bg-blue-800 text-white'>
          Add A Customer
        </Button>
      </div>
      <DataTable columns={columns} data={isPending ? [] : customers as Customer[]} isLoading={isPending} />
    </div>
  );
}

export default Customers;
