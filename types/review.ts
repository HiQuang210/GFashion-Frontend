import { ApiResponse } from "./user";

export interface ProductReview {
  productId: string;
  rating: number;
  comment?: string;
  color: string;
  size: string;
}

export interface Review {
  _id: string;
  orderId: string;
  userId: string;
  overallRating: number;
  overallComment?: string;
  productReviews: ProductReview[];
  deliveryRating?: number;
  serviceRating?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewData {
  orderId: string;
  overallRating: number;
  overallComment?: string;
  productReviews: ProductReview[];
  deliveryRating?: number;
  serviceRating?: number;
}

export interface UpdateReviewData {
  overallRating?: number;
  overallComment?: string;
  productReviews?: ProductReview[];
  deliveryRating?: number;
  serviceRating?: number;
}

export interface ReviewResponse extends ApiResponse {
  data: Review;
}

export interface ReviewsResponse extends ApiResponse {
  data: Review[];
}

export interface ProductReviewsResponse extends ApiResponse {
  data: {
    reviews: Review[];
    totalReviews: number;
    averageRating: number;
    ratingDistribution: {
      1: number;
      2: number;
      3: number;
      4: number;
      5: number;
    };
  };
}

export interface ReviewFormData {
  overallRating: number;
  overallComment: string;
  productReviews: {
    productId: string;
    rating: number;
    comment: string;
    color: string;
    size: string;
  }[];
  deliveryRating?: number;
  serviceRating?: number;
}

export interface ReviewFormErrors {
  overallRating?: string;
  overallComment?: string;
  productReviews?: {
    [key: string]: {
      rating?: string;
      comment?: string;
    };
  };
  deliveryRating?: string;
  serviceRating?: string;
}

export interface ReviewValidationResult {
  isValid: boolean;
  errors: ReviewFormErrors;
}