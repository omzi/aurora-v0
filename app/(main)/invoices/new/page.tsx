'use client';

import { Button } from '#/components/ui/button';
import React, { useEffect, useState } from 'react';
import { useConfirmLeave } from '#/hooks/useConfirmLeave';
import { ChevronsUpDownIcon, SearchIcon, XIcon } from 'lucide-react';
import {
  CardTitle,
  CardHeader,
  CardContent,
  Card,
  CardFooter
} from '#/components/ui/card';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '#/components/ui/table';
import { cn } from '#/lib/utils';
import { addDays, format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '#/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '#/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '#/components/ui/select';
import axios from 'axios';
import Loader from 'react-ts-loaders';
import { toast } from 'react-toastify';
import { Input } from '#/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import InvoiceItem from '#/components/InvoiceItem';
import { formatNumberWithCommas } from '#/lib/utils';
import getCustomers from '#/lib/actions/getCustomers';
import { SuccessResponse, Customer } from '#/common.types';
import { useUserContext } from '#/components/contexts/UserContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '#/components/ui/dropdown-menu';

type Invoice = {
  description: string;
  quantity: number;
  price: number;
  total: number;
};

const NewInvoice = () => {
  const invoiceExit = useConfirmLeave();
  const { selectedBusiness } = useUserContext();
  const [customer, setCustomer] = useState<Customer>();

  const [date, setDate] = React.useState<Date>();
  const [search, setSearch] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [total, setTotal] = useState(0);
  const [invoiceItems, setInvoiceItems] = useState<Invoice[]>([]);
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    setTotal(quantity * price);
  }, [quantity, price]);

  const onAdd = () => {
    if (!description || quantity <= 0 || price <= 0) {
      toast.error('Please enter valid values.');
      return;
    }

    setInvoiceItems([...invoiceItems, {
      description,
      price,
      quantity,
      total
    }]);
    setTotalCost(totalCost + total);
    reset();
    console.log(invoiceItems);
  }

  const reset = () => {
    setDescription('');
    setPrice(0);
    setQuantity(0);
    setTotal(0);
  }

  const resetInvoice = () => {
    setInvoiceItems([]);
    setTotalCost(0);
  }

  const handleRemoveInvoiceItem = (idx: number) => {
    const removedItem = invoiceItems[idx];
    const newTotalCost = totalCost - removedItem.total;
    const updatedInvoiceItems = invoiceItems.filter((_, i) => i !== idx);

    setInvoiceItems(updatedInvoiceItems);
    setTotalCost(newTotalCost);
  }

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

  const filteredCustomers = customers?.filter(customer => {
		return customer.name.toLowerCase().includes(search.toLowerCase()) || customer.email.toLowerCase().includes(search.toLowerCase());
	});

  const handleCustomerClick = (customer: Customer) => {
    setSearch('');
    setCustomer(customer);
  }

  const handleSubmit = async () => {
    if (!customer) {
      toast.error('Please select a customer.');
      return;
    }

    if (!date) {
      toast.error('Please select a due date.');
      return;
    }

    if (invoiceItems.length === 0) {
      toast.error('Please add at least one item to the invoice.');
      return;
    }

    const businessId = selectedBusiness!.id;
    const customerId = customer!.id;
    const data = {
      amount: total,
      dueDate: date,
      items: invoiceItems
    }
    
    try {
      const response = await axios.post<{ data: Invoice }>(`/api/invoices?businessId=${businessId}&customerId=${customerId}`, data);
      const { data: invoice } = response.data;
      
      console.log('Invoice :>>', invoice);
      toast.success('Invoice created successfully!');
    } catch (error) {
      console.error('Error creating invoice :>>', error);
      toast.error('An error occurred while creating the invoice.');
    }
  }

  return (
    <div className='flex flex-col px-4 py-8 md:px-8 md:py-12'>
      <h1 className='text-2xl font-semibold'>Create Invoice</h1>
      <div className='flex flex-row items-center justify-between gap-4 my-4'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' className='flex justify-between w-[300px]'>
              <span className='truncate'>{customer?.name || 'Select a customer'}</span>
              <ChevronsUpDownIcon className='w-3.5 h-3.5 ml-2' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='start' className='w-[300px]'>
            <div className='relative m-0.5 mb-1'>
              <SearchIcon className='absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500 dark:text-zinc-400' />
              <Input
                className='pl-8'
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder='Search customers...'
              />
            </div>
            <DropdownMenuGroup className='overflow-y-auto h-[250px] flex flex-col items-center justify-center'>
              {isPending ? (
                <Loader type='spinner' size={36} className='my-4 text-black dark:text-white leading-[0]' />
              ) : (
                filteredCustomers && filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer, idx) => (
                    <DropdownMenuItem className='cursor-pointer w-full' key={idx} onClick={() => handleCustomerClick(customer)}>
                      <div className='flex flex-col items-start'>
                        <div className='font-medium'>{customer.name}</div>
                        <div className='text-zinc-500 dark:text-zinc-400'>{customer.email}</div>
                      </div>
                    </DropdownMenuItem>
                  ))
                ) : (
                  customers && customers.length > 0 && search.trim() !== '' ? (
                    <p className='my-4 text-xs text-center text-muted-foreground pb-2'>
                      No customers found with the search query ;(
                    </p>
                  ) : (
                    <p className='my-4 text-xs text-center text-muted-foreground pb-2'>
                      No customers created yet ;(
                    </p>
                  )
                )
              )}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant='outline'
              className={cn(
                'w-[250px] flex items-center justify-start text-left font-normal',
                !date && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className='mr-2 h-4 w-4' />
              {date ? format(date, 'PPP') : <span>Pick a due date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent align='end' className='flex w-auto flex-col space-y-2 p-2'>
            <Select
              onValueChange={value =>
                setDate(addDays(new Date(), parseInt(value)))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder='Select' />
              </SelectTrigger>
              <SelectContent position='popper'>
                <SelectItem value='0'>Today</SelectItem>
                <SelectItem value='1'>Tomorrow</SelectItem>
                <SelectItem value='3'>In 3 days</SelectItem>
                <SelectItem value='7'>In a week</SelectItem>
                <SelectItem value='14'>In 2 weeks</SelectItem>
              </SelectContent>
            </Select>
            <div className='rounded-md border'>
              <Calendar mode='single' selected={date} onSelect={setDate} />
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <Card className='flex flex-col mt-4'>
        <CardHeader>
          <CardTitle>Client Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div className='space-y-2'>
              <p>Customer Name</p>
              <p className='text-sm font-thin leading-none opacity-70'>{customer?.name || 'Not Available'}</p>
            </div>
            <div className='space-y-2'>
              <p>Customer Email</p>
              <p className='text-sm font-thin leading-none opacity-70'>{customer?.email || 'Not Available'}</p>
            </div>
            <div className='space-y-2'>
              <p>Customer Phone </p>
              <p className='text-sm font-thin leading-none opacity-70'>{customer?.phoneNumber || 'Not Available'}</p>
            </div>
            <div className='space-y-2'>
              <p>Customer Address</p>
              <p className='text-sm font-thin leading-none opacity-70'>{customer?.address || 'Not Available'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className='flex flex-col mt-4'>
        <CardHeader>
          <CardTitle>Invoice Items</CardTitle>
        </CardHeader>
        <CardContent className='flex gap-1'>
          <Table>
            <TableCaption></TableCaption>
            <TableHeader>
              <TableRow className='hover:bg-transparent'>
                <TableHead className='pl-0'>Description</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price (₦)</TableHead>
                <TableHead className='text-right'>Total (₦)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoiceItems.length > 0 && invoiceItems.map((invoice, idx) => (
                <InvoiceItem
                  key={idx}
                  description={invoice.description}
                  quantity={invoice.quantity}
                  price={formatNumberWithCommas(invoice.price)}
                  total={formatNumberWithCommas(invoice.total)}
                  onRemove={() => handleRemoveInvoiceItem(idx)}
                />
              ))}
              <TableRow className='hover:bg-transparent'>
                <TableCell className='space-y-2 pl-0'>
                  <Input id='description' type='text' placeholder='Item description' value={description} onChange={(e) => setDescription(e.target.value)}/>
                </TableCell>
                <TableCell className='space-y-2'>
                  <Input
                    id='quantity'
                    placeholder='Quantity'
                    type='number'
                    value={quantity}
                    onChange={e => setQuantity(Math.max(0, e.target.valueAsNumber))}
                  />
                </TableCell>
                <TableCell className='space-y-2'>
                  <Input 
                    id='price' 
                    placeholder='Price' 
                    type='number' 
                    value={price} 
                    onChange={e => setPrice(Math.max(0, e.target.valueAsNumber))} 
                  />
                </TableCell>
                <TableCell className='space-y-2'>
                  <Input id='total' placeholder='Total' type='number' value={total} disabled />
                </TableCell>
              
                <TableCell className='!p-1 w-4 h-4 cursor-pointer rounded-sm bg-white/10 hover:bg-white/25'>
                  <XIcon onClick={reset} className='w-4 h-4 text-black cursor-pointer' />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className='flex items-center justify-between'>
          <Button onClick={resetInvoice} size='sm' className='text-white bg-red-600 hover:bg-red-700'>Clear Invoice</Button>
          <Button onClick={onAdd} size='sm' className='text-white bg-core hover:bg-blue-800'>Add Item</Button>
        </CardFooter>
      </Card>
      <Card className='flex flex-col mt-4 w-full sm:w-96 ml-auto'>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent className='flex items-center justify-between'>
          <span className='mr-4'>Total Amount (₦):</span>
          <span className='text-lg font-semibold'>{formatNumberWithCommas(totalCost)}</span>
        </CardContent>
      </Card>
      <div className='flex items-center mt-6'>
        <Button className='ml-auto' onClick={handleSubmit}>Generate Invoice</Button>
      </div>
    </div>
  )
}

export default NewInvoice;
