'use client';

import { Invoice, SuccessResponse } from '#/common.types';
import DataTable from '#/components/DataTable';
import { useUserContext } from '#/components/contexts/UserContext';
import { Button } from '#/components/ui/button';
import getInvoices from '#/lib/actions/getInvoices';
import { useQuery } from '@tanstack/react-query';
import { PlusIcon } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { columns } from './components/Columns';

const Invoices = () => {
  const { selectedBusiness } = useUserContext();

  const { data: invoices, isPending } = useQuery({
    queryKey: ['userInvoices'],
    queryFn: async () => {
      try {
        const response = (await getInvoices(
          selectedBusiness!.id
        )) as SuccessResponse<Invoice[]>;

        console.log('Get Invoices Query :>>', response);
        return response.data;
      } catch (error) {
        toast.error('An error occurred while fetching your invoices ;(');
        throw error;
      }
    },
  });

  return (
    <div className="w-[calc(100%-50px)] my-6 laptop:my-10 container flex flex-col py-5">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Invoices</h2>
        <Link href={'/invoices/new'}>
          <Button
            type="button"
            className="relative bg-core hover:bg-blue-800 text-white"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            New Invoice
          </Button>
        </Link>
      </div>
      <DataTable
        columns={columns}
        data={isPending ? [] : (invoices as Invoice[])}
        isLoading={isPending}
      />
    </div>
  );
};

export default Invoices;
