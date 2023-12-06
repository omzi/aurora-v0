'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { Button } from '#/components/ui/button';

const Header = () => {
  const { data: session } = useSession();

	return (
    <div className='space-y-8'>
      <h1 className='font-clash-display-bold text-5xl sm:text-7xl md:text-6xl !leading-[5rem]'>
        Your All-In-One Solution For Simplifying Small Business Payments.
      </h1>
      <h3 className='max-w-3xl mx-auto sm:text-xl md:text-2xl font-light'>
        Aurora empowers you to effortlessly manage clients, invoices, and
        financial transactions—all in one secure and intuitive platform.
      </h3>
      {session ? (
        <>
          <Button asChild>
            <Link href='/dashboard'>
              Use Aurora
              <ArrowRight className='h-4 w-4 ml-2' />
            </Link>
          </Button>
        </>
      ) : (
        <Button asChild>
          <Link href='/auth/sign-in'>
            Start using Aurora
            <ArrowRight className='h-4 w-4 ml-2' />
          </Link>
        </Button>
      )}
    </div>
  );
}

export default Header;
