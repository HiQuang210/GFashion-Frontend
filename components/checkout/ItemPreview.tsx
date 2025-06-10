import React from 'react';
import { View, Text, Image } from 'react-native';
import { CartItemData } from '@/types/user';
import { CartUtils } from '@/utils/cartHelper';
import { styles } from '@/styles/cart/itempreview';

interface CheckoutItemPreviewProps {
  item: CartItemData;
}

export default function CheckoutItemPreview({ item }: CheckoutItemPreviewProps) {
  const { product, color, size, quantity } = item;
  const unitPrice = product.price;
  const totalPrice = unitPrice * quantity;
  const firstImage = product.images?.[0];

  return (
    <View style={styles.container}>
      {/* Product Image */}
      <View style={styles.imageContainer}>
        {firstImage ? (
          <Image
            source={{ uri: firstImage }}
            style={styles.productImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>No Image</Text>
          </View>
        )}
      </View>

      {/* Product Details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.productName} numberOfLines={2}>
          {product.name}
        </Text>
        
        <View style={styles.variantContainer}>
          <Text style={styles.variantLabel}>Color: </Text>
          <Text style={styles.variantValue}>{color}</Text>
          <Text style={styles.variantSeparator}> • </Text>
          <Text style={styles.variantLabel}>Size: </Text>
          <Text style={styles.variantValue}>{size}</Text>
        </View>

        <View style={styles.priceContainer}>
          <Text style={styles.unitPrice}>
            {CartUtils.formatPrice(unitPrice)} × {quantity}
          </Text>
          <Text style={styles.totalPrice}>
            {CartUtils.formatPrice(totalPrice)}
          </Text>
        </View>
      </View>
    </View>
  );
}