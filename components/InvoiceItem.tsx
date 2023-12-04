import React from 'react';
import { XIcon } from 'lucide-react';
import { TableCell, TableRow } from '#/components/ui/table';

type InvoiceItemProps = {
  description: string;
  quantity: number;
  price: number | string;
  total: number | string;
  onRemove: () => void;
};

const InvoiceItem: React.FC<InvoiceItemProps> = ({ description, quantity, price, total, onRemove }) => (
  <TableRow className='hover:bg-transparent' style={{ transition: 'transform 0.5s ease' }}>
    <TableCell className='font-medium pl-0'>{description}</TableCell>
    <TableCell>{quantity}</TableCell>
    <TableCell>{price}</TableCell>
    <TableCell className='text-right'>{total}</TableCell>
    <TableCell className='!p-1 w-4 h-4 cursor-pointer rounded-sm bg-white/10 hover:bg-white/25'>
      <XIcon onClick={onRemove} className='w-4 h-4 text-black cursor-pointer' />
    </TableCell>
  </TableRow>
);

export default InvoiceItem;
