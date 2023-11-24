'use client';

import { XIcon } from 'lucide-react';
import React from 'react';
import { useConfirmLeave } from '#/hooks/useConfirmLeave';
import {
  SelectValue,
  SelectTrigger,
  SelectLabel,
  SelectItem,
  SelectGroup,
  SelectContent,
  Select,
} from '#/components/ui/select';
import { Button } from '#/components/ui/button';
import {
  CardTitle,
  CardHeader,
  CardContent,
  Card,
  CardFooter
} from '#/components/ui/card';
import { Label } from '#/components/ui/label';
import { Input } from '#/components/ui/input';

const NewInvoice = () => {
  const invoiceExit = useConfirmLeave();

  return (
    <div className='flex flex-col px-4 py-8 md:px-8 md:py-12'>
      <h1 className='text-2xl font-semibold'>Create Invoice</h1>
      <div className='flex flex-row items-center gap-4 my-4'>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder='Select a customer' />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Customers</SelectLabel>
              <SelectItem value='customer1'>Customer 1</SelectItem>
              <SelectItem value='customer2'>Customer 2</SelectItem>
              <SelectItem value='customer3'>Customer 3</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <Card className='flex flex-col mt-4'>
        <CardHeader>
          <CardTitle>Client Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div className='space-y-2'>
              <p>Customer Name</p>
              <p className='text-sm font-thin leading-none opacity-70'>Ciroma Chukwudi Adekunle</p>
            </div>
            <div className='space-y-2'>
              <p>Customer Email</p>
              <p className='text-sm font-thin leading-none opacity-70'>klustherthon@gmail.com</p>
            </div>
            <div className='space-y-2'>
              <p>Customer Phone </p>
              <p className='text-sm font-thin leading-none opacity-70'>1234567890</p>
            </div>
            <div className='space-y-2'>
              <p>Customer Address</p>
              <p className='text-sm font-thin leading-none opacity-70'>1 Stutern Drive</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className='flex flex-col mt-4'>
        <CardHeader>
          <CardTitle>Invoice Items</CardTitle>
        </CardHeader>
        <CardContent className='flex gap-1'>
          <div className='grid grid-cols-1 flex-1 gap-4 md:grid-cols-4'>
            <div className='space-y-2'>
              <Label htmlFor='description'>Description</Label>
              <Input id='description' placeholder='Item description' />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='quantity'>Quantity</Label>
              <Input id='quantity' placeholder='Quantity' type='number' />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='unit-price'>Unit Price (₦)</Label>
              <Input id='unit-price' placeholder='Unit price' type='number' />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='total-price'>Total Price (₦)</Label>
              <Input id='total-price' placeholder='Total price' type='number' disabled />
            </div>
          </div>
					<div className='w-6 cursor-pointer flex items-center justify-center rounded-sm bg-white/10 hover:bg-white/25'>
						<XIcon className='w-4 h-4 text-white cursor-pointer' />
					</div>
        </CardContent>
        <CardFooter className='flex items-center'>
          <Button size='sm'>Add Item</Button>
        </CardFooter>
      </Card>
      <Card className='flex flex-col mt-4 w-full sm:w-96 ml-auto'>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        {/* <CardContent className='flex items-center justify-between'>
          <span className='mr-4'>Discount:</span>
          <span className='text-lg font-semibold'>0%</span>
        </CardContent> */}
        <CardContent className='flex items-center justify-between'>
          <span className='mr-4'>Total Amount (₦):</span>
          <span className='text-lg font-semibold'>1000</span>
        </CardContent>
      </Card>
      <div className='flex items-center mt-6'>
        <Button className='ml-auto'>Generate Invoice</Button>
      </div>
    </div>
  )
}

export default NewInvoice;