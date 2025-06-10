import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '@/hooks/useAuth';
import { UserAPI } from '@/api/services/UserService';
import { CartItemData } from '@/types/user';
import { CartUtils } from '@/utils/cartHelper';
import { useToast } from '@/hooks/useToast';
import CartItem from '@/components/CartItem';
import text from '@/styles/text';
import { styles } from '@/styles/cart/cartpage';

export default function CartPage() {
  const { userInfo } = useAuth();
  const queryClient = useQueryClient();
  const { showErrorToast, showSuccessToast } = useToast();

  const { data: cartItems = [], isLoading, refetch, error } = useQuery<CartItemData[]>({
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
    retry: 2,
  });

  React.useEffect(() => {
    if (error) {
      const errorMessage = CartUtils.getErrorMessage(error, 'Failed to load cart');
      showErrorToast('Error', errorMessage);
    }
  }, [error, showErrorToast]);

  useFocusEffect(
    React.useCallback(() => {
      if (userInfo?._id) {
        refetch();
      }
    }, [userInfo?._id, refetch])
  );

  const handleCartUpdate = React.useCallback(async (itemId: string, newQuantity: number) => {
    const item = cartItems.find(item => item._id === itemId);
    if (!item) return;
    queryClient.setQueryData<CartItemData[]>(['userCart', userInfo?._id], (oldData) => {
      if (!oldData) return [];
      return oldData.map(cartItem => 
        cartItem._id === itemId 
          ? { ...cartItem, quantity: newQuantity }
          : cartItem
      );
    });
    
    try {
      const response = await CartUtils.updateCartItemQuantity(
        item.product._id,
        item.color,
        item.size,
        newQuantity
      );

      if (response.status === 'OK') {
        if (response.cart) {
          queryClient.setQueryData<CartItemData[]>(['userCart', userInfo?._id], response.cart);
        }
        showSuccessToast('Updated', 'Cart updated successfully');
      } else {
        queryClient.invalidateQueries({ 
          queryKey: ['userCart', userInfo?._id] 
        });
        showErrorToast('Error', response.message || 'Failed to update cart');
      }
    } catch (error) {
      queryClient.invalidateQueries({ 
        queryKey: ['userCart', userInfo?._id] 
      });
      const errorMessage = CartUtils.getErrorMessage(error, 'Failed to update cart');
      showErrorToast('Error', errorMessage);
    }
  }, [cartItems, queryClient, userInfo?._id, showErrorToast, showSuccessToast]);

  const handleCartRemove = React.useCallback(async (itemId: string) => {
    const item = cartItems.find(item => item._id === itemId);
    if (!item) return;

    queryClient.setQueryData<CartItemData[]>(['userCart', userInfo?._id], (oldData) => {
      if (!oldData) return [];
      return oldData.filter(cartItem => cartItem._id !== itemId);
    });
    
    try {
      const response = await CartUtils.removeCartItem(
        item.product._id,
        item.color,
        item.size
      );

      if (response.status === 'OK') {
        if (response.cart) {
          queryClient.setQueryData<CartItemData[]>(['userCart', userInfo?._id], response.cart);
        }
        showSuccessToast('Removed', 'Item removed from cart');
      } else {
        queryClient.invalidateQueries({ 
          queryKey: ['userCart', userInfo?._id] 
        });
        showErrorToast('Error', response.message || 'Failed to remove item');
      }
    } catch (error) {
      queryClient.invalidateQueries({ 
        queryKey: ['userCart', userInfo?._id] 
      });
      const errorMessage = CartUtils.getErrorMessage(error, 'Failed to remove item');
      showErrorToast('Error', errorMessage);
    }
  }, [cartItems, queryClient, userInfo?._id, showErrorToast, showSuccessToast]);

  const cartSummary = React.useMemo(() => {
    return CartUtils.getCartSummary(cartItems);
  }, [cartItems]);

  const renderCartItem = React.useCallback(({ item }: { item: CartItemData }) => (
    <CartItem
      data={item}
      onQuantityChange={handleCartUpdate}
      onRemove={handleCartRemove}
    />
  ), [handleCartUpdate, handleCartRemove]);

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        Your cart is empty.{'\n'}Start adding products to your cart!
      </Text>
    </View>
  );

  const renderLoadingState = () => (
    <View style={styles.emptyContainer}>
      <ActivityIndicator size="large" color="#704F38" />
      <Text style={styles.loadingText}>Loading your cart...</Text>
    </View>
  );

  const renderCartSummary = () => {
    if (cartSummary.isEmpty) return null;

    return (
      <View style={styles.summaryContainer}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Items:</Text>
          <Text style={styles.summaryValue}>{cartSummary.itemCount}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Quantity:</Text>
          <Text style={styles.summaryValue}>{cartSummary.totalItems}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Price:</Text>
          <Text style={styles.summaryPrice}>
            {cartSummary.formattedPrice}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[text.base_text, styles.title]}>My Cart</Text>
        {!cartSummary.isEmpty && (
          <Text style={styles.cartCount}>
            {cartSummary.itemCount} item{cartSummary.itemCount !== 1 ? 's' : ''}
          </Text>
        )}
      </View>

      {/* Cart Content */}
      <View style={styles.cartContainer}>
        {isLoading ? (
          renderLoadingState()
        ) : (
          <FlatList<CartItemData>
            data={cartItems}
            renderItem={renderCartItem}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.cartList}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={renderEmptyState}
            ListFooterComponent={renderCartSummary}
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            windowSize={10}
            getItemLayout={(data, index) => ({
              length: 120, 
              offset: 120 * index,
              index,
            })}
          />
        )}
      </View>
    </SafeAreaView>
  );
}