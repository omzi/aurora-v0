'use client';

import { Customer } from '#/common.types';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '#/components/ui/button';
import {
	DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '#/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { DataTableColumnHeader } from '#/components/DataTableColumnHeader';

export const columns: ColumnDef<Customer>[] = [
	{
    accessorKey: 'name',
    header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Name' />
		)
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Email' />
		),
  },
  {
    accessorKey: 'phoneNumber',
    header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Phone Number' />
		)
  },
  {
    accessorKey: 'address',
    header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Address' />
		)
  },
	{
    id: 'actions',
    cell: ({ row }) => {
      const customer = row.original;
 
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(customer.email)}>
              Copy Customer Email
            </DropdownMenuItem>
            <DropdownMenuItem>Edit Customer</DropdownMenuItem>
            <DropdownMenuItem>View Customer</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
		enableSorting: false,
    enableHiding: false
  }
];
