import React, { useState, useCallback, useMemo } from 'react';
import {
  Animated,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { CartUtils } from '@/utils/cartHelper';
import RemoveConfirmationModal from '@/components/RemoveConfirmation';
import { useSwipeToDelete } from '@/hooks/useItemSwipe';
import { styles } from '@/styles/cart/cartitem';
import { CartItemProps } from '@/types/user';

export default function CartItem({ data, onQuantityChange, onRemove }: CartItemProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const validation = useMemo(() => CartUtils.validateCartItem(data), [data]);
  const formattedPrice = useMemo(() => CartUtils.formatPrice(data.product.price), [data.product.price]);
  const imageUri = data.product.images?.[0] || '';

  const {
    translateX,
    panResponder,
    isSwipeActive,
    resetSwipePosition,
    handleDeletePress,
  } = useSwipeToDelete({
    onDelete: () => setShowRemoveModal(true),
    disabled: isLoading,
  });

  const handleQuantityUpdate = useCallback(async (newQuantity: number) => {
    if (isLoading || !data) return;
    
    setIsLoading(true);
    try {
      await onQuantityChange?.(data._id, newQuantity);
    } catch (error) {
      console.error('Quantity update failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, [data?._id, isLoading, onQuantityChange]);

  const handleIncrement = useCallback(() => {
    if (!isLoading) {
      handleQuantityUpdate(data.quantity + 1);
    }
  }, [isLoading, data.quantity, handleQuantityUpdate]);

  const handleDecrement = useCallback(() => {
    if (isLoading) return;
    
    if (data.quantity === 1) {
      setShowRemoveModal(true);
    } else {
      handleQuantityUpdate(data.quantity - 1);
    }
  }, [isLoading, data.quantity, handleQuantityUpdate]);

  const handleRemoveItem = useCallback(async () => {
    if (isLoading || !data) return;
    
    setIsLoading(true);
    try {
      await onRemove?.(data._id);
      setShowRemoveModal(false);
    } catch (error) {
      console.error('Remove item failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, [data?._id, isLoading, onRemove]);

  const handleCloseModal = useCallback(() => {
    setShowRemoveModal(false);
  }, []);

  const handleNavigateToProduct = useCallback(() => {
    if (!isLoading && !isSwipeActive && (translateX as any).__getValue() === 0) {
      router.push({ 
        pathname: '/product/[id]', 
        params: { id: data.product._id } 
      });
    }
  }, [data.product._id, isLoading, isSwipeActive, translateX]);

  if (!validation.isValid) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          {validation.errorMessage || 'Invalid cart item'}
        </Text>
      </View>
    );
  }

  const isInteractionDisabled = isLoading || isSwipeActive;

  return (
    <>
      <View style={styles.swipeContainer}>
        {/* Delete Area */}
        <View style={styles.deleteArea}>
          <TouchableOpacity 
            style={styles.deleteButton} 
            onPress={handleDeletePress}
            activeOpacity={0.8}
          >
            <Ionicons name="trash" size={24} color="#fff" />
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>

        {/* Main Item Container */}
        <Animated.View
          style={[styles.container, { transform: [{ translateX }] }]}
          {...panResponder.panHandlers}
        >
          {/* Swipe Overlay */}
          {isSwipeActive && (
            <TouchableOpacity 
              style={styles.swipeOverlay} 
              onPress={resetSwipePosition}
              activeOpacity={1} 
            />
          )}

          {/* Item Content */}
          <TouchableOpacity
            style={styles.itemContainer}
            onPress={handleNavigateToProduct}
            disabled={isInteractionDisabled}
            activeOpacity={0.7}
          >
            {/* Product Image */}
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: imageUri }}
                resizeMode="cover"
                style={styles.productImage}
                defaultSource={require('@/assets/images/corrugated-box.jpg')}
              />
            </View>

            {/* Product Details */}
            <View style={styles.productDetails}>
              <Text numberOfLines={2} style={styles.productName}>
                {data.product.name}
              </Text>
              <Text style={styles.productVariant}>
                Color: {data.color} • Size: {data.size}
              </Text>
              <View style={styles.priceContainer}>
                <Text style={styles.productPrice}>{formattedPrice}</Text>
              </View>
            </View>

            {/* Quantity Controls */}
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={[
                  styles.quantityButton,
                  styles.decrementButton,
                  isInteractionDisabled && styles.disabledButton,
                ]}
                onPress={handleDecrement}
                disabled={isInteractionDisabled}
                activeOpacity={0.7}
              >
                <Text style={styles.decrementButtonText}>-</Text>
              </TouchableOpacity>

              <Text style={styles.quantityText}>{data.quantity}</Text>

              <TouchableOpacity
                style={[
                  styles.quantityButton,
                  styles.incrementButton,
                  isInteractionDisabled && styles.disabledButton,
                ]}
                onPress={handleIncrement}
                disabled={isInteractionDisabled}
                activeOpacity={0.7}
              >
                <Text style={styles.incrementButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>

          {/* Loading Overlay */}
          {isLoading && (
            <View style={styles.loadingOverlay}>
              <Text style={styles.loadingText}>Updating...</Text>
            </View>
          )}
        </Animated.View>
      </View>

      {/* Remove Confirmation Modal */}
      <RemoveConfirmationModal
        visible={showRemoveModal}
        onCancel={handleCloseModal}
        onConfirm={handleRemoveItem}
        isLoading={isLoading}
      />
    </>
  );
}