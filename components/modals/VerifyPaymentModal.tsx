'use client';

import Link from 'next/link';

import Loader from 'react-ts-loaders';
import { ExternalLinkIcon } from 'lucide-react';

import { Button } from '#/components/ui/button';
import { Dialog, DialogContent, DialogHeader } from '#/components/ui/dialog';

interface VerifyPaymentModalProps {
	isOpen: boolean;
	onOpenChange: () => void;
	paymentLink: string;
}

const VerifyPaymentModal = ({
	isOpen,
	onOpenChange,
	paymentLink
}: VerifyPaymentModalProps) => {
	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className='!w-auto'>
				<DialogHeader className='text-center my-3 mx-auto'>
					<Loader size={56} type='spinner' className='text-black dark:text-white p-8'/>
				</DialogHeader>

				<h4 className='font-medium text-center text-[1.25rem]'>
					Verifying payment status...
				</h4>

				<Link href={paymentLink} target='_blank' className='mx-auto pt-2'>
					<Button className='bg-core hover:bg-blue-800 text-white'>
						Make Payment
						<ExternalLinkIcon className='h-4 w-4 ml-2' />
					</Button>
				</Link>
			</DialogContent>
		</Dialog>
	);
};

export default VerifyPaymentModal;
