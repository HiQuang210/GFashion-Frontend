import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { styles } from "@/styles/product-detail/bottomBar";

interface ProductBottomBarProps {
  price: number;
  stock: number;
}

export default function ProductBottomBar({ price, stock }: ProductBottomBarProps) {
  const isOutOfStock = stock === 0;

  return (
    <View style={styles.bottomSection}>
      <View style={styles.priceContainer}>
        <Text style={styles.priceLabel}>Total Price</Text>
        <Text style={styles.priceText}>
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(price)}
        </Text>
        <Text style={[
          styles.stockText,
          isOutOfStock && styles.stockTextEmpty
        ]}>
          {isOutOfStock ? 'Out of stock' : `${stock} available`}
        </Text>
      </View>
      <TouchableOpacity 
        style={[
          styles.addToCartButton,
          isOutOfStock && styles.addToCartButtonDisabled
        ]}
        disabled={isOutOfStock}
      >
        <FontAwesome 
          name="shopping-bag" 
          size={20} 
          color={isOutOfStock ? "#888888" : "#FFFFFF"} 
        />
        <Text style={[
          styles.addToCartText,
          isOutOfStock && styles.addToCartTextDisabled
        ]}>
          Add to Cart
        </Text>
      </TouchableOpacity>
    </View>
  );
}