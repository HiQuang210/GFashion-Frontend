import axiosClient from "@/api/axiosClient";

export const getTop4LatestProducts = async () => {
  const res = await axiosClient.get(
    "product/get-all?limitItem=4&page=0&sort=createdAt_desc"
  );
  return res.data;
};

export const getTop4BestSellingProducts = async () => {
  const res = await axiosClient.get(
    "product/get-all?limitItem=4&page=0&sort=sold_desc"
  );
  return res.data;
};

export const getDetailProduct = async (id) => {
  const res = await axiosClient.get(`product/get-detail/${id}`);
  return res.data;
};
