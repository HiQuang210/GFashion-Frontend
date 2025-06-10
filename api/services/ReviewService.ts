import axiosClient from "@/api/axiosClient";
import { ApiResponse } from "@/types/user";
import { Review } from "@/types/review";

interface GetReviewsResponse extends ApiResponse {
  data: Review[];
  totalPage: number;
  currentPage: number;
  totalReviews: number;
}

class ReviewAPI {
  static async getUserReviews(
    page = 1,
    limit = 10
  ): Promise<GetReviewsResponse> {
    try {
      const response = await axiosClient.get(
        `/review/user?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error: any) {
      console.error(
        "Get user reviews error:",
        error.response?.data || error.message
      );
      throw error;
    }
  }
}

export { ReviewAPI };