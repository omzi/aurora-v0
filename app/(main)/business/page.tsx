'use client';

import { useUserContext } from '#/components/contexts/UserContext';
import { Avatar, AvatarFallback, AvatarImage } from '#/components/ui/avatar';
import { Button } from '#/components/ui/button';
import { Label } from '#/components/ui/label';
import { Skeleton } from '#/components/ui/skeleton';
import { useBusinessModal } from '#/hooks/useBusinessModal';
import { ImageIcon } from 'lucide-react';
import Image from 'next/image';

const BusinessInfo = () => {
	const businessModal = useBusinessModal()
	const {selectedBusiness} = useUserContext()
	return (
		<div className='flex flex-col px-4 py-5 md:px-8 md:py-8'>
			<div className='w-full justify-between items-center flex'>
			<h1 className='md:text-2xl text-xl font-semibold'>Business Information</h1>
			<Button onClick={businessModal.onOpen} variant={'outline'}>New Business</Button>
			</div>
			{ !selectedBusiness ?
				<div className='h-full p-4 md:p-[3rem] pt-[1.5rem]  lg:pt-[3rem] mt-[1.3rem] border-t-[1px] flex flex-col items-center justify-center space-y-4'>
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
			:
				<>
						<div className='p-4 md:p-[3rem] pt-[1.5rem]  lg:pt-[3rem] mt-[1.3rem] border-t-[1px] w-full flex'>
				<div className='flex flex-col lg:flex-row items-center w-full  gap-[1.5rem] lg:gap-[5rem]'>
				{selectedBusiness?.logo ? (
					<Avatar className='w-[6rem] h-[6rem] rounded-[50%]'>
					<AvatarImage
					  src={selectedBusiness!.logo}
					  alt={selectedBusiness!.name}
					/>
					<AvatarFallback><Skeleton className='h-4 w-4 rounded' /></AvatarFallback>
				  </Avatar>
				) : (
					<div className='inline-block rounded-[50%] justify-center items-center p-9 text-[3rem] bg-gray-300'><ImageIcon/></div>
				)}
				<div className='w-full lg:w-[80%]'>
				  <div id='allinfo' className=' w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-5 md:gap-y-8 gap-x-8 justify-between  '>
					<div className='flex flex-col gap-[0.4rem]'>
						<div className='text-[0.95rem] sm:text-[1.1rem] text-gray-400 '>Business Name</div>
						<h1 className='text-[1.05rem] sm:text-[1.2rem]'>{selectedBusiness?.name}</h1>
					</div>
					<div className='flex flex-col  gap-[0.4rem]'>
						<div className='text-[0.95rem] sm:text-[1.1rem] text-gray-400'>Business Email</div>
						<h1 className='text-[1.05rem] sm:text-[1.2rem] break-words'>{selectedBusiness?.email || 'Not Available'}</h1>
					</div>
					<div className='flex flex-col  gap-[0.4rem]'>
						<div className='text-[0.95rem] sm:text-[1.1rem] text-gray-400'>Business Category</div>
						<h1 className='text-[1.05rem] sm:text-[1.2rem]'>{selectedBusiness?.category || 'Not Available'}</h1>
					</div>
					<div className='flex flex-col  gap-[0.4rem]'>
						<div className='text-[0.95rem] sm:text-[1.1rem] text-gray-400'>Business Description</div>
						<h1 className='text-[1.05rem] sm:text-[1.2rem]'>{selectedBusiness?.description || 'Not Available'}</h1>
					</div>
					<div className='flex flex-col  gap-[0.4rem]'>
						<div className='text-[0.95rem] sm:text-[1.1rem] text-gray-400'>Business Phone Number</div>
						<h1 className='text-[1.05rem] sm:text-[1.2rem]'>{selectedBusiness?.mobileNumber || 'Not Available'}</h1>
					</div>
					<div className='flex flex-col  gap-[0.4rem]'>
						<div className='text-[0.95rem] sm:text-[1.1rem] text-gray-400'>Registered customers</div>
						<h1 className='text-[1.05rem] sm:text-[1.2rem]'>14</h1>
					</div>
					<div className='flex flex-col  gap-[0.4rem]'>
						<div className='text-[0.95rem] sm:text-[1.1rem] text-gray-400'>Registeration Number</div>
						<h1 className='text-[1.05rem] sm:text-[1.2rem]'>{selectedBusiness?.registrationNumber || 'Not Available'}</h1>
					</div>
					
				  </div>
				 
				</div>
				</div>
			</div>
			<Button onClick={businessModal.toggleEditOpen} className='mx-auto'>Edit Business informatiion</Button>

				</>
			}
		</div>
	)
}

export default BusinessInfo;
