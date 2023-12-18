'use client';

import Image from 'next/image';
import Link from 'next/link';

import { ArrowLeftIcon, ExternalLinkIcon } from 'lucide-react';

import { Button } from '#/components/ui/button';
import { Dialog, DialogContent, DialogHeader } from '#/components/ui/dialog';

interface GeneratedInvoiceModalProps {
	isOpen: boolean;
	onOpenChange: () => void;
	invoiceLink: string;
	appendedMessage?: string;
}

const GeneratedInvoiceModal = ({
	isOpen,
	onOpenChange,
	invoiceLink,
	appendedMessage
}: GeneratedInvoiceModalProps) => {
	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className="!w-auto">
				<DialogHeader className="text-center my-3 mx-auto">
					<Image
						src="/images/blue-check.png"
						width={120}
						height={120}
						alt="Invoice generated successfully!"
					/>
				</DialogHeader>
				<h4 className="font-medium text-center text-[1.25rem]">
					Invoice generated successfully!
				</h4>
				{appendedMessage && <p>{appendedMessage}</p>}
				<div className="flex p-4 mx-auto items-center gap-6">
					<Link href={'/invoices'}>
						<Button onClick={onOpenChange} variant={'outline'}>
							<ArrowLeftIcon className="h-4 w-4 mr-2" />
							Back To Invoices
						</Button>
					</Link>
					<Link
						onClick={onOpenChange}
						href={invoiceLink}
						target="_blank"
						rel="noopener noreferrer"
					>
						<Button>
							View Invoice
							<ExternalLinkIcon className="h-4 w-4 ml-2" />
						</Button>
					</Link>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default GeneratedInvoiceModal;
