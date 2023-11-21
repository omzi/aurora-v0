'use client';

import Image from 'next/image';
import { useQueryClient } from '@tanstack/react-query';

const Dashboard = () => {
  const queryClient = useQueryClient();

	return (
		<div className='h-full flex flex-col items-center justify-center space-y-4'>
			<div className='relative w-[300px] h-[300px]'>
				<Image
					src='/images/empty-state.png'
					fill
					className='object-contain'
					alt='No business created'
				/>
			</div>
			<h2 className='text-lg font-medium'>
				Welcome to your Aurora
			</h2>
		</div>
	)
}

export default Dashboard;
