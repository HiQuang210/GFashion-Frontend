import { useQuery } from "@tanstack/react-query";
import { getFeaturedProducts, getNewestProducts, getAllProducts, getProductDetail } from "@/api/services/ProductService";
import { GetProductsResponse, GetProductDetailResponse } from "@/types/product";

export const useTop4LatestProducts = () => {
  return useQuery<GetProductsResponse, Error>({
    queryKey: ["top4latestProducts"],
    queryFn: () => getNewestProducts(4),
    retry: 1,
    staleTime: 1000 * 60 * 5, 
    refetchOnWindowFocus: false,
  });
};

export const useTop3BestSellingProducts = () => {
  return useQuery<GetProductsResponse, Error>({
    queryKey: ["top3BestSellingProducts"],
    queryFn: () => getFeaturedProducts(3),
    retry: 1,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    select: (data) => ({
      ...data,
      data: data.data
        .sort((a, b) => (b.sold || 0) - (a.sold || 0))
        .slice(0, 3) 
    }),
  });
};

export const useBestSellingProducts = (limit: number = 8) => {
  return useQuery<GetProductsResponse, Error>({
    queryKey: ["bestSellingProducts", limit],
    queryFn: () => getFeaturedProducts(limit),
    retry: 1,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    select: (data) => ({
      ...data,
      data: data.data.sort((a, b) => (b.sold || 0) - (a.sold || 0))
    }),
  });
};

export const useLatestProducts = (limit: number = 8) => {
  return useQuery<GetProductsResponse, Error>({
    queryKey: ["latestProducts", limit],
    queryFn: () => getNewestProducts(limit),
    retry: 1,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

export const useProducts = (
  page: number = 0,
  limit: number = 8,
  sortBy?: string,
  filter?: string,
  searchQuery?: string
) => {
  return useQuery<GetProductsResponse, Error>({
    queryKey: ["products", page, limit, sortBy, filter, searchQuery],
    queryFn: () => getAllProducts({
      page,
      limitItem: limit,  
      sort: sortBy,
      filter,
      searchQuery,
    }),
    retry: 1,
    staleTime: 1000 * 60 * 2, 
    refetchOnWindowFocus: false,
  });
};

export const useProductDetail = (id: string | number) => {
  return useQuery<GetProductDetailResponse, Error>({
    queryKey: ["product-detail", id],
    queryFn: () => getProductDetail(String(id)),
    enabled: !!id, 
    retry: 1,
    staleTime: 1000 * 60 * 5, 
    refetchOnWindowFocus: false,
  });
};