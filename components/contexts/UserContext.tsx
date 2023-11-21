'use client';

import { Business } from '#/common.types';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type UserContextType = {
  selectedBusiness: Business | null;
  selectBusiness: (business: Business | null) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

type UserProviderProps = {
  children: ReactNode;
};

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(() => {
    if (typeof window !== 'undefined') {
      const storedBusiness = localStorage.getItem('selectedBusiness');
      return storedBusiness && storedBusiness !== 'undefined' ? JSON.parse(storedBusiness) : null;
    } else {
      return null;
    }
  });

  const selectBusiness = (business: Business | null) => setSelectedBusiness(business);

  useEffect(() => {
    // Load the selected business from local storage on mount
    if (typeof window !== 'undefined') {
      const storedBusiness = localStorage.getItem('selectedBusiness');
      if (storedBusiness && storedBusiness !== 'undefined') {
        setSelectedBusiness(JSON.parse(storedBusiness));
      }
    } else {
      setSelectedBusiness(null);
    }
  }, []);

  useEffect(() => {
    // Store the selected business in local storage
    localStorage.setItem('selectedBusiness', JSON.stringify(selectedBusiness));
  }, [selectedBusiness]);

  const contextValue: UserContextType = {
    selectedBusiness,
    selectBusiness
  };

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
};

export const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }

  return context;
};
