'use client';

import { Button } from '#/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

const Header = () => {
  const { data: session } = useSession();

  return (
    <div className="space-y-8">
      <h1 className="font-clash-display-bold max-w-[86rem] mx-auto text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-9 md:!leading-[5rem]">
        Your All-In-One Solution For Simplifying Small Business Payments.
      </h1>
      <h3 className="max-w-3xl mx-auto sm:text-xl md:text-2xl font-light">
        Aurora empowers you to effortlessly manage clients, invoices, and
        financial transactions—all in one secure and intuitive platform.
      </h3>
      {session ? (
        <>
          <Button asChild>
            <Link href="/dashboard">
              Use Aurora
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </>
      ) : (
        <Button asChild>
          <Link href="/auth/sign-in">
            Start using Aurora
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      )}
    </div>
  );
};

export default Header;
