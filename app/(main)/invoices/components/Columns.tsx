'use client';

import Link from 'next/link';
import { toast } from 'react-toastify';
import { $Enums } from '@prisma/client';
import { Invoice } from '#/common.types';
import { Button } from '#/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import {
	DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '#/components/ui/dropdown-menu';
import Status from '#/components/Status';
import { MoreHorizontal } from 'lucide-react';
import { formatNumberWithCommas } from '#/lib/utils';
import { format, formatDistanceToNow } from 'date-fns';
import { DataTableColumnHeader } from '#/components/DataTableColumnHeader';

export const columns: ColumnDef<Invoice>[] = [
	{
    accessorKey: 'invoiceId',
    header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Invoice ID' />
		),
    cell: ({ row }) => {
      const invoiceId = row.getValue('invoiceId') as string;
      const copyInvoiceId = () => {
        navigator.clipboard.writeText(invoiceId);
        toast.success('Invoice ID copied!');
      }

      return <span onClick={copyInvoiceId} className='ml-auto cursor-pointer inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100'>
        #{invoiceId}
      </span>;
    }
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Amount' />
		),
    cell: ({ row }) => {
      const amount = row.getValue('amount') as number;

      return `₦ ${formatNumberWithCommas(amount)}`;
    }
  },
  {
    accessorKey: 'dueDate',
    header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Due Date' />
		),
    cell: ({ row }) => {
      const dateString = row.getValue('dueDate');
      const date = new Date(dateString as string);
      const status = row.getValue('status') as $Enums.InvoiceStatus;
  
      // Format as '27th Nov, 2023'
      const formattedDate = format(date, 'do MMM, yyyy');

      // Format as '2 days ago', '3 days left', etc.
      const relativeTime = formatDistanceToNow(date, { addSuffix: true });

      return (
        <div className='font-medium'>
          <span>{formattedDate}</span>
          {status === 'UNPAID' && <>
            <br />
            <small className='mt-1 uppercase ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100'>
              {relativeTime}
            </small>
          </>}
        </div>
      );
    }
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Status' />
		),
    cell: ({ row }) => {
      const status = row.getValue('status');

      return <Status status={status as 'PAID' | 'UNPAID'} />;
    }
  },
	{
    id: 'actions',
    cell: ({ row }) => {
      const invoice = row.original;
      const copyInvoiceId = () => {
        navigator.clipboard.writeText(invoice.invoiceId);
        toast.success('Invoice ID copied!');
      }
 
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem onClick={copyInvoiceId}>
              Copy Invoice ID
            </DropdownMenuItem>
            <Link href={`/invoices/view/${invoice.invoiceId}`} target='_blank' rel='noopener noreferrer'>
              <DropdownMenuItem>View Invoice</DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
		enableSorting: false,
    enableHiding: false
  }
];
