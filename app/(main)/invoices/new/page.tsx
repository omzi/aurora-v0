'use client';

import { Button } from '#/components/ui/button';
import React, { useEffect, useState } from 'react';
import { useInvoiceExit } from '#/hooks/useInvoiceExit';
import { ArrowLeftIcon, ChevronsUpDownIcon, CogIcon, PlusIcon, SearchIcon, XIcon } from 'lucide-react';
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
import { useRouter } from 'next/navigation';
import { Input } from '#/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import InvoiceItem from '#/components/InvoiceItem';
import { formatNumberWithCommas } from '#/lib/utils';
import getCustomers from '#/lib/actions/getCustomers';
import { useCustomerModal } from '#/hooks/useCustomerModal';
import { useUserContext } from '#/components/contexts/UserContext';
import { SuccessResponse, Customer, Invoice } from '#/common.types';
import GeneratedInvoiceModal from '#/components/modals/GeneratedInvoiceModal';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '#/components/ui/dropdown-menu';
import Link from 'next/link';

type InvoiceItem = {
  description: string;
  quantity: number;
  price: number;
  total: number;
};

const NewInvoice = () => {
  const router = useRouter();
  const invoiceExit = useInvoiceExit();
  const customerModal = useCustomerModal();

  const { selectedBusiness } = useUserContext();
  const [customer, setCustomer] = useState<Customer>();

  const [date, setDate] = React.useState<Date>();
  const [search, setSearch] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [total, setTotal] = useState(0);
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  const [overallTotal, setOverallTotal] = useState(0);
  const [invoiceId, setInvoiceId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showGeneratedModal, setShowGeneratedModal] = useState(false);
  const hasUnsavedChanges = description.trim() !== '' || quantity > 0 || price > 0 || total > 0 || customer || date;

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
    setOverallTotal(overallTotal + total);
    toast.success('Item added successfully!');
    resetInputs();
  }

  const resetInputs = async () => {
    setDescription('');
    setPrice(0);
    setQuantity(0);
    setTotal(0);
  }

  const resetInvoice = async () => {
    setInvoiceItems([]);
    setOverallTotal(0);
  }

  const handleRemoveInvoiceItem = (idx: number) => {
    const removedItem = invoiceItems[idx];
    const newTotalCost = overallTotal - removedItem.total;
    const updatedInvoiceItems = invoiceItems.filter((_, i) => i !== idx);

    setInvoiceItems(updatedInvoiceItems);
    setOverallTotal(newTotalCost);
  }

  const { data: customers, isPending } = useQuery({
    queryKey: ['userCustomers'],
    queryFn: async () => {
      try {
        const response = (await getCustomers(selectedBusiness!.id)) as SuccessResponse<Customer[]>;

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

    setIsSubmitting(true);
    const businessId = selectedBusiness!.id;
    const customerId = customer!.id;
    const data = {
      amount: overallTotal,
      dueDate: date,
      items: invoiceItems
    }
    
    try {
      const response = await axios.post<{ data: Invoice }>(`/api/invoices?businessId=${businessId}&customerId=${customerId}`, data);
      const { data: invoice } = response.data;

      await Promise.all([
        resetInputs(),
        resetInvoice(),
        setCustomer(undefined),
        setDate(undefined)
      ]);

      setInvoiceId(invoice.invoiceId);
      setShowGeneratedModal(true);
      toast.success('Invoice created successfully!');
    } catch (error) {
      console.error('Error creating invoice :>>', error);
      toast.error('An error occurred while creating the invoice.');
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleClose = () => {
    setShowGeneratedModal(false);
  }

  return (
    <div className='flex flex-col px-4 py-8 md:px-8 md:py-12'>
      <GeneratedInvoiceModal invoiceLink={`/invoices/view/${invoiceId}`} isOpen={showGeneratedModal} onOpenChange={handleClose} />
      <div className='flex items-center justify-start gap-4 w-full'>
        <Button variant='outline' size='icon' className='rounded-full'>
          {hasUnsavedChanges ? (
            <ArrowLeftIcon className='cursor-pointer' onClick={invoiceExit.onOpen} />
          ) : (
            <Link href='/invoices'><ArrowLeftIcon className='cursor-pointer' /></Link>
          )}
        </Button>
        <h1 className='text-2xl font-semibold'>Create Invoice</h1>
      </div>
      <div className='flex flex-col sm:flex-row items-center justify-between gap-4 my-4'>
        <div className='flex w-full  gap-3'>
        <DropdownMenu >
          <DropdownMenuTrigger asChild>
            <Button variant='outline' className='flex justify-between w-full sm:max-w-[300px]'>
              <span className='truncate'>{customer?.name || 'Select a customer'}</span>
              <ChevronsUpDownIcon className='w-3.5 h-3.5 ml-2' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='start' className='w-[300px] shadow-lg p-1'>
            <div className='relative m-0.5 mb-1'>
              <SearchIcon className='absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500 dark:text-zinc-400' />
              <Input
                className='pl-8'
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder='Search customers...'
              />
            </div>
            <DropdownMenuGroup className='overflow-y-auto h-[250px] flex flex-col items-center'>
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
        <Button onClick={customerModal.onOpen} type='button' className='bg-core hover:bg-blue-800 text-white'>
          <span className='flex md:hidden'><PlusIcon className='h-4 w-4 mr-0 sm:mr-2' /></span>
          <span className='hidden sm:flex md:hidden'>New</span>
          <span className='hidden md:flex'>New Customer</span> 
        </Button>
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant='outline'
              className={cn(
                'w-full sm:max-w-[250px] flex items-center justify-start text-left font-normal',
                !date && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className='mr-2 h-4 w-4' />
              {date ? format(date, 'PPP') : <span>Pick a due date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent align='end' className='flex w-auto flex-col space-y-2 p-2'>
            <Select onValueChange={value => setDate(addDays(new Date(), parseInt(value)))}>
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
                  <XIcon onClick={resetInputs} className='w-4 h-4 text-black cursor-pointer' />
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
          <span className='text-lg font-semibold'>{formatNumberWithCommas(overallTotal)}</span>
        </CardContent>
      </Card>
      <div className='flex items-center mt-6'>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className='ml-auto relative bg-core hover:bg-blue-800 text-white'
        >
          {isSubmitting ? (
            <span className='opacity-0 flex items-center'>
              <CogIcon className='h-4 w-4 mr-2' />
              Generate Invoice
            </span>
          ) : (
            <span className='opacity-100 flex items-center'>
              <CogIcon className='h-4 w-4 mr-2' />
              Generate Invoice
            </span>
          )}
          {isSubmitting && (
            <div className='absolute flex items-center justify-center w-full h-full'>
              <Loader
                type='spinner'
                size={28}
                className='text-black dark:text-white leading-[0]'
              />
            </div>
          )}
        </Button>
      </div>
    </div>
  )
}

export default NewInvoice;
