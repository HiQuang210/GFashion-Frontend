import React, { useState, useMemo, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { UserAPI } from '@/api/services/UserService';
import { CartItemData } from '@/types/user';
import { CartUtils } from '@/utils/cartHelper';
import { useToast } from '@/hooks/useToast';
import CheckoutItemPreview from '@/components/checkout/ItemPreview';
import AddressPicker from '@/components/checkout/AddressPicker';
import ShippingTypePicker from '@/components/checkout/DeliveryPicker';
import OrderNote from '@/components/checkout/OrderNote';
import OrderSummary from '@/components/checkout/OrderSummary';
import { styles } from '@/styles/cart/checkout';
import BackButton from '@/components/BackButton';

export type ShippingType = 'standard' | 'express';

interface SelectedAddressData {
  recipient: string;
  phone: string;
  location: string;
}

export default function CheckoutPage() {
  const { userInfo } = useAuth();
  const router = useRouter();
  const { showErrorToast } = useToast();
  const params = useLocalSearchParams();
  
  const [selectedAddress, setSelectedAddress] = useState<SelectedAddressData | null>(null);
  const [shippingType, setShippingType] = useState<ShippingType>('standard');
  const [orderNote, setOrderNote] = useState<string>('');

  // Handle address selection from route params
  useEffect(() => {
    if (params.selectedAddress) {
      try {
        const addressData = JSON.parse(params.selectedAddress as string);
        setSelectedAddress(addressData);
      } catch (error) {
        console.error('Error parsing selected address:', error);
      }
    }
  }, [params.selectedAddress]);

  const { data: cartItems = [], isLoading, error } = useQuery<CartItemData[]>({
    queryKey: ['userCart', userInfo?._id],
    queryFn: async (): Promise<CartItemData[]> => {
      if (!userInfo?._id) return [];
      
      try {
        const response = await UserAPI.getUserCart();
        return (response.data || []) as CartItemData[];
      } catch (error: any) {
        console.error('Failed to fetch cart:', error);
        throw error;
      }
    },
    enabled: !!userInfo?._id,
    staleTime: 1000 * 60 * 2,
  });

  const cartSummary = useMemo(() => {
    return CartUtils.getCartSummary(cartItems);
  }, [cartItems]);

  const shippingFee = useMemo(() => {
    return shippingType === 'standard' ? 20000 : 50000;
  }, [shippingType]);

  const totalOrderAmount = useMemo(() => {
    return cartSummary.totalPrice + shippingFee;
  }, [cartSummary.totalPrice, shippingFee]);

  React.useEffect(() => {
    if (error) {
      const errorMessage = CartUtils.getErrorMessage(error, 'Failed to load cart');
      showErrorToast('Error', errorMessage);
    }
  }, [error, showErrorToast]);

  const handleAddressSelect = () => {
    router.push('/location-picker');
  };

  const handleCheckout = () => {
    if (!selectedAddress) {
      showErrorToast('Error', 'Please select a delivery address');
      return;
    }

    console.log('Checkout data:', {
      cartItems,
      selectedAddress,
      shippingType,
      orderNote,
      totalAmount: totalOrderAmount,
    });

    // Here you would proceed with the actual checkout process
    // For example, navigate to payment page or submit the order
  };

  const getAddressDisplayText = () => {
    if (!selectedAddress) return '';
    return `${selectedAddress.recipient} - ${selectedAddress.phone}\n${selectedAddress.location}`;
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#704F38" />
          <Text style={styles.loadingText}>Loading checkout...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (cartSummary.isEmpty) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <BackButton />
          <Text style={styles.title}>Checkout</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Your cart is empty</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.title}>Checkout</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Cart Items Preview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Items ({cartSummary.itemCount})</Text>
          {cartItems.map((item) => (
            <CheckoutItemPreview key={item._id} item={item} />
          ))}
        </View>

        {/* Address Picker */}
        <View style={styles.section}>
          <AddressPicker
            selectedAddress={getAddressDisplayText()}
            onAddressSelect={handleAddressSelect}
          />
        </View>

        {/* Shipping Type Picker */}
        <View style={styles.section}>
          <ShippingTypePicker
            selectedType={shippingType}
            onTypeSelect={setShippingType}
          />
        </View>

        {/* Order Note */}
        <View style={styles.section}>
          <OrderNote
            note={orderNote}
            onNoteChange={setOrderNote}
          />
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <OrderSummary
            itemCount={cartSummary.itemCount}
            totalPrice={cartSummary.totalPrice}
            shippingFee={shippingFee}
            totalOrderAmount={totalOrderAmount}
          />
        </View>

        {/* Checkout Button */}
        <View style={styles.checkoutButtonContainer}>
          <TouchableOpacity
            style={[
              styles.checkoutButton,
              !selectedAddress && styles.checkoutButtonDisabled
            ]}
            onPress={handleCheckout}
            activeOpacity={0.8}
            disabled={!selectedAddress}
          >
            <Text style={styles.checkoutButtonText}>
              Place Order
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}