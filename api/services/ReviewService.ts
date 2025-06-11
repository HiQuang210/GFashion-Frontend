import axiosClient from "@/api/axiosClient";
import { ApiResponse } from "@/types/user";
import {
  CreateReviewData,
  UpdateReviewData,
  ReviewResponse,
  ReviewsResponse,
  ProductReviewsResponse,
} from "@/types/review";

const handleApiCall = async <T>(
  operation: string,
  apiCall: () => Promise<{ data: T }>
): Promise<T> => {
  try {
    const response = await apiCall();
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export class ReviewAPI {
  // Create a new review
  static async createReview(reviewData: CreateReviewData): Promise<ReviewResponse> {
    return handleApiCall("Create review", () =>
      axiosClient.post("review/create", reviewData)
    );
  }

  // Get review by order ID
  static async getReviewByOrderId(orderId: string): Promise<ReviewResponse> {
    return handleApiCall("Get review by order", () =>
      axiosClient.get(`review/order/${orderId}`)
    );
  }

  // Get all reviews for a specific product
  static async getProductReviews(
    productId: string,
    page: number = 1,
    limit: number = 10,
    sortBy: string = "createdAt",
    sortOrder: "asc" | "desc" = "desc"
  ): Promise<ProductReviewsResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortBy,
      sortOrder,
    });

    return handleApiCall("Get product reviews", () =>
      axiosClient.get(`review/product/${productId}?${params}`)
    );
  }

  // Get all reviews by current user
  static async getUserReviews(
    page: number = 1,
    limit: number = 10
  ): Promise<ReviewsResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    return handleApiCall("Get user reviews", () =>
      axiosClient.get(`review/user?${params}`)
    );
  }

  // Get user reviews count
  static async getUserReviewsCount(): Promise<{ data: { count: number } }> {
    return handleApiCall("Get user reviews count", () =>
      axiosClient.get("review/user/count")
    );
  }

  // Update an existing review
  static async updateReview(
    reviewId: string,
    updateData: UpdateReviewData
  ): Promise<ReviewResponse> {
    return handleApiCall("Update review", () =>
      axiosClient.put(`review/update/${reviewId}`, updateData)
    );
  }

  // Delete a review
  static async deleteReview(reviewId: string): Promise<ApiResponse> {
    return handleApiCall("Delete review", () =>
      axiosClient.delete(`review/delete/${reviewId}`)
    );
  }

  // Admin: Get all reviews with pagination and filters
  static async getAllReviews(
    page: number = 1,
    limit: number = 10,
    sortBy: string = "createdAt",
    sortOrder: "asc" | "desc" = "desc",
    userId?: string,
    productId?: string,
    minRating?: number,
    maxRating?: number
  ): Promise<ReviewsResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortBy,
      sortOrder,
    });

    if (userId) params.append("userId", userId);
    if (productId) params.append("productId", productId);
    if (minRating) params.append("minRating", minRating.toString());
    if (maxRating) params.append("maxRating", maxRating.toString());

    return handleApiCall("Get all reviews (admin)", () =>
      axiosClient.get(`review/admin/all?${params}`)
    );
  }

  // Helper method to validate review data before submission
  static validateReviewData(reviewData: CreateReviewData): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // Validate overall rating
    if (!reviewData.overallRating || reviewData.overallRating < 1 || reviewData.overallRating > 5) {
      errors.push("Overall rating must be between 1 and 5");
    }

    // Validate product reviews
    if (!reviewData.productReviews || reviewData.productReviews.length === 0) {
      errors.push("At least one product review is required");
    } else {
      reviewData.productReviews.forEach((productReview, index) => {
        if (!productReview.productId) {
          errors.push(`Product ID is required for product review ${index + 1}`);
        }
        if (!productReview.rating || productReview.rating < 1 || productReview.rating > 5) {
          errors.push(`Rating must be between 1 and 5 for product review ${index + 1}`);
        }
        if (!productReview.color) {
          errors.push(`Color is required for product review ${index + 1}`);
        }
        if (!productReview.size) {
          errors.push(`Size is required for product review ${index + 1}`);
        }
        if (productReview.comment && productReview.comment.length > 1000) {
          errors.push(`Comment must be less than 1000 characters for product review ${index + 1}`);
        }
      });
    }

    // Validate optional ratings
    if (reviewData.deliveryRating && (reviewData.deliveryRating < 1 || reviewData.deliveryRating > 5)) {
      errors.push("Delivery rating must be between 1 and 5");
    }

    if (reviewData.serviceRating && (reviewData.serviceRating < 1 || reviewData.serviceRating > 5)) {
      errors.push("Service rating must be between 1 and 5");
    }

    // Validate comment length
    if (reviewData.overallComment && reviewData.overallComment.length > 1000) {
      errors.push("Overall comment must be less than 1000 characters");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

export const {
  createReview,
  getReviewByOrderId,
  getProductReviews,
  getUserReviews,
  getUserReviewsCount,
  updateReview,
  deleteReview,
  getAllReviews,
} = ReviewAPI;