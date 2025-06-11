import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ReviewAPI } from '@/api/services/ReviewService';
import { OrderAPI } from '@/api/services/OrderService';
import { Review } from '@/types/review';
import { OrderProduct } from '@/types/order';
import { useToast } from '@/hooks/useToast';
import { useAuth } from '@/hooks/useAuth';
import { styles } from '@/styles/reviews';
import BackButton from '@/components/BackButton';

type IoniconsName = 
  | 'arrow-back'
  | 'star'
  | 'star-outline'
  | 'chevron-down'
  | 'chevron-up'
  | 'create-outline'
  | 'trash-outline'
  | 'calendar-outline'
  | 'cube-outline'
  | 'car-outline'
  | 'people-outline'
  | 'chatbubble-outline'
  | 'alert-circle-outline'
  | 'refresh-outline';

interface ExpandedReview {
  [key: string]: boolean;
}

const UserReviewsPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showSuccessToast, showErrorToast } = useToast();
  const { userInfo } = useAuth();
  
  const [expandedReviews, setExpandedReviews] = useState<ExpandedReview>({});
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch user reviews
  const {
    data: reviewsResponse,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['user-reviews', page],
    queryFn: () => ReviewAPI.getUserReviews(page, 10),
    enabled: !!userInfo,
  });

  const reviews = reviewsResponse?.data || [];

  // Fetch user reviews count
  const { data: reviewsCountResponse } = useQuery({
    queryKey: ['user-reviews-count'],
    queryFn: () => ReviewAPI.getUserReviewsCount(),
    enabled: !!userInfo,
  });

  const totalReviews = reviewsCountResponse?.data?.count || 0;

  // Delete review mutation
  const deleteReviewMutation = useMutation({
    mutationFn: (reviewId: string) => ReviewAPI.deleteReview(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['user-reviews-count'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      showSuccessToast('Success', 'Review deleted successfully!');
    },
    onError: (error: any) => {
      showErrorToast(
        'Error',
        error.response?.data?.message || error.message || 'Failed to delete review'
      );
    },
  });

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const toggleReviewExpanded = (reviewId: string) => {
    setExpandedReviews(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  const handleEditReview = (review: Review) => {
    router.push(`/order/review?orderId=${review.orderId}`);
  };

  const handleDeleteReview = (reviewId: string) => {
    Alert.alert(
      'Delete Review',
      'Are you sure you want to delete this review? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteReviewMutation.mutate(reviewId),
        },
      ]
    );
  };

  const renderStarRating = (rating: number, size: number = 16) => {
    return (
      <View style={styles.starContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name={star <= rating ? 'star' : 'star-outline'}
            size={size}
            color={star <= rating ? '#FFD700' : '#DDD'}
          />
        ))}
      </View>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderReviewItem = (review: Review) => {
    const isExpanded = expandedReviews[review._id];
    
    return (
      <View key={review._id} style={styles.reviewCard}>
        {/* Review Header */}
        <TouchableOpacity
          style={styles.reviewHeader}
          onPress={() => toggleReviewExpanded(review._id)}
        >
          <View style={styles.reviewHeaderLeft}>
            <View style={styles.reviewTitleContainer}>
              <View style={styles.reviewRatingContainer}>
                {renderStarRating(review.overallRating, 18)}
                <Text style={styles.reviewRatingText}>
                  {review.overallRating.toFixed(1)}
                </Text>
              </View>
            </View>
            <View style={styles.reviewDateContainer}>
              <Ionicons name="calendar-outline" size={14} color="#666" />
              <Text style={styles.reviewDate}>
                {formatDate(review.createdAt)}
              </Text>
            </View>
          </View>
          
          <View style={styles.reviewHeaderRight}>
            <Text style={styles.productCount}>
              {review.productReviews.length} product{review.productReviews.length > 1 ? 's' : ''}
            </Text>
            <Ionicons
              name={isExpanded ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#704F38"
            />
          </View>
        </TouchableOpacity>

        {/* Expanded Content */}
        {isExpanded && (
          <View style={styles.reviewContent}>
            {/* Overall Comment */}
            {review.overallComment && (
              <View style={styles.overallCommentSection}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="chatbubble-outline" size={16} color="#704F38" />
                  <Text style={styles.sectionTitle}>Overall Comment</Text>
                </View>
                <Text style={styles.commentText}>{review.overallComment}</Text>
              </View>
            )}

            {/* Product Reviews */}
            <View style={styles.productReviewsSection}>
              <View style={styles.sectionHeader}>
                <Ionicons name="cube-outline" size={16} color="#704F38" />
                <Text style={styles.sectionTitle}>Product Reviews</Text>
              </View>
              
              {review.productReviews.map((productReview, index) => (
                <View key={`${productReview.productId}-${index}`} style={styles.productReviewItem}>
                  <View style={styles.productReviewHeader}>
                    <Text style={styles.productReviewTitle}>
                      Product {index + 1}
                    </Text>
                    <Text style={styles.productVariant}>
                      {productReview.color} • {productReview.size}
                    </Text>
                  </View>
                  <View style={styles.productReviewRating}>
                    {renderStarRating(productReview.rating, 16)}
                    <Text style={styles.productRatingText}>
                      {productReview.rating.toFixed(1)}
                    </Text>
                  </View>
                  {productReview.comment && (
                    <Text style={styles.productCommentText}>
                      "{productReview.comment}"
                    </Text>
                  )}
                </View>
              ))}
            </View>

            {/* Additional Ratings */}
            {(review.deliveryRating || review.serviceRating) && (
              <View style={styles.additionalRatingsSection}>
                <Text style={styles.sectionTitle}>Additional Ratings</Text>
                
                {review.deliveryRating && (
                  <View style={styles.additionalRatingItem}>
                    <View style={styles.additionalRatingHeader}>
                      <Ionicons name="car-outline" size={16} color="#704F38" />
                      <Text style={styles.additionalRatingLabel}>Delivery</Text>
                    </View>
                    <View style={styles.additionalRatingValue}>
                      {renderStarRating(review.deliveryRating, 14)}
                      <Text style={styles.additionalRatingText}>
                        {review.deliveryRating.toFixed(1)}
                      </Text>
                    </View>
                  </View>
                )}

                {review.serviceRating && (
                  <View style={styles.additionalRatingItem}>
                    <View style={styles.additionalRatingHeader}>
                      <Ionicons name="people-outline" size={16} color="#704F38" />
                      <Text style={styles.additionalRatingLabel}>Service</Text>
                    </View>
                    <View style={styles.additionalRatingValue}>
                      {renderStarRating(review.serviceRating, 14)}
                      <Text style={styles.additionalRatingText}>
                        {review.serviceRating.toFixed(1)}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            )}

            {/* Action Buttons */}
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleEditReview(review)}
              >
                <Ionicons name="create-outline" size={18} color="#704F38" />
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteReview(review._id)}
                disabled={deleteReviewMutation.isPending}
              >
                {deleteReviewMutation.isPending ? (
                  <ActivityIndicator size="small" color="#DC3545" />
                ) : (
                  <>
                    <Ionicons name="trash-outline" size={18} color="#DC3545" />
                    <Text style={styles.deleteButtonText}>Delete</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer} edges={['top']}>
        <ActivityIndicator size="large" color="#704F38" />
        <Text style={styles.loadingText}>Loading your reviews...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer} edges={['top']}>
        <Ionicons name="alert-circle-outline" size={48} color="#DC3545" />
        <Text style={styles.errorTitle}>Failed to Load Reviews</Text>
        <Text style={styles.errorSubtitle}>
          Please check your connection and try again
        </Text>
        <TouchableOpacity 
          style={styles.retryButton} 
          onPress={() => refetch()}
        >
          <Ionicons name="refresh-outline" size={20} color="#704F38" />
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton/>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>My Reviews</Text>
        </View>
      </View>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="star-outline" size={64} color="#DDD" />
          <Text style={styles.emptyTitle}>No Reviews Yet</Text>
          <Text style={styles.emptySubtitle}>
            Your reviews will appear here after you submit them
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#704F38']}
              tintColor="#704F38"
            />
          }
        >
          <View style={styles.reviewsList}>
            {reviews.map(renderReviewItem)}
          </View>
          
          <View style={styles.bottomSpacing} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default UserReviewsPage;