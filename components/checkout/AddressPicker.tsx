import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '@/styles/cart/addresspicker';

interface AddressPickerProps {
  selectedAddress: string;
  onAddressSelect: () => void;
}

export default function AddressPicker({ selectedAddress, onAddressSelect }: AddressPickerProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Delivery Address</Text>
      
      <TouchableOpacity 
        style={styles.addressContainer}
        onPress={onAddressSelect}
        activeOpacity={0.7}
      >
        <View style={styles.addressContent}>
          <View style={styles.iconContainer}>
            <Ionicons name="location-outline" size={24} color="#704F38" />
          </View>
          
          <View style={styles.addressDetails}>
            {selectedAddress ? (
              <>
                <Text style={styles.addressText} numberOfLines={2}>
                  {selectedAddress}
                </Text>
                <Text style={styles.changeText}>Tap to change</Text>
              </>
            ) : (
              <>
                <Text style={styles.selectAddressText}>Select delivery address</Text>
                <Text style={styles.selectAddressSubtext}>Choose where you want your order delivered</Text>
              </>
            )}
          </View>
          
          <View style={styles.arrowContainer}>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}