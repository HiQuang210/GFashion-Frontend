import { Product } from "./product";
import { UserInfo } from "./user";

export interface ProductReviewItem {
  productId: Product;
  rating: number;
  comment?: string;
  color: string;
  size: string;
  _id: string;
}

export interface Review {
  _id: string;
  orderId: string;
  userId: UserInfo;
  overallRating: number;
  overallComment?: string;
  productReviews: ProductReviewItem[];
  deliveryRating?: number;
  serviceRating?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewItemCardProps {
  review: Review;
}

export interface RatingStarsProps {
  rating: number;
}