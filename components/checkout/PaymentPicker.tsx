import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from '@/styles/cart/checkout';

export type PaymentMethod = 'cod' | 'credit_card';

interface PaymentPickerProps {
  selectedMethod: PaymentMethod;
  onMethodSelect: (method: PaymentMethod) => void;
}

export default function PaymentPicker({ selectedMethod, onMethodSelect }: PaymentPickerProps) {
  return (
    <View>
      <Text style={styles.sectionTitle}>Payment Method</Text>
      <View style={styles.paymentMethodContainer}>
        <TouchableOpacity
          style={[
            styles.optionButtonSmall,
            selectedMethod === 'cod' && styles.optionButtonSelected
          ]}
          onPress={() => onMethodSelect('cod')}
        >
          <MaterialCommunityIcons name="truck-delivery-outline" size={18} color="#333" />
          <Text style={styles.optionTextSmall}>Cash on Delivery</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.optionButtonSmall,
            selectedMethod === 'credit_card' && styles.optionButtonSelected
          ]}
          onPress={() => onMethodSelect('credit_card')}
        >
          <MaterialCommunityIcons name="credit-card-outline" size={18} color="#333" />
          <Text style={styles.optionTextSmall}>Credit Card</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
