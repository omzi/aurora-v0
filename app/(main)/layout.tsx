'use client';

import { useEffect } from 'react';
import getBusiness from '#/lib/actions/getBusiness';
import Navigation from '#/components/shared/Navigation';
import { Business, SuccessResponse } from '#/common.types';
import { useBusinessModal } from '#/hooks/useBusinessModal';
import { useUserContext } from '#/components/contexts/UserContext';
import getLastCreatedBusiness from '#/lib/actions/getLastCreatedBusiness';

const UserLayout = ({
  children,
}: {
  children: React.ReactNode
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
    <div className='h-full flex'>
			<Navigation />
			<main className='h-full mt-[4rem] flex-1 overflow-y-auto'>
				{children}
			</main>
		</div>
  )
}

export default UserLayout;
