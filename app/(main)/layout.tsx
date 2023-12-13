'use client';

import { ReactNode, useEffect } from 'react';
import { Next13ProgressBar } from 'next13-progressbar';

import { Business, SuccessResponse } from '#/common.types';
import { useUserContext } from '#/components/contexts/UserContext';
import Navigation from '#/components/shared/Navigation';
import { useBusinessModal } from '#/hooks/useBusinessModal';
import getBusiness from '#/lib/actions/getBusiness';
import getLastCreatedBusiness from '#/lib/actions/getLastCreatedBusiness';

const UserLayout = ({
	children
}: {
  children: ReactNode
}) => {
	const isOpen = useBusinessModal(state => state.isOpen);
	const onOpen = useBusinessModal(state => state.onOpen);
	const onClose = useBusinessModal(state => state.onClose);
	const { selectedBusiness, selectBusiness } = useUserContext();

	useEffect(() => {
		const fetchData = async () => {
			if (selectedBusiness) {
				const business = await getBusiness(selectedBusiness.id) as SuccessResponse<Business>;

				if (!business.data) {
					// Get last created business by user
					const business = await getLastCreatedBusiness() as SuccessResponse<Business>;

					if (!isOpen && !business.data) {
						selectBusiness(null);
					} else {
						selectBusiness(business.data);
						onClose();
					}
				} else {
					selectBusiness(business.data);
					onClose();
				}
			} else {
				// Get last created business by user
				const business = await getLastCreatedBusiness() as SuccessResponse<Business>;

				if (!isOpen && !business.data) {
					selectBusiness(null);
				} else {
					selectBusiness(business.data);
					onClose();
				}
			}
		};
		fetchData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (!isOpen && !selectedBusiness) {
			onOpen();
		}
	}, [isOpen, onOpen, selectedBusiness]);
	
	return (
		<div className='h-full overflow-hidden flex'>
			<Next13ProgressBar height='3.5px' color='#24a3fe' options={{ showSpinner: false }} startPosition={0.7} showOnShallow />
			<Navigation />
			<main className='h-[calc(100%-60px)] mt-[60px] flex-1 overflow-y-auto'>
				{children}
			</main>
		</div>
	)
}

export default UserLayout;
