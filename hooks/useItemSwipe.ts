import { useRef, useCallback, useState } from 'react';
import { Animated, PanResponder } from 'react-native';

interface SwipeToDeleteConfig {
  swipeThreshold?: number;
  deleteAreaWidth?: number;
  velocityThreshold?: number;
  onDelete?: () => void;
  disabled?: boolean;
}

interface SwipeToDeleteReturn {
  translateX: Animated.Value;
  panResponder: any;
  isSwipeActive: boolean;
  resetSwipePosition: () => void;
  setIsSwipeActive: (active: boolean) => void;
  handleDeletePress: () => void;
}

export const useSwipeToDelete = ({
  swipeThreshold = -60,
  deleteAreaWidth = 80,
  velocityThreshold = 0.3,
  onDelete,
  disabled = false,
}: SwipeToDeleteConfig = {}): SwipeToDeleteReturn => {
  const [isSwipeActive, setIsSwipeActive] = useState(false);
  const translateX = useRef(new Animated.Value(0)).current;
  const isAnimatingRef = useRef(false);

  const resetSwipePosition = useCallback(() => {
    if (isAnimatingRef.current) return;
    
    isAnimatingRef.current = true;
    translateX.setOffset(0);
    
    Animated.spring(translateX, {
      toValue: 0,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start(() => {
      isAnimatingRef.current = false;
      setIsSwipeActive(false);
    });
  }, [translateX]);

  const handleDeletePress = useCallback(() => {
    onDelete?.();
    resetSwipePosition();
  }, [onDelete, resetSwipePosition]);

  const animateToPosition = useCallback((toValue: number) => {
    isAnimatingRef.current = true;
    
    Animated.spring(translateX, {
      toValue,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start(() => {
      isAnimatingRef.current = false;
      setIsSwipeActive(toValue !== 0);
    });
  }, [translateX]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      
      onMoveShouldSetPanResponder: (_, { dx, dy }) => {
        if (disabled || isAnimatingRef.current) return false;
        
        const isHorizontalSwipe = Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10;
        const currentTranslate = (translateX as any).__getValue();
        const swipeInProgress = Math.abs(currentTranslate) > 0;
        const isSwipeAllowed = dx < -10 || (swipeInProgress && dx > 10);
        
        return isHorizontalSwipe && isSwipeAllowed;
      },

      onPanResponderGrant: () => {
        if (isAnimatingRef.current || disabled) return;
        
        translateX.stopAnimation();
        translateX.flattenOffset();
        translateX.setOffset(0);
        translateX.setValue(0);
        setIsSwipeActive(true);
      },

      onPanResponderMove: (_, { dx }) => {
        if (disabled) return;
        
        const clampedDx = Math.max(-deleteAreaWidth, Math.min(0, dx));
        translateX.setValue(clampedDx);
      },

      onPanResponderRelease: (_, { dx, vx }) => {
        if (disabled) return;
        
        translateX.flattenOffset();
        const currentTranslate = (translateX as any).__getValue();
        
        const shouldShowDelete = dx < swipeThreshold || vx < -velocityThreshold;
        const shouldCloseDelete = currentTranslate < 0 && (dx > Math.abs(swipeThreshold) || vx > velocityThreshold);

        let toValue = 0;
        if (shouldShowDelete) {
          toValue = -deleteAreaWidth;
        } else if (shouldCloseDelete) {
          toValue = 0;
        } else {
          toValue = currentTranslate < -deleteAreaWidth / 2 ? -deleteAreaWidth : 0;
        }

        animateToPosition(toValue);
      },

      onPanResponderTerminate: () => {
        if (!disabled) {
          translateX.flattenOffset();
          resetSwipePosition();
        }
      },

      onPanResponderTerminationRequest: () => false,
    })
  ).current;

  return {
    translateX,
    panResponder,
    isSwipeActive,
    resetSwipePosition,
    setIsSwipeActive,
    handleDeletePress,
  };
};