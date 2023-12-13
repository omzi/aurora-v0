'use client';

import Image from 'next/image';

const Withdrawals = () => {
	return (
		<div className='h-full flex flex-col items-center justify-center space-y-4'>
			<Image
				src='/images/rocket.png'
				width={96}
				height={96}
				alt='😎 Launching soon'
			/>
			<h2 className='text-xl mt-4 font-medium'>Launching soon</h2>
		</div>
	);
}

export default Withdrawals;
