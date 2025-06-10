import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Product, ProductVariant } from "@/types/product";
import { useCart } from "@/hooks/useCart";
import { styles } from "@/styles/quantitypicker";

interface QuantityPickerModalProps {
  visible: boolean;
  onClose: () => void;
  product: Product;
  currentVariant: ProductVariant;
  selectedSize: string;
  onAddToCart?: () => void;
  onError?: (errorMessage: string) => void;
}

export default function QuantityPicker({
  visible,
  onClose,
  product,
  currentVariant,
  selectedSize,
  onAddToCart,
  onError,
}: QuantityPickerModalProps) {
  const {
    quantity,
    isLoading,
    availableStock,
    maxQuantity,
    currentCartQuantity,
    errorMessage,
    warningMessage,
    incrementQuantity,
    decrementQuantity,
    resetQuantity,
    addToCart,
    getTotalPrice,
    isValidSelection,
    clearMessages,
  } = useCart({
    product,
    currentVariant,
    selectedSize,
  });

  // Reset quantity when modal opens or variant/size changes
  useEffect(() => {
    if (visible) {
      resetQuantity();
      clearMessages();
    }
  }, [visible, currentVariant?.color, selectedSize, resetQuantity, clearMessages]);

  const handleAddToCart = async () => {
    try {
      const success = await addToCart();
      if (success) {
        onAddToCart?.();
        onClose();
      } else {
        // If addToCart returns false, there should be an errorMessage
        if (errorMessage) {
          onError?.(errorMessage);
        } else {
          onError?.("Failed to add item to cart");
        }
      }
    } catch (error) {
      // Handle any unexpected errors
      const errorMsg = error instanceof Error ? error.message : "An unexpected error occurred";
      onError?.(errorMsg);
    }
  };

  const handleClose = () => {
    clearMessages();
    onClose();
  };

  if (!visible) return null;

  // Check if we have valid data
  const hasValidData = product && currentVariant && selectedSize;
  const canIncrementQuantity = quantity < maxQuantity && (currentCartQuantity + quantity + 1) <= availableStock;
  const canDecrementQuantity = quantity > 1;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Quantity</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <FontAwesome name="times" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          {/* Product Info */}
          <View style={styles.productInfo}>
            <Text style={styles.productName} numberOfLines={2}>
              {product?.name || "Unknown Product"}
            </Text>
            <Text style={styles.variantInfo}>
              Color: {currentVariant?.color || "N/A"} | Size: {selectedSize || "N/A"}
            </Text>
            <Text style={[
              styles.stockInfo,
              availableStock === 0 && { color: '#FF6B6B' }
            ]}>
              {availableStock === 0 
                ? "Out of stock" 
                : `${availableStock} items available`
              }
              {currentCartQuantity > 0 && (
                <Text style={{ color: '#666', fontStyle: 'italic' }}>
                  {` (${currentCartQuantity} in cart)`}
                </Text>
              )}
            </Text>
          </View>

          {/* Error/Warning Messages */}
          {(errorMessage || warningMessage) && (
            <View style={styles.messageContainer}>
              {errorMessage && (
                <View style={styles.errorContainer}>
                  <FontAwesome name="exclamation-triangle" size={16} color="#FF6B6B" />
                  <Text style={styles.errorText}>{errorMessage}</Text>
                </View>
              )}
              {warningMessage && !errorMessage && (
                <View style={styles.warningContainer}>
                  <FontAwesome name="info-circle" size={16} color="#FFA500" />
                  <Text style={styles.warningText}>{warningMessage}</Text>
                </View>
              )}
            </View>
          )}

          {/* Quantity Selector */}
          {hasValidData && availableStock > 0 && (
            <View style={styles.quantitySection}>
              <Text style={styles.quantityLabel}>Quantity</Text>
              <View style={styles.quantityControls}>
                <TouchableOpacity
                  style={[
                    styles.quantityButton,
                    !canDecrementQuantity && styles.quantityButtonDisabled,
                  ]}
                  onPress={decrementQuantity}
                  disabled={!canDecrementQuantity || isLoading}
                >
                  <FontAwesome 
                    name="minus" 
                    size={16} 
                    color={!canDecrementQuantity ? "#ccc" : "#704F38"} 
                  />
                </TouchableOpacity>

                <View style={styles.quantityDisplay}>
                  <Text style={styles.quantityText}>{quantity}</Text>
                </View>

                <TouchableOpacity
                  style={[
                    styles.quantityButton,
                    !canIncrementQuantity && styles.quantityButtonDisabled,
                  ]}
                  onPress={incrementQuantity}
                  disabled={!canIncrementQuantity || isLoading}
                >
                  <FontAwesome 
                    name="plus" 
                    size={16} 
                    color={!canIncrementQuantity ? "#ccc" : "#704F38"} 
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Price Info */}
          {hasValidData && product.price && (
            <View style={styles.priceSection}>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Unit Price:</Text>
                <Text style={styles.priceValue}>
                  {new Intl.NumberFormat('vi-VN', { 
                    style: 'currency', 
                    currency: 'VND', 
                    maximumFractionDigits: 0 
                  }).format(product.price)}
                </Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.totalLabel}>Total:</Text>
                <Text style={styles.totalValue}>
                  {new Intl.NumberFormat('vi-VN', { 
                    style: 'currency', 
                    currency: 'VND', 
                    maximumFractionDigits: 0 
                  }).format(getTotalPrice())}
                </Text>
              </View>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={handleClose}
              disabled={isLoading}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.addToCartButton,
                (isLoading || !isValidSelection()) && styles.addToCartButtonDisabled,
              ]}
              onPress={handleAddToCart}
              disabled={isLoading || !isValidSelection()}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <FontAwesome name="shopping-bag" size={16} color="#FFFFFF" />
                  <Text style={styles.addToCartButtonText}>Add to Cart</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}