import { useQuery } from "@tanstack/react-query";
import {
  getTop4LatestProducts,
  getTop4BestSellingProducts,
} from "../../services/product";

export const useTop4LatestProducts = () => {
  return useQuery({
    queryKey: ["top4latestProducts"],
    queryFn: getTop4LatestProducts,
    retry: 1, // số lần retry nếu lỗi
    staleTime: 1000 * 60, // dữ liệu sẽ được cache trong 1 phút
  });
};

export const useTop4BestSellingProducts = () => {
  return useQuery({
    queryKey: ["top4BestSellingProducts"],
    queryFn: getTop4BestSellingProducts,
    retry: 1,
    staleTime: 1000 * 60,
  });
};
