import AsyncStorage from "@react-native-async-storage/async-storage";
import { LoginResponse } from "@/api/services/UserService";
import { UserInfo } from "@/types/user";
import { useState, useEffect, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";

export function useAuth() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setIsLoading(true);
      const authData = await getAuthData();
      if (authData?.userInfo) {
        setUserInfo(authData.userInfo);
      }
    } catch (error) {
      console.error("Failed to load user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const storeAuthData = async (response: LoginResponse) => {
    try {
      await AsyncStorage.multiSet([
        ["accessToken", response.access_token],
        ["refreshToken", response.refresh_token],
        ["userId", response.userInfo._id],
        ["userInfo", JSON.stringify(response.userInfo)],
      ]);

      setUserInfo(response.userInfo);
    } catch (error) {
      console.error("Failed to store auth data:", error);
      throw new Error("Failed to save authentication data");
    }
  };

  const getAuthData = async () => {
    try {
      const authData = await AsyncStorage.multiGet([
        "accessToken",
        "refreshToken",
        "userId",
        "userInfo",
      ]);

      return {
        accessToken: authData[0][1],
        refreshToken: authData[1][1],
        userId: authData[2][1],
        userInfo: authData[3][1] ? JSON.parse(authData[3][1]) : null,
      };
    } catch (error) {
      console.error("Failed to get auth data:", error);
      return null;
    }
  };

  const updateUserInfo = async (updatedUser: UserInfo) => {
    try {
      await AsyncStorage.setItem("userInfo", JSON.stringify(updatedUser));
      setUserInfo(updatedUser);
    } catch (error) {
      console.error("Failed to update user info:", error);
      throw new Error("Failed to update user information");
    }
  };

  const clearAuthData = useCallback(async () => {
    try {
      await AsyncStorage.multiRemove([
        "accessToken",
        "refreshToken",
        "userId",
        "userInfo",
      ]);

      setUserInfo(null);

      queryClient.clear();
    } catch (error) {
      console.error("Failed to clear auth data:", error);
      throw new Error("Failed to clear authentication data");
    }
  }, [queryClient]);

  const isAuthenticated = async () => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      return !!accessToken;
    } catch (error) {
      console.error("Failed to check authentication:", error);
      return false;
    }
  };

  const isUserAuthenticated = !!userInfo;

  return {
    // Data
    userInfo,
    isLoading,
    isUserAuthenticated,

    // Methods
    storeAuthData,
    getAuthData,
    updateUserInfo,
    clearAuthData,
    isAuthenticated,
    refreshUserData: loadUserData,
  };
}