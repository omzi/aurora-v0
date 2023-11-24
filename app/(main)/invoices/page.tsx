import { Button } from '#/components/ui/button'
import Link from 'next/link'
import React from 'react'

function Page() {
  return (
    <div>
        <div className='flex justify-between px-[2rem] py-4'>
            {/* top nav with all invoices and filter */}
            <h1 className='text-[1.3rem] font-semibold'>All Invoices</h1>
            <Link href={'/invoices/new'}><Button className='bg-blue-600 text-white text-[0.84rem]  hover:bg-blue-400'>New Invoice</Button></Link>
        </div>
        <div>
            {/* table div with headings */}
        </div>
    </div>
  )
}

export default Page