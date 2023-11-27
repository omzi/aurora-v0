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
        <span className='bg-green-800 text-green-300 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded me-2 border border-green-500'>
          PAID
        </span>
      )}
      {status === 'UNPAID' && (
        <span className='bg-red-800 text-red-300 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded me-2 border border-red-500'>
          UNPAID
        </span>
      )}
    </>
  );
};

export default Status;
