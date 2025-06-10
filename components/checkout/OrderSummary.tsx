import React from 'react';
import { View, Text } from 'react-native';
import { CartUtils } from '@/utils/cartHelper';
import { styles } from '@/styles/cart/ordersummary';

interface OrderSummaryProps {
  itemCount: number;
  totalPrice: number;
  shippingFee: number;
  totalOrderAmount: number;
}

export default function OrderSummary({ 
  itemCount, 
  totalPrice, 
  shippingFee, 
  totalOrderAmount 
}: OrderSummaryProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Order Summary</Text>
      
      <View style={styles.summaryContainer}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>
            Items ({itemCount})
          </Text>
          <Text style={styles.summaryValue}>
            {CartUtils.formatPrice(totalPrice)}
          </Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Shipping Fee</Text>
          <Text style={styles.summaryValue}>
            {CartUtils.formatPrice(shippingFee)}
          </Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>
            {CartUtils.formatPrice(totalOrderAmount)}
          </Text>
        </View>
      </View>
    </View>
  );
}