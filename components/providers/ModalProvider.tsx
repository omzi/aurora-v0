'use client';

import { useEffect, useState } from 'react';

import SettingsModal from '#/components/modals/SettingsModal';
import CreateBusinessModal from '#/components/modals/CreateBusinessModal';

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
    </>
  );
};
