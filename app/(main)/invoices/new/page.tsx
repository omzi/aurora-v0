'use client';

import { XIcon } from 'lucide-react';
import React from 'react';
import { useConfirmLeave } from '#/hooks/useConfirmLeave';
import { toast } from 'react-toastify';
import { useSetInvoice, useInvoiceItems } from '#/hooks/useSetInvoice';
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
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "#/components/ui/table"
import { Label } from '#/components/ui/label';
import { Input } from '#/components/ui/input';

const NewInvoice = () => {
  const invoiceExit = useConfirmLeave();
  const [description, price, quantity, total, setDescription, setPrice, setQuantity, setTotal, reset] = useSetInvoice((state) => [state.description, state.price, state.quantity, state.total, state.setDescription, state.setPrice, state.setQuantity, state.setTotal, state.reset]);
  const [InvoiceItems, totalCost, setInvoiceItems, setTotalCost, resetInvoice] = useInvoiceItems((state) => [state.InvoiceItems, state.totalCost, state.setInvoiceItems, state.setTotalCost, state.resetInvoice])

  const onAdd = () => {
    const newInvoice = {
      id: new Date().getTime().toString(),
      description,
      price,
      quantity,
      total
    };
    if(!description){
      toast.error("enter item description!")
    } else {
      setInvoiceItems(newInvoice);
      setTotalCost(total);
      reset();
      console.log(InvoiceItems);
    }
  }

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
          <Table>
            <TableCaption></TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="">Description</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Unit Price (₦)</TableHead>
                <TableHead className="text-right">Total Price (₦)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {InvoiceItems && InvoiceItems.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.description}</TableCell>
                  <TableCell>{invoice.quantity}</TableCell>
                  <TableCell>{invoice.price}</TableCell>
                  <TableCell className="text-right">{invoice.total}</TableCell>
                </TableRow>
              ))}
              <TableRow className=''>
                    <TableCell className='space-y-2'>
                      {/* <Label htmlFor='description'>Description</Label> */}
                      <Input id='description' type='text' placeholder='Item description' value={description} onChange={(e) => setDescription(e.target.value)}/>
                    </TableCell>
                    <TableCell className='space-y-2'>
                      {/* <Label htmlFor='quantity'>Quantity</Label> */}
                      <Input id='quantity' placeholder='Quantity' type='number' value={quantity} onChange={(e) => setQuantity(e.target.valueAsNumber)} />
                    </TableCell>
                    <TableCell className='space-y-2'>
                      {/* <Label htmlFor='unit-price'>Unit Price (₦)</Label> */}
                      <Input 
                        id='unit-price' 
                        placeholder='Unit price' 
                        type='number' 
                        value={price} 
                        onChange={(e) => {
                          setPrice(e.target.valueAsNumber)
                          setTotal()
                        }} 
                        />
                    </TableCell>
                    <TableCell className='space-y-2'>
                      {/* <Label htmlFor='total-price'>Total Price (₦)</Label> */}
                      <Input 
                        id='total-price' 
                        placeholder='Total price' 
                        type='number' 
                        value={total} 
                        disabled />
                    </TableCell>
                  
                  <TableCell className='w-4 h-4 cursor-pointer rounded-sm bg-white/10 hover:bg-white/25'>
                    <XIcon onClick={reset} className='w-4 h-4 text-black cursor-pointer' />
                  </TableCell>
              </TableRow>
            </TableBody>
            {/* <TableFooter>
              <TableRow>
                <TableCell colSpan={3}>Total</TableCell>
                <TableCell className="text-right">$2,500.00</TableCell>
              </TableRow>
            </TableFooter> */}
          </Table>
          
        </CardContent>
        <CardFooter className='flex items-center justify-between'>
          <Button onClick={resetInvoice} size='sm'>Clear Invoice</Button>
          <Button onClick={onAdd} size='sm'>Add Item</Button>
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
          <span className='text-lg font-semibold'>{totalCost.toFixed(2)}</span>
        </CardContent>
      </Card>
      <div className='flex items-center mt-6'>
        <Button className='ml-auto'>Generate Invoice</Button>
      </div>
    </div>
  )
}

export default NewInvoice;