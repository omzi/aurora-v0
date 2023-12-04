'use client';

import Link from 'next/link';
import Image from 'next/image';
import Loader from 'react-ts-loaders';
import { Button } from '#/components/ui/button';
import { ExternalLinkIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader } from '#/components/ui/dialog';

interface VerifyPaymentModalProps {
  isOpen: boolean;
  isPaid: boolean;
  onOpenChange: () => void;
  paymentLink: string;
}

const VerifyPaymentModal = ({
  isOpen,
  isPaid,
  onOpenChange,
  paymentLink
}: VerifyPaymentModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='!w-auto px-16'>
        <DialogHeader className='text-center my-3 mx-auto'>
					{isPaid ? <Image
            src='/images/blue-check.png'
            width={120}
            height={120}
            alt='Payment successful!'
          /> : <Loader size={56} type='spinner' className='text-black dark:text-white p-8' />}
        </DialogHeader>
        
				<h4 className='font-medium text-center text-[1.25rem]'>
					{isPaid ? '🥳 Payment successful!' : 'Verifying payment status...'}
				</h4>

				{isPaid ? <Button variant='outline' onClick={onOpenChange} className='mx-auto pt-2'>
					Dismiss
				</Button> : <Link href={paymentLink} target='_blank' className='mx-auto pt-2'>
					<Button className='bg-core hover:bg-blue-800 text-white'>
						Make Payment
						<ExternalLinkIcon className='h-4 w-4 ml-2' />
					</Button>
				</Link>}
      </DialogContent>
    </Dialog>
  );
}

export default VerifyPaymentModal;
