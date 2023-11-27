import Image from 'next/image'
import React from 'react'
import { Button } from '../ui/button'
import DummyDashboard from './utils/DummyDashboard'

const Schedule = () => {
  return (
    <section className='grid gap-5 grid-cols-1 lg:grid-cols-2'>
        <div className='flex flex-col items-center gap-3 px-5'>
            <div className='relative w-[100px] h-[100px]'>
                <Image 
                    src='/images/logo.png'
                    fill
                    className='object-contain'
                    alt='logo' 
                />
            </div>
            <h2 className='mt-[10%] text-4xl md:text-6xl font-semibold'>Solutions for Every Business</h2>
            <p className='text-xl px-5'>Build your customer base, invoicing Solutions, manage payments and withdrawals with aurora, your trusted tech partner in payment solutions.</p>
            <Button className='text-xl' size={'lg'}>Schedule a demo</Button>
        </div>
        <div className='px-[5%] sm:px-[15%] lg:px-[2%]'>  
            <DummyDashboard />
        </div>
    </section>
  )
}

export default Schedule