import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { OrderAPI } from '@/api/services/OrderService';
import { useAuth } from '@/hooks/useAuth';
import { Order } from '@/types/order';
import { styles } from '@/styles/orders';

type IoniconsName = 
  | 'time-outline'
  | 'refresh-outline'
  | 'car-outline'
  | 'checkmark-circle-outline'
  | 'close-circle-outline'
  | 'help-outline'
  | 'person-outline'
  | 'location-outline'
  | 'chevron-forward'
  | 'receipt-outline'
  | 'alert-circle-outline';

const OrdersPage = () => {
  const router = useRouter();
  const { userInfo } = useAuth();

  const {
    data: ordersResponse,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['orders', userInfo?._id],
    queryFn: () => OrderAPI.getAllOrders(),
    enabled: !!userInfo,
    staleTime: 5 * 60 * 1000,
  });

  const orders = ordersResponse?.data || [];

  const getStatusIcon = (status: string): IoniconsName => {
    const iconMap: Record<string, IoniconsName> = {
      pending: 'time-outline',
      processing: 'refresh-outline',
      shipping: 'car-outline',
      completed: 'checkmark-circle-outline',
      cancelled: 'close-circle-outline',
    };
    return iconMap[status] || 'help-outline';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const BackButton = () => (
    <TouchableOpacity
      style={{
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#F5F5F5",
        justifyContent: "center",
        alignItems: "center",
      }}
      onPress={() => router.back()}
    >
      <FontAwesome name="arrow-left" size={20} color="#000000" />
    </TouchableOpacity>
  );

  const handleOrderPress = (orderId: string) => {
    router.push({
      pathname: '/order/[id]',
      params: { id: orderId },
    });
  };

  const renderOrderItem = ({ item }: { item: Order }) => {
    const totalAmount = OrderAPI.calculateOrderTotal(item);
    const statusColor = OrderAPI.getOrderStatusColor(item.status);
    const statusText = OrderAPI.getOrderStatusText(item.status);

    return (
      <TouchableOpacity
        style={styles.orderItem}
        onPress={() => handleOrderPress(item._id)}
        activeOpacity={0.7}
      >
        <View style={styles.orderHeader}>
          <View style={styles.orderInfo}>
            <Text style={styles.orderId}>Order #{item._id.slice(-8)}</Text>
            <Text style={styles.orderDate}>{formatDate(item.createdAt)}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Ionicons
              name={getStatusIcon(item.status)}
              size={14}
              color="#fff"
              style={styles.statusIcon}
            />
            <Text style={styles.statusText}>{statusText}</Text>
          </View>
        </View>

        <View style={styles.orderDetails}>
          <View style={styles.recipientInfo}>
            <Ionicons name="person-outline" size={16} color="#666" />
            <Text style={styles.recipientText}>{item.recipient}</Text>
          </View>
          <View style={styles.deliveryInfo}>
            <Ionicons name="location-outline" size={16} color="#666" />
            <Text style={styles.deliveryText} numberOfLines={1}>
              {item.address}
            </Text>
          </View>
        </View>

        <View style={styles.orderFooter}>
          <View style={styles.productsInfo}>
            <Text style={styles.productsCount}>
              {item.products.length} item{item.products.length > 1 ? 's' : ''}
            </Text>
          </View>
          <Text style={styles.totalAmount}>{formatPrice(totalAmount)}</Text>
        </View>

        <View style={styles.chevron}>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="receipt-outline" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>No Orders Yet</Text>
      <Text style={styles.emptySubtitle}>
        Your orders will appear here once you make a purchase
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#704F38" />
        <Text style={styles.loadingText}>Loading your orders...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#DC3545" />
        <Text style={styles.errorTitle}>Failed to Load Orders</Text>
        <Text style={styles.errorSubtitle}>
          Please check your connection and try again
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <BackButton />
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>My Orders</Text>
          <Text style={styles.headerSubtitle}>
            {orders.length} order{orders.length !== 1 ? 's' : ''}
          </Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item._id}
        renderItem={renderOrderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={refetch}
            colors={['#704F38']}
            tintColor="#704F38"
          />
        }
        ListEmptyComponent={renderEmptyState}
      />
    </SafeAreaView>
  );
};
export default OrdersPage;