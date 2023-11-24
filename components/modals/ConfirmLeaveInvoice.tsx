'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader
} from '#/components/ui/dialog';

import { useConfirmLeave } from '#/hooks/useConfirmLeave';
import Link from 'next/link';
import { Button } from '../ui/button';

function ConfirmLeaveInvoice() {
    const invoiceExit = useConfirmLeave();

    return (
        <Dialog open={invoiceExit.isOpen} onOpenChange={invoiceExit.onClose}>
          <DialogContent>
            <DialogHeader className='border-b pb-3'>
              <h2 className='text-lg font-medium'>Exit Warning</h2>
            </DialogHeader>
                <div className='font-semibold text-[1rem]'>Are you sure you want to leave this page</div>
                <div className='text-[0.9rem]'>your data will not be saved</div>
                <div className='flex p-4 mx-auto items-center gap-6'>
                    <Button onClick={invoiceExit.onClose} variant={'outline'}>Cancel</Button>
                    <Link onClick={invoiceExit.onClose} href={'/invoices'}><Button>Leave</Button></Link>
                </div>
          </DialogContent>
        </Dialog>
      );
    }
  


export default ConfirmLeaveInvoice