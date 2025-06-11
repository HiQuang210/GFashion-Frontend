import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { OrderAPI } from '@/api/services/OrderService';
import { OrderProduct } from '@/types/order';
import { styles } from '@/styles/order-detail';
import { useToast } from '@/hooks/useToast';

type IoniconsName = 
  | 'receipt-outline'
  | 'refresh-outline'
  | 'car-outline'
  | 'checkmark-circle-outline'
  | 'close-circle'
  | 'arrow-back'
  | 'alert-circle-outline'
  | 'close-circle-outline'
  | 'star-outline'
  | 'bag-outline'
  | 'warning-outline'
  | 'home-outline';

const OrderDetailPage = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const { showSuccessToast, showErrorToast } = useToast();

  const {
    data: orderResponse,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['order', id],
    queryFn: () => OrderAPI.getOrderDetail(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

  const order = orderResponse?.data;

  const cancelOrderMutation = useMutation({
    mutationFn: (orderId: string) => OrderAPI.cancelOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', id] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      setShowCancelModal(false);
      showSuccessToast('Success', 'Order cancelled successfully');
    },
    onError: (error: any) => {
      setShowCancelModal(false);
      showErrorToast('Error', error.response?.data?.message || error.message || 'Failed to cancel order');
    },
  });

  const handleCancelOrder = () => {
    setShowCancelModal(true);
  };

  const confirmCancelOrder = () => {
    if (id) {
      cancelOrderMutation.mutate(id);
    }
  };

  const handleWriteReview = () => {
    router.push({
      pathname: '/order/review',
      params: { orderId: id },
    });
  };

  const handleReturnToShop = () => {
    router.push('/tabs/searchpage');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const getDeliveryFee = (deliveryType: string) => {
    return deliveryType === 'standard' ? 20000 : 50000;
  };

  const getStatusSteps = (currentStatus: string) => {
    const steps = [
      { key: 'pending', label: 'Order Placed', icon: 'receipt-outline' as IoniconsName },
      { key: 'processing', label: 'Processing', icon: 'refresh-outline' as IoniconsName },
      { key: 'shipping', label: 'Shipping', icon: 'car-outline' as IoniconsName },
      { key: 'completed', label: 'Delivered', icon: 'checkmark-circle-outline' as IoniconsName },
    ];

    const statusOrder = ['pending', 'processing', 'shipping', 'completed'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    
    if (currentStatus === 'cancelled') {
      return steps.map((step) => ({
        ...step,
        completed: false,
        active: false,
        cancelled: true,
      }));
    }

    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      active: index === currentIndex,
      cancelled: false,
    }));
  };

  const renderStatusTracker = () => {
    if (!order) return null;

    const steps = getStatusSteps(order.status);

    return (
      <View style={styles.statusTracker}>
        <Text style={styles.sectionTitle}>Order Status</Text>
        <View style={styles.stepsContainer}>
          {steps.map((step, index) => (
            <View key={step.key} style={styles.stepContainer}>
              <View style={styles.stepLine}>
                <View
                  style={[
                    styles.stepCircle,
                    step.completed && styles.stepCircleCompleted,
                    step.active && styles.stepCircleActive,
                    step.cancelled && styles.stepCircleCancelled,
                  ]}
                >
                  <Ionicons
                    name={step.icon}
                    size={16}
                    color={
                      step.completed || step.active
                        ? '#fff'
                        : step.cancelled
                        ? '#DC3545'
                        : '#ccc'
                    }
                  />
                </View>
                {index < steps.length - 1 && (
                  <View
                    style={[
                      styles.stepConnector,
                      step.completed && styles.stepConnectorCompleted,
                    ]}
                  />
                )}
              </View>
              <Text
                style={[
                  styles.stepLabel,
                  step.completed && styles.stepLabelCompleted,
                  step.active && styles.stepLabelActive,
                  step.cancelled && styles.stepLabelCancelled,
                ]}
              >
                {step.label}
              </Text>
            </View>
          ))}
        </View>
        {order.status === 'cancelled' && (
          <View style={styles.cancelledBanner}>
            <Ionicons name="close-circle" size={20} color="#DC3545" />
            <Text style={styles.cancelledText}>Order Cancelled</Text>
          </View>
        )}
      </View>
    );
  };

  const renderProductItem = (product: OrderProduct, index: number) => (
    <View key={`${product.productId}-${index}`} style={styles.productItem}>
      <Image
        source={{ uri: product.image || '@/assets/images/corrugated-box.jpg' }}
        style={styles.productImage}
        defaultSource={{ uri: '@/assets/images/corrugated-box.jpg' }}
      />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.productDetails}>
          {product.color} • {product.size} • {product.producer}
        </Text>
        {product.material && (
          <Text style={styles.productDetails}>Material: {product.material}</Text>
        )}
        <Text style={styles.productQuantity}>Qty: {product.quantity}</Text>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={styles.productPrice}>{formatPrice(product.price)}</Text>
        <Text style={[styles.productDetails, { marginTop: 4 }]}>
          {formatPrice(product.price * product.quantity)}
        </Text>
      </View>
    </View>
  );

  const renderCancelConfirmationModal = () => (
    <Modal
      visible={showCancelModal}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowCancelModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Ionicons name="warning-outline" size={32} color="#DC3545" />
            <Text style={styles.modalTitle}>Cancel Order</Text>
          </View>
          
          <Text style={styles.modalMessage}>
            Are you sure you want to cancel this order? This action cannot be undone and you will need to place a new order if you change your mind.
          </Text>
          
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalCancelButton]}
              onPress={() => setShowCancelModal(false)}
              disabled={cancelOrderMutation.isPending}
            >
              <Text style={styles.modalCancelButtonText}>Keep Order</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.modalButton, styles.modalConfirmButton]}
              onPress={confirmCancelOrder}
              disabled={cancelOrderMutation.isPending}
            >
              {cancelOrderMutation.isPending ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.modalConfirmButtonText}>Cancel Order</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer} edges={['top']}>
        <ActivityIndicator size="large" color="#704F38" />
        <Text style={styles.loadingText}>Loading order details...</Text>
      </SafeAreaView>
    );
  }

  if (error || !order) {
    return (
      <SafeAreaView style={styles.errorContainer} edges={['top']}>
        <Ionicons name="alert-circle-outline" size={48} color="#DC3545" />
        <Text style={styles.errorTitle}>Failed to Load Order</Text>
        <Text style={styles.errorSubtitle}>
          Please check your connection and try again
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const subtotal = OrderAPI.calculateOrderTotal(order);
  const deliveryFee = getDeliveryFee(order.delivery);
  const totalAmount = subtotal + deliveryFee;
  const canCancel = OrderAPI.canCancelOrder(order);
  const canReview = order.status === 'completed' && !order.rated;
  const showReturnButton = order.status === 'completed' || order.status === 'cancelled';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#704F38" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Order Details</Text>
            <Text style={styles.headerSubtitle}>
              #{order._id.slice(-8)}
            </Text>
          </View>
        </View>

        {/* Status Tracker */}
        {renderStatusTracker()}

        {/* Order Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Information</Text>
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Order Date:</Text>
              <Text style={styles.infoValue}>{formatDate(order.createdAt)}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Recipient:</Text>
              <Text style={styles.infoValue}>{order.recipient}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Phone:</Text>
              <Text style={styles.infoValue}>{order.phone}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Delivery:</Text>
              <Text style={styles.infoValue}>
                {order.delivery === 'standard' ? 'Standard Delivery' : 'Express Delivery'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Address:</Text>
              <Text style={styles.infoValue}>{order.address}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Payment:</Text>
              <Text style={styles.infoValue}>{order.payment}</Text>
            </View>
            {order.note && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Note:</Text>
                <Text style={styles.infoValue}>{order.note}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Products */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Items ({order.products.length})
          </Text>
          {order.products.map((product, index) => 
            renderProductItem(product, index)
          )}
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                Subtotal ({order.products.length} items):
              </Text>
              <Text style={styles.summaryValue}>{formatPrice(subtotal)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                Delivery Fee ({order.delivery === 'standard' ? 'Standard' : 'Express'}):
              </Text>
              <Text style={styles.summaryValue}>{formatPrice(deliveryFee)}</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryTotalLabel}>Total:</Text>
              <Text style={styles.summaryTotalValue}>
                {formatPrice(totalAmount)}
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          {canCancel && (
            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton]}
              onPress={handleCancelOrder}
              disabled={cancelOrderMutation.isPending}
            >
              <Ionicons name="close-circle-outline" size={20} color="#fff" />
              <Text style={styles.cancelButtonText}>Cancel Order</Text>
            </TouchableOpacity>
          )}

          {canReview && (
            <TouchableOpacity
              style={[styles.actionButton, styles.reviewButton]}
              onPress={handleWriteReview}
            >
              <Ionicons name="star-outline" size={20} color="#fff" />
              <Text style={styles.reviewButtonText}>Write Review</Text>
            </TouchableOpacity>
          )}

          {showReturnButton && (
            <TouchableOpacity
              style={[styles.actionButton, styles.reorderButton]}
              onPress={handleReturnToShop}
            >
              <Ionicons name="home-outline" size={20} color="#fff" />
              <Text style={styles.reorderButtonText}>Return to Shop</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Cancel Confirmation Modal */}
      {renderCancelConfirmationModal()}
    </SafeAreaView>
  );
};

export default OrderDetailPage;