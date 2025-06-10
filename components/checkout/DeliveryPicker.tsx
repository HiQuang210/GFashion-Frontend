import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CartUtils } from '@/utils/cartHelper';
import { styles } from '@/styles/cart/deliverypicker';

export type ShippingType = 'standard' | 'express';

interface ShippingOption {
  type: ShippingType;
  title: string;
  description: string;
  price: number;
  duration: string;
}

interface ShippingTypePickerProps {
  selectedType: ShippingType;
  onTypeSelect: (type: ShippingType) => void;
}

const shippingOptions: ShippingOption[] = [
  {
    type: 'standard',
    title: 'Standard Delivery',
    description: 'Regular delivery service',
    price: 20000,
    duration: '3-5 business days',
  },
  {
    type: 'express',
    title: 'Express Delivery',
    description: 'Fast delivery service',
    price: 50000,
    duration: '1-2 business days',
  },
];

export default function ShippingTypePicker({ selectedType, onTypeSelect }: ShippingTypePickerProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Shipping Options</Text>
      
      {shippingOptions.map((option) => {
        const isSelected = selectedType === option.type;
        
        return (
          <TouchableOpacity
            key={option.type}
            style={[
              styles.optionContainer,
              isSelected && styles.selectedOptionContainer,
            ]}
            onPress={() => onTypeSelect(option.type)}
            activeOpacity={0.7}
          >
            <View style={styles.optionContent}>
              <View style={styles.radioContainer}>
                <View style={[
                  styles.radioButton,
                  isSelected && styles.selectedRadioButton,
                ]}>
                  {isSelected && (
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  )}
                </View>
              </View>
              
              <View style={styles.optionDetails}>
                <View style={styles.optionHeader}>
                  <Text style={[
                    styles.optionTitle,
                    isSelected && styles.selectedOptionTitle,
                  ]}>
                    {option.title}
                  </Text>
                  <Text style={[
                    styles.optionPrice,
                    isSelected && styles.selectedOptionPrice,
                  ]}>
                    {CartUtils.formatPrice(option.price)}
                  </Text>
                </View>
                
                <Text style={styles.optionDescription}>
                  {option.description}
                </Text>
                
                <Text style={styles.optionDuration}>
                  {option.duration}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}