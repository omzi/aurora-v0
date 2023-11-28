'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader
} from '#/components/ui/dialog';

import Link from 'next/link';
import { Button } from '../ui/button';

interface GenerateProps{
    controller: boolean;
    onOpenChange: ()=>void;
    invoiceLink: string;
    appendedMsg?: string;
}

function GeneratedInvoiceModal({controller, onOpenChange, invoiceLink, appendedMsg}: GenerateProps) {

    return (
        <Dialog open={controller} onOpenChange={onOpenChange}>
          <DialogContent>
            <DialogHeader className='border-b pb-3'>
              <h2 className='text-lg font-medium'>Success 🎉</h2>
            </DialogHeader>
                <div className='font-semibold text-center text-[1rem]'>Invoice has been generated {appendedMsg}</div>
                <div className='text-[0.9rem] text-center'>what would you like to do next?</div>
                <div className='flex p-4 mx-auto items-center gap-6'>
                    <Link href={'/invoices'}><Button onClick={onOpenChange} variant={'outline'}>See all Invoices</Button></Link>
                    <Link onClick={onOpenChange} href={invoiceLink} target='_blank' rel="noopener noreferrer" ><Button>View generated invoice</Button></Link>
                </div>
          </DialogContent>
        </Dialog>
      );
    }
  


export default GeneratedInvoiceModal