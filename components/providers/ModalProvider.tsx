'use client';

import { useEffect, useState } from 'react';

import BusinessModal from '#/components/modals/BusinessModal';
import CustomerModal from '#/components/modals/CustomerModal';
import InvoiceExitModal from '#/components/modals/InvoiceExitModal';
import SettingsModal from '#/components/modals/SettingsModal';

export const ModalProvider = () => {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) {
		return null;
	}

	return (
		<>
			<SettingsModal />
			<BusinessModal />
			<CustomerModal />
			<InvoiceExitModal />
		</>
	);
};
