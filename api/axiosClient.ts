import axios, { AxiosInstance, AxiosResponse } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const axiosClient: AxiosInstance = axios.create({
  baseURL: "http://192.168.1.4:5000/api",
  timeout: 20000, 
  headers: { 
    "Content-Type": "application/json" 
  },
});

import type { InternalAxiosRequestConfig } from "axios";
import { router } from "expo-router";

axiosClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await AsyncStorage.getItem("accessToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`📥 ${response.status} ${response.config.url}`);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    console.error(`❌ ${error.response?.status || 'Network Error'} ${originalRequest?.url}`);

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = await AsyncStorage.getItem("refreshToken");
        
        if (refreshToken) {
          const response = await axiosClient.post(
            "/user/refresh-token",
            { refreshToken }
          );

          const newAccessToken = response.data.access_token;
          await AsyncStorage.setItem("accessToken", newAccessToken);

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosClient(originalRequest);
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        
        await AsyncStorage.multiRemove([
          "accessToken", 
          "refreshToken", 
          "userId", 
          "userInfo"
        ]);
        router.replace("/login");
      }
    }
    
    // Handle network errors
    if (!error.response) {
      error.message = "Network error. Please check your connection.";
    }
    
    return Promise.reject(error);
  }
);

export default axiosClient;