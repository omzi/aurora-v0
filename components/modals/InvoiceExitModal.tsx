'use client';

import Link from 'next/link';

import { AlertTriangleIcon } from 'lucide-react';

import { Button } from '#/components/ui/button';
import { Dialog, DialogContent, DialogHeader } from '#/components/ui/dialog';
import { useInvoiceExit } from '#/hooks/useInvoiceExit';

const InvoiceExitModal = () => {
	const invoiceExit = useInvoiceExit();

	return (
		<Dialog open={invoiceExit.isOpen} onOpenChange={invoiceExit.onClose}>
			<DialogContent>
				<DialogHeader>
					<div className="sm:flex sm:items-start">
						<div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10">
							<AlertTriangleIcon className="h-6 w-6 text-yellow-600" />
						</div>
						<div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
							<h3 className="text-base font-semibold leading-6 text-gray-900 dark:text-gray-100">
								Leave without saving?
							</h3>
							<div className="mt-2">
								<p className="text-sm text-gray-500">
									You have unsaved changes in your invoice. If you leave now,
									any information you&apos;ve entered will be lost. Are you sure
									you want to exit without saving?
								</p>
							</div>
						</div>
					</div>
				</DialogHeader>
				<div className="flex ml-auto items-center gap-4">
					<Button onClick={invoiceExit.onClose} variant="outline">
						Stay
					</Button>
					<Link onClick={invoiceExit.onClose} href="/invoices">
						<Button>Leave</Button>
					</Link>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default InvoiceExitModal;
