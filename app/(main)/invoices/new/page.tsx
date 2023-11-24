"use client"
import { XCircleIcon, XIcon } from 'lucide-react'
import React from 'react'
import { useForm } from 'react-hook-form'
import NewInvoiceForm from './NewInvoiceForm'
import Link from 'next/link'
import { useConfirmLeave } from '#/hooks/useConfirmLeave'

function page() {
    //Any new "add" anywhere opens a center modal
    const invoiceExit = useConfirmLeave();

  return (
    <div className='px-[3rem] py-4'>
        <div className='flex justify-between'>
            <h1 className='text-[1.3rem] font-semibold'>New Invoice</h1>
           <div className='cursor-pointer' onClick={invoiceExit.onOpen}><XIcon /></div>
        </div>
        <div className='py-4'>
            {/* form for invoice contains
                - customer name(select or create new customer) opens modal for new
                - invoice number
                - order number
                - checkbox for paid or to be paid (if to be paid, show extra stuff like deadline or due date)- this affects the status of the invoice
                - subject
             */}
             <NewInvoiceForm />
        </div>
        <div>
            {/* selection and display of items
                    table showing item name, quantity, price, tax(optional input), amount
                    -dropdown available for the selection of items and dropdown should have 
                    checkboxes and allow for multiple selection of items (info saying click checkbox to add multiple)
                    top of dropdown exists a button to add new button and searchaable bar.
                    when tthe selection shows in table, there should be an X button to remove item
                    under tax dropdown, there should be a checkbow to apply to all.
            */}
            
        </div>
        <div>
            {/*  subtotal, discount, shipping, total
                    -option to add a new billing category e.g 'service charge'
            */}
        </div>
    </div>
  )
}

export default page