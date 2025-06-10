import { useAuthContext } from "@/contexts/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQueryClient } from "@tanstack/react-query";
import { router, useRouter } from "expo-router";

export const useLogout = () => {
  const router = useRouter();
  const { clearAuthData } = useAuthContext();

  const logout = async () => {
    try {
      await clearAuthData();
      router.replace("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return logout;
};