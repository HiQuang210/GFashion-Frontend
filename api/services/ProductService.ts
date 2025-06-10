import axiosClient from "@/api/axiosClient";
import {
  GetProductsQuery,
  GetProductsResponse,
  GetProductDetailResponse,
  GetTotalPagesQuery,
  GetTotalPagesResponse,
  ProductSearchParams,
} from "@/types/product";

interface ExtendedGetProductsQuery extends GetProductsQuery {
  producer?: string;
  minPrice?: string | number;
  maxPrice?: string | number;
}

const buildQueryParams = (params: Record<string, any>): string => {
  return new URLSearchParams(
    Object.entries(params).filter(([_, value]) => 
      value !== undefined && value !== null && value !== ''
    ).map(([key, value]) => [key, value.toString()])
  ).toString();
};

const handleError = (error: any, operation: string) => {
  console.error(`${operation} error:`, error.response?.data || error.message);
  throw error;
};

const SORT_MAPPING = {
  'price-low': 'price-asc',
  'price-high': 'price-desc',
} as const;

const safeNumberConversion = (value: string | number | undefined): number | undefined => {
  if (value === undefined || value === null || value === '') return undefined;
  
  const num = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : Number(value);
  return !isNaN(num) && num >= 0 ? num : undefined;
};

export class ProductAPI {
  static async getAllProducts(params: ExtendedGetProductsQuery = {}): Promise<GetProductsResponse> {
    try {
      const queryParams: Record<string, any> = {
        limitItem: params.limitItem || 8,
        page: params.page || 1,
        sort: params.sort,
        filter: params.filter,
        producer: params.producer,
        searchQuery: params.searchQuery,
      };

      const minPrice = safeNumberConversion(params.minPrice);
      const maxPrice = safeNumberConversion(params.maxPrice);
      
      if (minPrice !== undefined) {
        queryParams.minPrice = minPrice;
      }
      if (maxPrice !== undefined) {
        queryParams.maxPrice = maxPrice;
      }

      const queryString = buildQueryParams(queryParams);
      const response = await axiosClient.get(`product/get-all?${queryString}`);
      return response.data;
    } catch (error: any) {
      return handleError(error, "Get all products");
    }
  }

  static async searchProducts(searchParams: ProductSearchParams): Promise<GetProductsResponse> {
    try {
      const {
        query, type, producer, sortBy, page = 0, limit = 8, minPrice, maxPrice
      } = searchParams;

      const params: ExtendedGetProductsQuery = {
        page: page + 1,
        limitItem: limit,
        sort: SORT_MAPPING[sortBy as keyof typeof SORT_MAPPING] || sortBy,
        searchQuery: query || undefined,
        filter: type && type !== 'all' ? type : undefined,
        producer: producer && producer !== 'all' ? producer : undefined,
      };

      const convertedMinPrice = safeNumberConversion(minPrice);
      const convertedMaxPrice = safeNumberConversion(maxPrice);
      
      if (convertedMinPrice !== undefined) {
        params.minPrice = convertedMinPrice;
      }
      if (convertedMaxPrice !== undefined) {
        params.maxPrice = convertedMaxPrice;
      }

      return await ProductAPI.getAllProducts(params);
    } catch (error: any) {
      return handleError(error, "Search products");
    }
  }

  static async getProductDetail(productId: string): Promise<GetProductDetailResponse> {
    try {
      if (!productId) throw new Error("Product ID is required");

      const response = await axiosClient.get(`product/get-detail/${productId}`);
      return response.data;
    } catch (error: any) {
      return handleError(error, "Get product detail");
    }
  }

