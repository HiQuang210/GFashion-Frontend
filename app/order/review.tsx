import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { OrderAPI } from '@/api/services/OrderService';
import { ReviewAPI } from '@/api/services/ReviewService';
import { CreateReviewData, ProductReview } from '@/types/review';
import { OrderProduct } from '@/types/order';
import { styles } from '@/styles/writereview';
import { useToast } from '@/hooks/useToast';

type IoniconsName = 
  | 'arrow-back'
  | 'star'
  | 'star-outline'
  | 'checkmark-circle'
  | 'alert-circle-outline'
  | 'send'
  | 'car-outline'
  | 'people-outline';

interface ProductReviewForm extends ProductReview {
  expanded: boolean;
}

const CreateReviewPage = () => {
  const router = useRouter();
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const queryClient = useQueryClient();
  const { showSuccessToast, showErrorToast } = useToast();

  // Form state
  const [overallRating, setOverallRating] = useState(0);
  const [overallComment, setOverallComment] = useState('');
  const [deliveryRating, setDeliveryRating] = useState(0);
  const [serviceRating, setServiceRating] = useState(0);
  const [productReviews, setProductReviews] = useState<ProductReviewForm[]>([]);
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);

  // Fetch order details
  const {
    data: orderResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => OrderAPI.getOrderDetail(orderId!),
    enabled: !!orderId,
  });

  const order = orderResponse?.data;

  // Check if review already exists
  const { data: existingReviewResponse } = useQuery({
    queryKey: ['review', 'order', orderId],
    queryFn: () => ReviewAPI.getReviewByOrderId(orderId!),
    enabled: !!orderId,
  });

  const existingReview = existingReviewResponse?.data;

  // Initialize product reviews when order is loaded
  useEffect(() => {
    if (order && !existingReview) {
      const initialProductReviews: ProductReviewForm[] = order.products.map((product: OrderProduct) => ({
        productId: product.productId,
        rating: 0,
        comment: '',
        color: product.color,
        size: product.size,
        expanded: false,
      }));
      setProductReviews(initialProductReviews);
    } else if (existingReview) {
      // Pre-fill form with existing review data
      setOverallRating(existingReview.overallRating);
      setOverallComment(existingReview.overallComment || '');
      setDeliveryRating(existingReview.deliveryRating || 0);
      setServiceRating(existingReview.serviceRating || 0);
      
      // Set product reviews based on existing review and order products
      const existingProductReviews: ProductReviewForm[] = order?.products.map((product: OrderProduct) => {
        const existingProductReview = existingReview.productReviews.find(
          pr => pr.productId === product.productId && pr.color === product.color && pr.size === product.size
        );
        
        return {
          productId: product.productId,
          rating: existingProductReview?.rating || 0,
          comment: existingProductReview?.comment || '',
          color: product.color,
          size: product.size,
          expanded: false,
        };
      }) || [];
      
      setProductReviews(existingProductReviews);
    }
  }, [order, existingReview]);

  // Submit review mutation
  const submitReviewMutation = useMutation({
    mutationFn: (reviewData: CreateReviewData) => 
      existingReview 
        ? ReviewAPI.updateReview(existingReview._id, reviewData)
        : ReviewAPI.createReview(reviewData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', orderId] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['review', 'order', orderId] });
      showSuccessToast(
        'Success', 
        existingReview ? 'Review updated successfully!' : 'Review submitted successfully!'
      );
      router.back();
    },
    onError: (error: any) => {
      showErrorToast(
        'Error', 
        error.response?.data?.message || error.message || 'Failed to submit review'
      );
    },
  });

  const handleSubmitReview = () => {
    // Validation
    if (overallRating === 0) {
      Alert.alert('Error', 'Please provide an overall rating');
      return;
    }

    const unratedProducts = productReviews.filter(pr => pr.rating === 0);
    if (unratedProducts.length > 0) {
      Alert.alert('Error', 'Please rate all products');
      return;
    }

    const reviewData: CreateReviewData = {
      orderId: orderId!,
      overallRating,
      overallComment: overallComment.trim() || undefined,
      productReviews: productReviews.map(pr => ({
        productId: pr.productId,
        rating: pr.rating,
        comment: (pr.comment ?? '').trim() || undefined,
        color: pr.color,
        size: pr.size,
      })),
      deliveryRating: deliveryRating || undefined,
      serviceRating: serviceRating || undefined,
    };

    const validation = ReviewAPI.validateReviewData(reviewData);
    if (!validation.isValid) {
      Alert.alert('Validation Error', validation.errors.join('\n'));
      return;
    }

    submitReviewMutation.mutate(reviewData);
  };

  const renderStarRating = (
    rating: number,
    onRatingChange: (rating: number) => void,
    size: number = 24
  ) => {
    return (
      <View style={styles.starContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => onRatingChange(star)}
            style={styles.starButton}
          >
            <Ionicons
              name={star <= rating ? 'star' : 'star-outline'}
              size={size}
              color={star <= rating ? '#FFD700' : '#DDD'}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const updateProductReview = (index: number, field: keyof ProductReview, value: any) => {
    setProductReviews(prev => prev.map((review, i) => 
      i === index ? { ...review, [field]: value } : review
    ));
  };

  const toggleProductExpanded = (productId: string) => {
    setExpandedProduct(expandedProduct === productId ? null : productId);
  };

  const getProductFromOrder = (productId: string, color: string, size: string) => {
    return order?.products.find(
      (p: OrderProduct) => p.productId === productId && p.color === color && p.size === size
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

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
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerBackButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#704F38" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>
              {existingReview ? 'Update Review' : 'Write Review'}
            </Text>
            <Text style={styles.headerSubtitle}>
              Order #{order._id.slice(-8)}
            </Text>
          </View>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Overall Rating */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Overall Rating *</Text>
            <Text style={styles.sectionSubtitle}>
              How would you rate your overall experience?
            </Text>
            {renderStarRating(overallRating, setOverallRating, 32)}
            
            <TextInput
              style={styles.commentInput}
              placeholder="Share your overall experience (optional)"
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              value={overallComment}
              onChangeText={setOverallComment}
              maxLength={1000}
            />
            <Text style={styles.characterCount}>
              {overallComment.length}/1000
            </Text>
          </View>

          {/* Product Reviews */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Product Reviews *</Text>
            <Text style={styles.sectionSubtitle}>
              Rate each product in your order
            </Text>
            
            {productReviews.map((productReview, index) => {
              const product = getProductFromOrder(
                productReview.productId, 
                productReview.color, 
                productReview.size
              );
              const isExpanded = expandedProduct === `${productReview.productId}-${productReview.color}-${productReview.size}`;
              
              return (
                <View key={`${productReview.productId}-${index}`} style={styles.productReviewCard}>
                  <TouchableOpacity
                    style={styles.productHeader}
                    onPress={() => toggleProductExpanded(`${productReview.productId}-${productReview.color}-${productReview.size}`)}
                  >
                    <Image
                      source={{ uri: product?.image }}
                      style={styles.productImage}
                      defaultSource={{ uri: '@/assets/images/corrugated-box.jpg' }}
                    />
                    <View style={styles.productInfo}>
                      <Text style={styles.productName} numberOfLines={2}>
                        {product?.name}
                      </Text>
                      <Text style={styles.productDetails}>
                        {productReview.color} • {productReview.size}
                      </Text>
                      <Text style={styles.productPrice}>
                        {formatPrice(product?.price || 0)}
                      </Text>
                    </View>
                    <View style={styles.productRatingPreview}>
                      {renderStarRating(
                        productReview.rating,
                        (rating) => updateProductReview(index, 'rating', rating),
                        20
                      )}
                    </View>
                  </TouchableOpacity>
                  
                  {isExpanded && (
                    <View style={styles.productReviewExpanded}>
                      <Text style={styles.ratingLabel}>Your Rating *</Text>
                      {renderStarRating(
                        productReview.rating,
                        (rating) => updateProductReview(index, 'rating', rating),
                        28
                      )}
                      
                      <TextInput
                        style={styles.productCommentInput}
                        placeholder="Tell us about this product (optional)"
                        placeholderTextColor="#999"
                        multiline
                        numberOfLines={3}
                        value={productReview.comment}
                        onChangeText={(text) => updateProductReview(index, 'comment', text)}
                        maxLength={1000}
                      />
                      <Text style={styles.characterCount}>
                        {(productReview.comment ?? '').length}/1000
                      </Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>

          {/* Service Ratings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Ratings</Text>
            
            {/* Delivery Rating */}
            <View style={styles.additionalRatingContainer}>
              <View style={styles.additionalRatingHeader}>
                <Ionicons name="car-outline" size={20} color="#704F38" />
                <Text style={styles.additionalRatingTitle}>Delivery Service</Text>
              </View>
              <Text style={styles.additionalRatingSubtitle}>
                How was the delivery experience?
              </Text>
              {renderStarRating(deliveryRating, setDeliveryRating, 24)}
            </View>

            {/* Service Rating */}
            <View style={styles.additionalRatingContainer}>
              <View style={styles.additionalRatingHeader}>
                <Ionicons name="people-outline" size={20} color="#704F38" />
                <Text style={styles.additionalRatingTitle}>Customer Service</Text>
              </View>
              <Text style={styles.additionalRatingSubtitle}>
                How was our customer service?
              </Text>
              {renderStarRating(serviceRating, setServiceRating, 24)}
            </View>
          </View>

          <View style={styles.bottomSpacing} />
        </ScrollView>

        {/* Submit Button */}
        <View style={styles.submitContainer}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              submitReviewMutation.isPending && styles.submitButtonDisabled
            ]}
            onPress={handleSubmitReview}
            disabled={submitReviewMutation.isPending}
          >
            {submitReviewMutation.isPending ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Ionicons name="send" size={20} color="#fff" />
                <Text style={styles.submitButtonText}>
                  {existingReview ? 'Update Review' : 'Submit Review'}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CreateReviewPage;