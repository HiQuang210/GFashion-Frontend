import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Product, ProductVariant } from "@/types/product";
import QuantityPickerModal from "@/components/QuantityPicker";
import { styles } from "@/styles/product-detail/bottomBar";

interface ProductBottomBarProps {
  price: number;
  selectedSizeStock: number;
  product: Product;
  currentVariant: ProductVariant;
  selectedSize: string;
  onCartUpdate?: () => void;
}

export default function ProductBottomBar({ 
  price, 
  selectedSizeStock, 
  product, 
  currentVariant, 
  selectedSize,
  onCartUpdate 
}: ProductBottomBarProps) {
  const [showQuantityModal, setShowQuantityModal] = useState(false);

  const isProductOutOfStock = () => {
    if (!product.variants || product.variants.length === 0) return true;
    return product.variants.every(variant => 
      !variant.sizes || variant.sizes.length === 0 ||
      variant.sizes.every(size => size.stock === 0)
    );
  };

  const handleAddToCart = () => {
    if (!selectedSize) return;
    setShowQuantityModal(true);
  };

  const handleCartUpdate = () => {
    onCartUpdate?.();
    setShowQuantityModal(false);
  };

  const getButtonText = () => {
    if (isProductOutOfStock()) return "Unavailable";
    return "Add to Cart";
  };

  const isButtonDisabled = isProductOutOfStock() || !selectedSize;

  return (
    <>
      <View style={styles.bottomSection}>
        <View style={{ flex: 1 }}>
          {isProductOutOfStock() ? (
            <>
              <Text style={styles.outOfStockMessage}>
                This product is currently
              </Text>
              <Text style={styles.outOfStockMessage}>
                out of stock
              </Text>
            </>
          ) : (
            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>Unit Price</Text>
              <Text style={styles.priceText}>
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                  maximumFractionDigits: 0,
                }).format(price)}
              </Text>

              {selectedSize && selectedSizeStock > 0 && (
                <Text style={styles.stockText}>
                  {selectedSizeStock} available
                </Text>
              )}
            </View>
          )}
        </View>

        <TouchableOpacity 
          style={[
            styles.addToCartButton, 
            isButtonDisabled && styles.addToCartButtonDisabled
          ]}
          onPress={handleAddToCart}
          disabled={isButtonDisabled}
        >
          <FontAwesome 
            name="shopping-bag" 
            size={20} 
            color={isButtonDisabled ? "#888888" : "#FFFFFF"} 
          />
          <Text style={[
            styles.addToCartText, 
            isButtonDisabled && styles.addToCartTextDisabled
          ]}>
            {getButtonText()}
          </Text>
        </TouchableOpacity>
      </View>

      <QuantityPickerModal
        visible={showQuantityModal}
        onClose={() => setShowQuantityModal(false)}
        product={product}
        currentVariant={currentVariant}
        selectedSize={selectedSize}
        onAddToCart={handleCartUpdate}
      />
    </>
  );
}
