import { useQuery } from "@tanstack/react-query";
import { getDetailProduct } from "../../services/product";

export const useProductDetail = (id) => {
  return useQuery({
    queryKey: ["product-detail", id],
    queryFn: () => getDetailProduct(id),
    enabled: !!id, // chỉ gọi khi có id
  });
};
