'use client';

import Link from 'next/link';

import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';

import { Customer } from '#/common.types';
import { DataTableColumnHeader } from '#/components/DataTableColumnHeader';
import { Button } from '#/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '#/components/ui/dropdown-menu';
import { useCustomerModal } from '#/hooks/useCustomerModal';
import { copyToClipboard } from '#/lib/utils';

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
		)
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
			// eslint-disable-next-line react-hooks/rules-of-hooks
			const customerModal = useCustomerModal();
 
			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant='ghost' className='h-8 w-8 p-0'>
							<span className='sr-only'>Open menu</span>
							<MoreHorizontal className='h-4 w-4' />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align='end'>
						<DropdownMenuItem onClick={() => copyToClipboard(customer.email, 'Customer email copied!')}>
              Copy Customer Email
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => customerModal.toggleEditMode(customer)}>
							Edit Customer
						</DropdownMenuItem>
						<Link href={`/customers/${customer.id}`}>
							<DropdownMenuItem>View Customer</DropdownMenuItem>
						</Link>
						<Link href={`/customers/${customer.id}/invoices`}>
							<DropdownMenuItem>View Invoice History</DropdownMenuItem>
						</Link>
					</DropdownMenuContent>
				</DropdownMenu>
			)
		},
		enableSorting: false,
		enableHiding: false
	}
];
