// Product variant types
export interface ProductSize {
  size: string;
  stock: number;
}

export interface ProductVariant {
  color: string;
  sizes: ProductSize[];
}

// Main product interface
export interface Product {
  _id: string;
  name: string;
  images: string[];
  type: string;
  price: number;
  producer: string;
  variants: ProductVariant[];
  rating: number;
  description: string;
  material: string;
  sold: number;
  createdAt: string;
  updatedAt: string;
  firstImage?: string; // Virtual field from backend
}

// API Request/Response types
export interface GetProductsQuery {
  limitItem?: number;
  page?: number;
  sort?: string;
  filter?: string;
  searchQuery?: string;
}

export interface GetProductsResponse extends ApiResponse {
  data: Product[];
  total: number;
  totalPage: number;
  currentPage: number;
  limitItem: number;
}

export interface GetProductDetailResponse extends ApiResponse {
  data: Product;
}

export interface GetTotalPagesQuery {
  limitItem?: number;
  filter?: string;
}

export interface GetTotalPagesResponse extends ApiResponse {
  totalPage: number;
  total: number;
}

// Product filtering and sorting types
export interface ProductFilters {
  type?: string;
  producer?: string;
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  inStock?: boolean;
}

export interface ProductSortOptions {
  field: 'name' | 'price' | 'rating' | 'sold' | 'createdAt';
  order: 'asc' | 'desc';
}

// Cart and wishlist related types
export interface ProductCartItem {
  productId: string;
  product: Product;
  quantity: number;
  selectedColor: string;
  selectedSize: string;
  price: number;
}

export interface ProductWishlistItem {
  productId: string;
  product: Product;
  addedAt: string;
}

// Product search and pagination
export interface ProductSearchParams {
  query?: string;
  type?: string;
  producer?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface ProductPaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// Product availability check
export interface ProductAvailability {
  productId: string;
  color: string;
  size: string;
  available: boolean;
  stock: number;
}

// Product review types (for future use)
export interface ProductReview {
  _id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductReviewSummary {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

// Error types
export interface ProductError {
  field?: string;
  message: string;
  code?: string;
}

// Import ApiResponse from user types
export interface ApiResponse<T = any> {
  status: string;
  message: string;
  data?: T;
}