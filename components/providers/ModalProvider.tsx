'use client';

import { useEffect, useState } from 'react';

import SettingsModal from '#/components/modals/SettingsModal';
import CreateBusinessModal from '#/components/modals/CreateBusinessModal';
import CreateCustomerModal from '#/components/modals/CreateCustomerModal';
import ConfirmLeaveInvoice from '#/components/modals/ConfirmLeaveInvoice';

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
      <ConfirmLeaveInvoice />
    </>
  );
};
