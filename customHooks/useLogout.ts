import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";

export const useLogout = () => {
  const queryClient = useQueryClient();

  const logout = async () => {
    try {
      // Xoá token
      await AsyncStorage.removeItem("accessToken");

      // Xoá toàn bộ cache react-query
      queryClient.clear();

      // Chuyển hướng đến màn đăng nhập
      router.replace("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return logout;
};
