import React from 'react';

interface StatusProps {
  status: 'PAID' | 'UNPAID';
}

const Status: React.FC<StatusProps> = ({
	status
}) => {

  return (
    <>
      {status === 'PAID' && (
        <div className='relative h-6 w-16 bg-green-800 text-green-300 text-xs font-medium inline-flex items-center rounded border border-green-500'>
          <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>PAID</div>
        </div>
      )}
      {status === 'UNPAID' && (
        <div className='relative h-6 w-16 bg-red-800 text-red-300 text-xs font-medium inline-flex items-center rounded border border-red-500'>
          <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>UNPAID</div>
        </div>
      )}
    </>
  );
};

export default Status;
