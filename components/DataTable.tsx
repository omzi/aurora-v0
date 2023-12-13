'use client';

import { ChangeEvent, useState } from 'react';
import Loader from 'react-ts-loaders';
import {
	ColumnDef,
	ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable,
	VisibilityState} from '@tanstack/react-table';

import DataTablePagination from '#/components/DataTablePagination';
import DataTableViewOptions from '#/components/DataTableViewOptions';
import { Input } from '#/components/ui/input';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '#/components/ui/table';

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	isLoading: boolean;
}

const DataTable = <TData, TValue>({
	columns,
	data,
	isLoading = false
}: DataTableProps<TData, TValue>) => {
	const [rowSelection, setRowSelection] = useState({});
	const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState('');
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
	const handleGlobalFilter = (e: ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value || '';
		setGlobalFilter(value);
	};

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		onGlobalFilterChange: setGlobalFilter,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
			globalFilter
		}
	});

	return (
		<div>
			<div className='flex items-center py-4'>
				<Input
					placeholder='Filter table...'
					value={globalFilter}
					onChange={handleGlobalFilter}
					className='max-w-sm'
				/>
				<DataTableViewOptions table={table} />
			</div>
			<div className='rounded-md max-h-[55vh] overflow-y-auto border'>
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map(headerGroup => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map(header => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{isLoading ? (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className='h-48 text-center'
								>
									<Loader
										size={32}
										type='spinner'
										className='text-black dark:text-white'
									/>
								</TableCell>
							</TableRow>
						) : (
							<>
								{table.getRowModel().rows?.length ? (
									table.getRowModel().rows.map(row => (
										<TableRow
											key={row.id}
											data-state={row.getIsSelected() && 'selected'}
										>
											{row.getVisibleCells().map(cell => (
												<TableCell key={cell.id}>
													{flexRender(
														cell.column.columnDef.cell,
														cell.getContext()
													)}
												</TableCell>
											))}
										</TableRow>
									))
								) : (
									<TableRow>
										<TableCell
											colSpan={columns.length}
											className='h-24 text-center'
										>
											No results.
										</TableCell>
									</TableRow>
								)}
							</>
						)}
					</TableBody>
				</Table>
			</div>
			<DataTablePagination table={table} />
		</div>
	);
};

export default DataTable;
