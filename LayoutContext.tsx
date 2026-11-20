// src/contexts/LayoutContext.tsx
import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface LayoutContextType {
  showFooter: boolean;
  setShowFooter: (show: boolean) => void;
  showHeader: boolean; // NEW: State for Header
  setShowHeader: (show: boolean) => void; // NEW: Setter for Header
}

export const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const LayoutProvider = ({ children }: { children: ReactNode }) => {
  const [showFooter, setShowFooter] = useState(true); 
  const [showHeader, setShowHeader] = useState(true); // NEW: Default to true

  return (
    <LayoutContext.Provider value={{ showFooter, setShowFooter, showHeader, setShowHeader }}>
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};