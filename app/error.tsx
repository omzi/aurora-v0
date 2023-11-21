'use client';

import Link from 'next/link';
import Image from 'next/image';

import { Button } from '#/components/ui/button';

const Error = () => {
  return (
    <div className='h-full flex flex-col items-center justify-center space-y-4'>
      <Image
        src='/images/error-state.png'
        height='400'
        width='400'
        alt='Error'
      />
      <h2 className='text-xl font-medium'>Something went wrong!</h2>
      <Button asChild>
        <Link href='/dashboard'>Go back</Link>
      </Button>
    </div>
  );
};

export default Error;
