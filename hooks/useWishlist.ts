import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { AppState, AppStateStatus } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { useFavorites } from '@/hooks/useFavorite';

export const useWishlistRealtime = () => {
  const { userInfo } = useAuth();
  const { favorites } = useFavorites();
  const queryClient = useQueryClient();
  const previousFavoritesRef = useRef<string[]>([]);
  const appStateRef = useRef(AppState.currentState);

  useEffect(() => {
    const previousFavorites = previousFavoritesRef.current;
    
    if (previousFavorites.length > 0 && favorites.length !== previousFavorites.length) {
      queryClient.invalidateQueries({ 
        queryKey: ['favoriteProducts', userInfo?._id] 
      });
    }
    
    previousFavoritesRef.current = favorites;
  }, [favorites, queryClient, userInfo?._id]);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (
        appStateRef.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        queryClient.invalidateQueries({ 
          queryKey: ['favoriteProducts', userInfo?._id] 
        });
        queryClient.invalidateQueries({ 
          queryKey: ['userFavorites', userInfo?._id] 
        });
      }
      appStateRef.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  }, [queryClient, userInfo?._id]);

  const refreshWishlist = () => {
    queryClient.invalidateQueries({ 
      queryKey: ['favoriteProducts', userInfo?._id] 
    });
    queryClient.invalidateQueries({ 
      queryKey: ['userFavorites', userInfo?._id] 
    });
  };

  return { refreshWishlist };
};