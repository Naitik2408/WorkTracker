'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface PrivacyContextType {
  hideNumbers: boolean;
  toggleHideNumbers: () => void;
  setHideNumbers: (hide: boolean) => void;
}

const PrivacyContext = createContext<PrivacyContextType>({
  hideNumbers: false,
  toggleHideNumbers: () => {},
  setHideNumbers: () => {},
});

const STORAGE_KEY = 'worktracker_hide_numbers_privacy';

export function PrivacyProvider({ children }: { children: React.ReactNode }) {
  const [hideNumbers, setHideNumbersState] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'true') {
        setHideNumbersState(true);
      }
    } catch {}
  }, []);

  const setHideNumbers = (val: boolean) => {
    setHideNumbersState(val);
    try {
      localStorage.setItem(STORAGE_KEY, String(val));
    } catch {}
  };

  const toggleHideNumbers = () => {
    setHideNumbers(!hideNumbers);
  };

  return (
    <PrivacyContext.Provider value={{ hideNumbers, toggleHideNumbers, setHideNumbers }}>
      {children}
    </PrivacyContext.Provider>
  );
}

export const usePrivacy = () => useContext(PrivacyContext);
