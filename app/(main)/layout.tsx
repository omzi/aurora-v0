'use client';

import Image from 'next/image';

import { ReactNode, useEffect } from 'react';
import { DehydratedState, HydrationBoundary, useQuery } from '@tanstack/react-query';
import { Next13ProgressBar } from 'next13-progressbar';

import { Business, SuccessResponse } from '#/common.types';
import { useUserContext } from '#/components/contexts/UserContext';
import Navigation from '#/components/shared/Navigation';
import { useBusinessModal } from '#/hooks/useBusinessModal';
import getBusinesses from '#/lib/actions/getBusinesses';

type UserLayoutProps = {
  children: ReactNode,
	dehydratedState: DehydratedState
}

const UserLayout = ({ children, dehydratedState }: UserLayoutProps) => {
	const isOpen = useBusinessModal(state => state.isOpen);
	const onOpen = useBusinessModal(state => state.onOpen);
	const onClose = useBusinessModal(state => state.onClose);
	const { selectedBusiness, selectBusiness } = useUserContext();

	useEffect(() => {
		if (!isOpen && !selectedBusiness) {
			onOpen();
		}
	}, [isOpen, onOpen, selectedBusiness]);

	const { data: businesses, isPending } = useQuery({
		queryKey: ['userBusinesses'],
		queryFn: async () => {
			const response = (await getBusinesses()) as SuccessResponse<Business[]>;

			console.log('Get Businesses Query :>>', response);
			return response.data;
		}
	});

	if (isPending) {
		return <div className='fixed top-0 left-0 right-0 bottom-0 z-[99999] flex items-center justify-center bg-white dark:bg-black'>
			<Image
				className='mx-auto animate-pulse'
				src={'/images/logo.png'}
				height={48}
				width={48}
				alt='Aurora'
				fetchPriority='high'
			/>
		</div>;
	}
	
	if (!businesses) return;

	if (selectedBusiness) {
		const business = businesses.find(({ id }) => id === selectedBusiness.id);

		if (!business) {
			// Get last created business by user
			const [business] = businesses;

			if (!isOpen && !business) {
				selectBusiness(null);
			} else {
				selectBusiness(business);
				onClose();
			}
		} else {
			selectBusiness(business);
			onClose();
		}
	} else {
		// Get last created business by user
		const [business] = businesses;

		if (!isOpen && !business) {
			selectBusiness(null);
		} else {
			selectBusiness(business);
			onClose();
		}
	}
	
	return (
		<HydrationBoundary state={dehydratedState}>
			<div className='h-full overflow-hidden flex'>
				<Next13ProgressBar height='3.5px' color='#24a3fe' options={{ showSpinner: false }} startPosition={0.7} showOnShallow />
				<Navigation />
				<main className='h-[calc(100%-60px)] mt-[60px] flex-1 overflow-hidden overflow-y-auto'>
					{children}
				</main>
			</div>
		</HydrationBoundary>
	)
}

export default UserLayout;
