import { ShieldCheck } from 'lucide-react';
import React from 'react'

interface Props {
    title: string;
    desc: string;
}

const Card = ({title, desc}: Props) => {
    return (
        <div className='flex flex-col items-center'>
            <ShieldCheck size={30}/>
            <h1 className='text-2xl'>{title}</h1>
            <p className='text-lg my-2 md:w-[50%] opacity-70'>{desc}</p>
        </div>
    )
};

const Deets = () => {
  return (
    <section className='grid gap-5 grid-cols-1 lg:grid-cols-2 px-[5%]'>
        <div className=''>
            <h1 className='my-5 text-4xl md:text-6xl font-semibold'>Business Management solutions to <span>grow</span> your business.</h1>
            <div className='text-xl flex flex-col gap-5'>
                <p>
                    We offer a range of services that will help you grow and succeed in the modern world. We are a fast growing, independent, business solutions provider trusted by hundreds of clients within various industries.
                </p>
                <p>
                    We are here to make business management solutions simpler, faster and more efficient for our partners and custoners.
                </p>
                <p>
                    We provide solutions from customer management, invoice management and dissemination all the way to payment and withdrawal management through modern-world virtual book-keeping techniques.
                </p>
            </div>
        </div>
        <div className='flex flex-col justify-around'>
            <Card title='Instant settlements' desc='Instant settlements is available.' />
            <Card title='Simple, Reliable, Easy' desc='We provide services that have become the backbone of small businesses and have helped in day-to-day operations.' />
            <Card title='Easy to Switch and Set Up' desc='with a user-centric design and interface, our system is easy to navigate and use.'/>
        </div>
    </section>
  )
}

export default Deets