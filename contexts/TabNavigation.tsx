import React, { createContext, useContext } from 'react';

interface TabNavigationContextType {
  navigateToTab: (tabKey: string) => void;
  refreshCartCount: () => Promise<void>;
}

const TabNavigationContext = createContext<TabNavigationContextType | undefined>(undefined);

export const TabNavigationProvider: React.FC<{
  value: TabNavigationContextType;
  children: React.ReactNode;
}> = ({ value, children }) => {
  return (
    <TabNavigationContext.Provider value={value}>
      {children}
    </TabNavigationContext.Provider>
  );
};

export const useTabNavigation = (): TabNavigationContextType => {
  const context = useContext(TabNavigationContext);
  if (context === undefined) {
    throw new Error('useTabNavigation must be used within a TabNavigationProvider');
  }
  return context;
};