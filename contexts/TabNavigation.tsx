import { createContext, useContext } from "react";

type TabNavigationContextType = {
  navigateToTab: (tabKey: string) => void;
};

const TabNavigationContext = createContext<TabNavigationContextType>({
  navigateToTab: () => {},
});

export const useTabNavigation = () => {
  const context = useContext(TabNavigationContext);
  if (!context) {
    throw new Error('useTabNavigation must be used within a TabNavigationProvider');
  }
  return context;
};

export const TabNavigationProvider = TabNavigationContext.Provider;
export default TabNavigationContext;