'use client';

import { useEffect, useState } from 'react';

import CreateBusinessModal from '#/components/modals/CreateBusinessModal';
import CreateCustomerModal from '#/components/modals/CreateCustomerModal';
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
			<CreateBusinessModal />
			<CreateCustomerModal />
			<InvoiceExitModal />
		</>
	);
};
