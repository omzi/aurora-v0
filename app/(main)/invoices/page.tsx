'use client';

import Link from 'next/link';
import { toast } from 'react-toastify';
import DataTable from '#/components/DataTable';
import { columns } from './components/Columns';
import { Button } from '#/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import getInvoices from '#/lib/actions/getInvoices';
import { Invoice, SuccessResponse } from '#/common.types';
import { useUserContext } from '#/components/contexts/UserContext';

const Invoices = () => {
  const { selectedBusiness } = useUserContext();

	const { data: invoices, isPending } = useQuery({
    queryKey: ['userInvoices'],
    queryFn: async () => {
      try {
        const response = (await getInvoices(selectedBusiness!.id)) as SuccessResponse<Invoice[]>;

        console.log('Get Invoices Query :>>', response);
        return response.data;
      } catch (error) {
        toast.error('An error occurred while fetching your invoices ;(');
        throw error;
      }
    }
  });
	
	return (
    <div className='h-full container flex flex-col py-5'>
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl font-semibold'>Invoices</h2>
        <Link href={'/invoices/new'}>
          <Button type='button' className='relative bg-core hover:bg-blue-800 text-white'>
            New Invoice
          </Button>
        </Link>
      </div>
      <DataTable columns={columns} data={isPending ? [] : invoices as Invoice[]} isLoading={isPending} />
    </div>
  );
}

export default Invoices;
