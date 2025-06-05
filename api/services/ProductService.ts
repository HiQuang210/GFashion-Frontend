import axiosClient from "@/api/axiosClient";
import {
  GetProductsQuery,
  GetProductsResponse,
  GetProductDetailResponse,
  GetTotalPagesQuery,
  GetTotalPagesResponse,
  ProductSearchParams,
} from "@/types/product";

export class ProductAPI {
  /**
   * Get all products with pagination, filtering, and sorting
   */
  static async getAllProducts(params: GetProductsQuery = {}): Promise<GetProductsResponse> {
    try {
      const {
        limitItem = 8,
        page = 0,
        sort,
        filter,
        searchQuery,
      } = params;

      const queryParams = new URLSearchParams();
      
      if (limitItem) queryParams.append('limitItem', limitItem.toString());
      if (page) queryParams.append('page', page.toString());
      if (sort) queryParams.append('sort', sort);
      if (filter) queryParams.append('filter', filter);
      if (searchQuery) queryParams.append('searchQuery', searchQuery);

      const response = await axiosClient.get(`product/get-all?${queryParams.toString()}`);
      console.log("Get all products successful:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Get all products error:", error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get product by ID
   */
  static async getProductDetail(productId: string): Promise<GetProductDetailResponse> {
    try {
      if (!productId) {
        throw new Error("Product ID is required");
      }

      const response = await axiosClient.get(`product/get-detail/${productId}`);
      console.log("Get product detail successful:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Get product detail error:", error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get total pages for pagination
   */
  static async getTotalPages(params: GetTotalPagesQuery = {}): Promise<GetTotalPagesResponse> {
    try {
      const { limitItem = 8, filter } = params;

      const queryParams = new URLSearchParams();
      if (limitItem) queryParams.append('limitItem', limitItem.toString());
      if (filter) queryParams.append('filter', filter);

      const response = await axiosClient.get(`product/get-total-pages?${queryParams.toString()}`);
      console.log("Get total pages successful:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Get total pages error:", error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Search products with advanced filters
   */
  static async searchProducts(searchParams: ProductSearchParams): Promise<GetProductsResponse> {
    try {
      const {
        query,
        type,
        producer,
        minPrice,
        maxPrice,
        rating,
        sortBy,
        sortOrder = 'asc',
        page = 0,
        limit = 8,
      } = searchParams;

      const queryParams = new URLSearchParams();
      
      if (query) queryParams.append('searchQuery', query);
      if (type) queryParams.append('filter', `type,${type}`);
      if (producer) queryParams.append('filter', `producer,${producer}`);
      if (sortBy) queryParams.append('sort', `${sortBy},${sortOrder}`);
      if (page) queryParams.append('page', page.toString());
      if (limit) queryParams.append('limitItem', limit.toString());

      // Handle price range filter
      if (minPrice !== undefined || maxPrice !== undefined) {
        let priceFilter = 'price';
        if (minPrice !== undefined) priceFilter += `,gte,${minPrice}`;
        if (maxPrice !== undefined) priceFilter += `,lte,${maxPrice}`;
        queryParams.append('filter', priceFilter);
      }

      // Handle rating filter
      if (rating !== undefined) {
        queryParams.append('filter', `rating,gte,${rating}`);
      }

      const response = await axiosClient.get(`product/get-all?${queryParams.toString()}`);
      console.log("Search products successful:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Search products error:", error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get products by type/category
   */
  static async getProductsByType(
    type: string,
    page: number = 0,
    limit: number = 8
  ): Promise<GetProductsResponse> {
    try {
      return await ProductAPI.getAllProducts({
        filter: `type,${type}`,
        page,
        limitItem: limit,
      });
    } catch (error: any) {
      console.error("Get products by type error:", error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get products by producer/brand
   */
  static async getProductsByProducer(
    producer: string,
    page: number = 0,
    limit: number = 8
  ): Promise<GetProductsResponse> {
    try {
      return await ProductAPI.getAllProducts({
        filter: `producer,${producer}`,
        page,
        limitItem: limit,
      });
    } catch (error: any) {
      console.error("Get products by producer error:", error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get featured/best selling products
   */
  static async getFeaturedProducts(limit: number = 8): Promise<GetProductsResponse> {
    try {
      return await ProductAPI.getAllProducts({
        sort: 'best-seller',
        limitItem: limit,
        page: 0,
      });
    } catch (error: any) {
      console.error("Get featured products error:", error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get newest products
   */
  static async getNewestProducts(limit: number = 8): Promise<GetProductsResponse> {
    try {
      return await ProductAPI.getAllProducts({
        sort: 'newest',
        limitItem: limit,
        page: 0,
      });
    } catch (error: any) {
      console.error("Get newest products error:", error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get products with highest rating
   */
  static async getTopRatedProducts(limit: number = 8): Promise<GetProductsResponse> {
    try {
      return await ProductAPI.getAllProducts({
        sort: 'highest-rating',
        limitItem: limit,
        page: 0,
      });
    } catch (error: any) {
      console.error("Get top rated products error:", error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Check product availability for specific color and size
   */
  static async checkProductAvailability(
    productId: string,
    color: string,
    size: string
  ): Promise<{ available: boolean; stock: number }> {
    try {
      const product = await ProductAPI.getProductDetail(productId);
      
      const variant = product.data.variants.find(v => v.color === color);
      if (!variant) {
        return { available: false, stock: 0 };
      }

      const sizeOption = variant.sizes.find(s => s.size === size);
      if (!sizeOption) {
        return { available: false, stock: 0 };
      }

      return {
        available: sizeOption.stock > 0,
        stock: sizeOption.stock,
      };
    } catch (error: any) {
      console.error("Check product availability error:", error.response?.data || error.message);
      return { available: false, stock: 0 };
    }
  }

  /**
   * Get all available colors for a product
   */
  static async getProductColors(productId: string): Promise<string[]> {
    try {
      const product = await ProductAPI.getProductDetail(productId);
      return product.data.variants.map(variant => variant.color);
    } catch (error: any) {
      console.error("Get product colors error:", error.response?.data || error.message);
      return [];
    }
  }

  /**
   * Get all available sizes for a product and color
   */
  static async getProductSizes(productId: string, color: string): Promise<string[]> {
    try {
      const product = await ProductAPI.getProductDetail(productId);
      const variant = product.data.variants.find(v => v.color === color);
      
      if (!variant) {
        return [];
      }

      return variant.sizes
        .filter(sizeOption => sizeOption.stock > 0)
        .map(sizeOption => sizeOption.size);
    } catch (error: any) {
      console.error("Get product sizes error:", error.response?.data || error.message);
      return [];
    }
  }
}

export const getAllProducts = ProductAPI.getAllProducts;
export const getProductDetail = ProductAPI.getProductDetail;
export const getTotalPages = ProductAPI.getTotalPages;
export const searchProducts = ProductAPI.searchProducts;
export const getProductsByType = ProductAPI.getProductsByType;
export const getProductsByProducer = ProductAPI.getProductsByProducer;
export const getFeaturedProducts = ProductAPI.getFeaturedProducts;
export const getNewestProducts = ProductAPI.getNewestProducts;
export const getTopRatedProducts = ProductAPI.getTopRatedProducts;
export const checkProductAvailability = ProductAPI.checkProductAvailability;
export const getProductColors = ProductAPI.getProductColors;
export const getProductSizes = ProductAPI.getProductSizes;