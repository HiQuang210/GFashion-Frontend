import { useCallback, useRef } from 'react';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

interface UseNavigationOptions {
  throttleTime?: number;
  debounceDelay?: number;
  logErrors?: boolean;
}

export const useNavigation = (options: UseNavigationOptions = {}) => {
  const {
    throttleTime = 300,
    debounceDelay = 50, 
    logErrors = false  
  } = options;

  const navigationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastNavigationTime = useRef<number>(0);
  const isNavigating = useRef<boolean>(false);

  useFocusEffect(
    useCallback(() => {
      return () => {
        if (navigationTimeoutRef.current) {
          clearTimeout(navigationTimeoutRef.current);
          navigationTimeoutRef.current = null;
        }
        isNavigating.current = false;
      };
    }, [])
  );

  const safeNavigate = useCallback((
    path: string, 
    method: 'push' | 'replace' | 'navigate' = 'navigate'
  ) => {
    const now = Date.now();
    const timeSinceLastNavigation = now - lastNavigationTime.current;
  
    // Check if we're already navigating
    if (isNavigating.current) {
      if (logErrors) {
        console.log('Navigation already in progress');
      }
      return false;
    }

    // More lenient throttling check
    if (timeSinceLastNavigation < throttleTime) {
      if (logErrors) {
        console.log(`Navigation throttled: ${timeSinceLastNavigation}ms < ${throttleTime}ms`);
      }
      return false;
    }
    
    lastNavigationTime.current = now;
    isNavigating.current = true;
   
    // Clear any existing timeout
    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current);
    }
   
    // Use shorter debounce or navigate immediately for better UX
    const executeNavigation = () => {
      try {
        switch (method) {
          case 'push':
            router.push(path as any);
            break;
          case 'replace':
            router.replace(path as any);
            break;
          case 'navigate':
            router.navigate(path as any);
            break;
        }
      } catch (error) {
        if (logErrors) {
          console.error(`Navigation error to ${path}:`, error);
        }
      } finally {
        // Reset navigation flag after a short delay
        setTimeout(() => {
          isNavigating.current = false;
        }, 100);
      }
    };

    if (debounceDelay > 0) {
      navigationTimeoutRef.current = setTimeout(executeNavigation, debounceDelay);
    } else {
      executeNavigation();
    }
    
    return true;
  }, [throttleTime, debounceDelay, logErrors]);

  const navigateTo = useCallback((path: string) => {
    return safeNavigate(path, 'navigate');
  }, [safeNavigate]);

  const pushTo = useCallback((path: string) => {
    return safeNavigate(path, 'push');
  }, [safeNavigate]);

  const replaceTo = useCallback((path: string) => {
    return safeNavigate(path, 'replace');
  }, [safeNavigate]);

  // Immediate navigation methods for critical flows
  const immediateNavigate = useCallback((path: string, method: 'push' | 'replace' | 'navigate' = 'navigate') => {
    isNavigating.current = true;
    try {
      switch (method) {
        case 'push':
          router.push(path as any);
          break;
        case 'replace':
          router.replace(path as any);
          break;
        case 'navigate':
          router.navigate(path as any);
          break;
      }
      return true;
    } catch (error) {
      if (logErrors) {
        console.error(`Immediate navigation error to ${path}:`, error);
      }
      return false;
    } finally {
      setTimeout(() => {
        isNavigating.current = false;
      }, 100);
    }
  }, [logErrors]);

  const goToLogin = useCallback(() => {
    return immediateNavigate('/login', 'replace');
  }, [immediateNavigate]);

  const goToSignUp = useCallback(() => {
    return immediateNavigate('/signup', 'replace');
  }, [immediateNavigate]);

  const goToForgotPassword = useCallback(() => {
    return immediateNavigate('/forgotpass', 'push');
  }, [immediateNavigate]);

  const goBack = useCallback(() => {
    if (isNavigating.current) {
      return false;
    }

    isNavigating.current = true;
    try {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/');
      }
      return true;
    } catch (error) {
      if (logErrors) {
        console.error('Go back error:', error);
      }
      return false;
    } finally {
      setTimeout(() => {
        isNavigating.current = false;
      }, 100);
    }
  }, [logErrors]);

  const cleanup = useCallback(() => {
    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current);
      navigationTimeoutRef.current = null;
    }
    isNavigating.current = false;
  }, []);

  return {
    navigateTo,
    pushTo,
    replaceTo,
    safeNavigate,
    immediateNavigate,
    
    goToLogin,
    goToSignUp,
    goToForgotPassword,
    goBack,
    
    cleanup,
    
    canNavigate: () => {
      if (isNavigating.current) return false;
      const now = Date.now();
      const timeSinceLastNavigation = now - lastNavigationTime.current;
      return timeSinceLastNavigation >= throttleTime;
    },

    isNavigating: () => isNavigating.current,
  };
};