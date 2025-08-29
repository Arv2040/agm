'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

interface ActiveStateContextType {
  open: number;
  setIsOpen: (state: number) => void;
}

const ActiveStateContext = createContext<ActiveStateContextType | undefined>(undefined);

export const ActiveStateProvider = ({ children }: { children: ReactNode }) => {
  const [open, setIsOpen] = useState<number>(1); // ✅ correct

  return (
    <ActiveStateContext.Provider value={{ open, setIsOpen }}>
      {children}
    </ActiveStateContext.Provider>
  );
};

export const useActiveState = () => {
  const context = useContext(ActiveStateContext);
  if (!context) {
    throw new Error('useActiveState must be used within ActiveStateProvider');
  }
  return context;
};
