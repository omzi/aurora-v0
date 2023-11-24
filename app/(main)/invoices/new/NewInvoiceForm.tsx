"use client"
import React from 'react'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '#/components/ui/form'
import { useForm } from 'react-hook-form'
import { Input } from '#/components/ui/input'
import { InfoIcon } from 'lucide-react'
import { Textarea } from '#/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '#/components/ui/radio-group'
import { Label } from '#/components/ui/label'

function NewInvoiceForm() {

    const form = useForm()

  return (
    <div className='p-5 rounded-xl mt-2 w-full max-w-[36rem] border-[1px] border-gray-200'>
        <Form   {...form}>
            <div className='flex flex-col gap-3'>
            <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className=' flex  items-center gap-6'>
              <FormLabel className=''>Customer name:</FormLabel>
              <div className='flex-1 flex-col'>
              <FormControl >
                <Input  placeholder="Select or add customer" {...field} />
              </FormControl>
              <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="invoice_no"
          render={({ field }) => (
            <FormItem className=' flex items-center gap-6'>
              <FormLabel>Invoice number:</FormLabel>
              <div className='flex-1 flex-col'>
              <FormControl>
                <Input placeholder="TST-000001" {...field} />
              </FormControl>
              <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="order_no"
          render={({ field }) => (
            <FormItem className=' flex  items-center gap-6'>
              <FormLabel>Order number:</FormLabel>
              <div className='flex-1  flex-col'>
              <FormControl>
                <Input  {...field} />
              </FormControl>
              <FormDescription className='mt-1 flex items-center gap-1 text-[0.75rem]'><InfoIcon className='w-[0.9rem]'/>optional</FormDescription>
              <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem className=' flex items-center gap-9'>
              <FormLabel>Subject:</FormLabel>
              <div className='flex-1 flex-col'>
              <FormControl>
                <Textarea placeholder="200 max characters" {...field} />
              </FormControl>
              <FormMessage />
              </div>
            </FormItem>
          )}
        />
            <FormField
          control={form.control}
          name="current_status"
          render={({ field }) => (
            <FormItem className=' flex mt-4 items-center gap-9'>
              <FormLabel className='mt-2'>Current status:</FormLabel>
              <div className='flex-1 flex-col'>
              <FormControl>
              <RadioGroup className='flex' defaultValue="not paid">
                     <div className="flex items-center space-x-2">
                        <RadioGroupItem value="not paid" id="r1" />
                         <Label htmlFor="r1">Not paid</Label>
                       </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="paid" id="r2" />
                         <Label htmlFor="r2">Paid</Label>
                    </div>
      
                </RadioGroup>
              </FormControl>
              <FormMessage />
              </div>
            </FormItem>
          )}
        />
            </div>
            </Form>
    </div>
  )
}

export default NewInvoiceForm