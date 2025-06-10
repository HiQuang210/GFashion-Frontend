import React, { useState, useCallback } from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  Modal
} from 'react-native';
import { router } from 'expo-router';
import { CartItemProps } from '@/types/user';
import { CartUtils } from '@/utils/cartHelper';
import { styles } from '@/styles/cart/cartitem';

export default function CartItem({ data, onQuantityChange, onRemove }: CartItemProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);

  const validation = React.useMemo(() => {
    return CartUtils.validateCartItem(data);
  }, [data]);

  if (!validation.isValid) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          {validation.errorMessage || 'Invalid cart item'}
        </Text>
      </View>
    );
  }

  const handleQuantityUpdate = useCallback(async (newQuantity: number) => {
    if (isLoading || !data || !onQuantityChange) return;

    setIsLoading(true);
    try {
      await onQuantityChange(data._id, newQuantity);
    } catch (error) {
      console.error('Quantity update failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, [data?._id, isLoading, onQuantityChange]);

  const handleRemoveItem = useCallback(async () => {
    if (isLoading || !data || !onRemove) return;

    setIsLoading(true);
    try {
      await onRemove(data._id);
      setShowRemoveModal(false);
    } catch (error) {
      console.error('Remove item failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, [data?._id, isLoading, onRemove]);

  const handleIncrement = useCallback(() => {
    if (isLoading) return;
    handleQuantityUpdate(data.quantity + 1);
  }, [isLoading, data.quantity, handleQuantityUpdate]);

  const handleDecrement = useCallback(() => {
    if (isLoading) return;
    
    if (data.quantity === 1) {
      setShowRemoveModal(true);
    } else {
      handleQuantityUpdate(data.quantity - 1);
    }
  }, [isLoading, data.quantity, handleQuantityUpdate]);

  const handleNavigateToProduct = useCallback(() => {
    if (!isLoading) {
      router.push({ 
        pathname: '/product/[id]', 
        params: { id: data.product._id } 
      });
    }
  }, [data.product._id, isLoading]);

  const handleCloseModal = useCallback(() => {
    setShowRemoveModal(false);
  }, []);

  const formattedPrice = React.useMemo(() => {
    return CartUtils.formatPrice(data.product.price);
  }, [data.product.price]);

  const RemoveConfirmationModal = React.memo(() => (
    <Modal
      visible={showRemoveModal}
      transparent={true}
      animationType="fade"
      onRequestClose={handleCloseModal}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Remove Item</Text>
          <Text style={styles.modalMessage}>
            Are you sure you want to remove this item from your cart?
          </Text>
          
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={handleCloseModal}
              disabled={isLoading}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.modalButton, styles.removeButton]}
              onPress={handleRemoveItem}
              disabled={isLoading}
            >
              <Text style={styles.removeButtonText}>
                {isLoading ? 'Removing...' : 'Remove'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  ));

  const imageUri = data.product.images?.[0] || '';

  return (
    <>
      <TouchableOpacity
        style={styles.container}
        onPress={handleNavigateToProduct}
        disabled={isLoading}
        activeOpacity={0.7}
      >
        <View style={styles.itemContainer}>
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
                isLoading && styles.disabledButton
              ]}
              onPress={handleDecrement}
              disabled={isLoading}
              activeOpacity={0.7}
            >
              <Text style={styles.decrementButtonText}>-</Text>
            </TouchableOpacity>
            
            <Text style={styles.quantityText}>
              {data.quantity}
            </Text>
            
            <TouchableOpacity
              style={[
                styles.quantityButton,
                styles.incrementButton,
                isLoading && styles.disabledButton
              ]}
              onPress={handleIncrement}
              disabled={isLoading}
              activeOpacity={0.7}
            >
              <Text style={styles.incrementButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Loading overlay */}
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <Text style={styles.loadingText}>Updating...</Text>
          </View>
        )}
      </TouchableOpacity>
      <RemoveConfirmationModal />
    </>
  );
}