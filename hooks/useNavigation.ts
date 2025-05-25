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
    throttleTime = 1000,
    debounceDelay = 100,
    logErrors = true
  } = options;

  const navigationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastNavigationTime = useRef<number>(0);

  useFocusEffect(
    useCallback(() => {
      return () => {
        if (navigationTimeoutRef.current) {
          clearTimeout(navigationTimeoutRef.current);
          navigationTimeoutRef.current = null;
        }
      };
    }, [])
  );

  const safeNavigate = useCallback((
    path: string, 
    method: 'push' | 'replace' | 'navigate' = 'replace'
  ) => {
    const now = Date.now();
    const timeSinceLastNavigation = now - lastNavigationTime.current;
  
    if (timeSinceLastNavigation < throttleTime) {
      if (logErrors) {
        console.log(`Navigation throttled: ${timeSinceLastNavigation}ms < ${throttleTime}ms`);
      }
      return false;
    }
    
    lastNavigationTime.current = now;
   
    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current);
    }
   
    navigationTimeoutRef.current = setTimeout(() => {
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
          console.log(`Navigation error to ${path}:`, error);
        }
      }
    }, debounceDelay);
    
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

  const goToLogin = useCallback(() => {
    return replaceTo('/login');
  }, [replaceTo]);

  const goToSignUp = useCallback(() => {
    return replaceTo('/signup');
  }, [replaceTo]);

  const goToForgotPassword = useCallback(() => {
    return pushTo('/forgotpass');
  }, [pushTo]);

  const goBack = useCallback(() => {
    try {
      if (router.canGoBack()) {
        router.back();
      } else {
        replaceTo('/');
      }
    } catch (error) {
      if (logErrors) {
        console.log('Go back error:', error);
      }
    }
  }, [replaceTo, logErrors]);

  const cleanup = useCallback(() => {
    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current);
      navigationTimeoutRef.current = null;
    }
  }, []);

  return {
    navigateTo,
    pushTo,
    replaceTo,
    safeNavigate,
    
    goToLogin,
    goToSignUp,
    goToForgotPassword,
    goBack,
    
    cleanup,
    
    canNavigate: () => {
      const now = Date.now();
      const timeSinceLastNavigation = now - lastNavigationTime.current;
      return timeSinceLastNavigation >= throttleTime;
    }
  };
};