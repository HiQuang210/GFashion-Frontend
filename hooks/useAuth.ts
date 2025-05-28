import AsyncStorage from "@react-native-async-storage/async-storage";
import { LoginResponse } from "@/api/services/UserService";

export function useAuth() {
  const storeAuthData = async (response: LoginResponse) => {
    try {
      await AsyncStorage.multiSet([
        ["accessToken", response.access_token],
        ["refreshToken", response.refresh_token],
        ["userId", response.userInfo._id],
        ["userInfo", JSON.stringify(response.userInfo)]
      ]);
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
        "userInfo"
      ]);
      
      return {
        accessToken: authData[0][1],
        refreshToken: authData[1][1],
        userId: authData[2][1],
        userInfo: authData[3][1] ? JSON.parse(authData[3][1]) : null
      };
    } catch (error) {
      console.error("Failed to get auth data:", error);
      return null;
    }
  };

  const clearAuthData = async () => {
    try {
      await AsyncStorage.multiRemove([
        "accessToken",
        "refreshToken",
        "userId", 
        "userInfo"
      ]);
    } catch (error) {
      console.error("Failed to clear auth data:", error);
      throw new Error("Failed to clear authentication data");
    }
  };

  const isAuthenticated = async () => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      return !!accessToken;
    } catch (error) {
      console.error("Failed to check authentication:", error);
      return false;
    }
  };

  return {
    storeAuthData,
    getAuthData,
    clearAuthData,
    isAuthenticated
  };
}