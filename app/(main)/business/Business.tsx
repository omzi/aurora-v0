'use client';

import { ImageIcon, PenIcon, PlusIcon } from 'lucide-react';

import { useUserContext } from '#/components/contexts/UserContext';
import { Avatar, AvatarFallback, AvatarImage } from '#/components/ui/avatar';
import { Button } from '#/components/ui/button';
import { Skeleton } from '#/components/ui/skeleton';
import { useBusinessModal } from '#/hooks/useBusinessModal';

const BusinessInfo = () => {
	const businessModal = useBusinessModal();
	const { selectedBusiness } = useUserContext();
	if (!selectedBusiness) return;

	return (
		<div className='px-2 sm:px-6 flex flex-col py-5 mb-5'>
			<div className='flex flex-col sm:flex-row gap-2 items-center justify-between'>
				<h1 className='text-2xl font-semibold'>Business Information</h1>
				<Button onClick={businessModal.onOpen} className='bg-core hover:bg-blue-800 text-white'>
					<PlusIcon className='h-4 w-4 mr-2' />
          New Business
				</Button>
			</div>

			<div className='p-4 md:p-12 pt-6 lg:pt-12 mt-4 w-full flex'>
				<div className='flex flex-col lg:flex-row items-center w-full gap-6 lg:gap-20'>
					{selectedBusiness?.logo ? (
						<Avatar className='w-24 h-24 rounded-full'>
							<AvatarImage
								src={selectedBusiness!.logo}
								alt={selectedBusiness!.name}
							/>
							<AvatarFallback>
								<Skeleton className='h-24 w-24 rounded' />
							</AvatarFallback>
						</Avatar>
					) : (
						<div className='inline-block rounded-full justify-center items-center p-9 text-5xl bg-gray-300'>
							<ImageIcon />
						</div>
					)}
					<div className='w-full lg:w-[80%]'>
						<div className=' w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-5 md:gap-y-8 gap-x-8 justify-between'>
							<div className='flex flex-col gap-2'>
								<div className='text-base sm:text-lg text-gray-400 '>
                  Business Name
								</div>
								<h1 className='text-lg'>
									{selectedBusiness?.name}
								</h1>
							</div>
							<div className='flex flex-col gap-2'>
								<div className='text-base sm:text-lg text-gray-400'>
                  Business Email
								</div>
								<h1 className='text-lg break-words'>
									{selectedBusiness?.email || 'Not Available'}
								</h1>
							</div>
							<div className='flex flex-col gap-2'>
								<div className='text-base sm:text-lg text-gray-400'>
                  Business Address
								</div>
								<h1 className='text-lg'>
									{selectedBusiness?.address || 'Not Available'}
								</h1>
							</div>
							<div className='flex flex-col gap-2'>
								<div className='text-base sm:text-lg text-gray-400'>
                  Business Description
								</div>
								<h1 className='text-lg'>
									{selectedBusiness?.description || 'Not Available'}
								</h1>
							</div>
							<div className='flex flex-col gap-2'>
								<div className='text-base sm:text-lg text-gray-400'>
                  Business Phone Number
								</div>
								<h1 className='text-lg'>
									{selectedBusiness?.phoneNumber || 'Not Available'}
								</h1>
							</div>
							<div className='flex flex-col gap-2'>
								<div className='text-base sm:text-lg text-gray-400'>
                  Registeration Number
								</div>
								<h1 className='text-lg'>
									{selectedBusiness?.registrationNumber || 'Not Available'}
								</h1>
							</div>
						</div>
					</div>
				</div>
			</div>
			<Button
				onClick={businessModal.toggleEditMode}
				className='self-start mx-auto bg-core hover:bg-blue-800 text-white'
			>
				<PenIcon className='h-4 w-4 mr-2' />
        Edit Business Informatiion
			</Button>
		</div>
	);
};

export default BusinessInfo;