  static async getTotalPages(params: GetTotalPagesQuery & { 
    producer?: string;
    minPrice?: string | number;
    maxPrice?: string | number;
  } = {}): Promise<GetTotalPagesResponse> {
    try {
      const queryParams: Record<string, any> = {
        limitItem: params.limitItem || 8,
        filter: params.filter,
        producer: params.producer,
      };

      const minPrice = safeNumberConversion(params.minPrice);
      const maxPrice = safeNumberConversion(params.maxPrice);
      
      if (minPrice !== undefined) {
        queryParams.minPrice = minPrice;
      }
      if (maxPrice !== undefined) {
        queryParams.maxPrice = maxPrice;
      }

      const queryString = buildQueryParams(queryParams);
      const response = await axiosClient.get(`product/get-total-pages?${queryString}`);
      return response.data;
    } catch (error: any) {
      return handleError(error, "Get total pages");
    }
  }

  private static async getProductsByCriteria(
    criteria: Partial<ExtendedGetProductsQuery>,
    page: number = 0,
    limit: number = 8
  ): Promise<GetProductsResponse> {
    return this.getAllProducts({
      ...criteria,
      page: page + 1,
      limitItem: limit,
    });
  }

  static async getProductsByType(type: string, page?: number, limit?: number): Promise<GetProductsResponse> {
    try {
      return await ProductAPI.getProductsByCriteria({ filter: type }, page, limit);
    } catch (error: any) {
      return handleError(error, "Get products by type");
    }
  }

  static async getProductsByProducer(producer: string, page?: number, limit?: number): Promise<GetProductsResponse> {
    try {
      return await ProductAPI.getProductsByCriteria({ producer }, page, limit);
    } catch (error: any) {
      return handleError(error, "Get products by producer");
    }
  }

  static async getFeaturedProducts(limit: number = 8): Promise<GetProductsResponse> {
    try {
      return await ProductAPI.getProductsByCriteria({ sort: 'best-seller', limitItem: limit, page: 1 });
    } catch (error: any) {
      return handleError(error, "Get featured products");
    }
  }

  static async getNewestProducts(limit: number = 8): Promise<GetProductsResponse> {
    try {
      return await ProductAPI.getProductsByCriteria({ sort: 'newest', limitItem: limit, page: 1 });
    } catch (error: any) {
      return handleError(error, "Get newest products");
    }
  }

  static async getTopRatedProducts(limit: number = 8): Promise<GetProductsResponse> {
    try {
      return await ProductAPI.getProductsByCriteria({ sort: 'highest-rating', limitItem: limit, page: 1 });
    } catch (error: any) {
      return handleError(error, "Get top rated products");
    }
  }

  static async checkProductAvailability(
    productId: string,
    color: string,
    size: string
  ): Promise<{ available: boolean; stock: number }> {
    try {
      const product = await this.getProductDetail(productId);
      
      const variant = product.data.variants.find(v => v.color === color);
      const sizeOption = variant?.sizes.find(s => s.size === size);
      
      return {
        available: (sizeOption?.stock ?? 0) > 0,
        stock: sizeOption?.stock ?? 0,
      };
    } catch (error: any) {
      console.error("Check product availability error:", error.response?.data || error.message);
      return { available: false, stock: 0 };
    }
  }

  static async getProductColors(productId: string): Promise<string[]> {
    try {
      const product = await this.getProductDetail(productId);
      return product.data.variants.map(variant => variant.color);
    } catch (error: any) {
      console.error("Get product colors error:", error.response?.data || error.message);
      return [];
    }
  }

  static async getProductSizes(productId: string, color: string): Promise<string[]> {
    try {
      const product = await this.getProductDetail(productId);
      const variant = product.data.variants.find(v => v.color === color);
      
      return variant?.sizes
        .filter(sizeOption => sizeOption.stock > 0)
        .map(sizeOption => sizeOption.size) ?? [];
    } catch (error: any) {
      console.error("Get product sizes error:", error.response?.data || error.message);
      return [];
    }
  }
}

export const {
  getAllProducts,
  getProductDetail,
  getTotalPages,
  searchProducts,
  getProductsByType,
  getProductsByProducer,
  getFeaturedProducts,
  getNewestProducts,
  getTopRatedProducts,
  checkProductAvailability,
  getProductColors,
  getProductSizes,
} = ProductAPI;