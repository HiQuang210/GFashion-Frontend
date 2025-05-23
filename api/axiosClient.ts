import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const axiosClient: AxiosInstance = axios.create({
  baseURL: "https://29f2xn0p-5000.asse.devtunnels.ms/api",
  timeout: 10000, // 10 second timeout
  headers: { 
    "Content-Type": "application/json" 
  },
});

// Request interceptor to add auth token
import type { InternalAxiosRequestConfig } from "axios";

axiosClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Add auth token to requests if available
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

// Response interceptor for handling common errors
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`📥 ${response.status} ${response.config.url}`);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    console.error(`❌ ${error.response?.status || 'Network Error'} ${originalRequest?.url}`);
    
    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh token
        const refreshToken = await AsyncStorage.getItem("refreshToken");
        
        if (refreshToken) {
          const response = await axios.post(
            "http://localhost:5000/api/user/refresh-token",
            { refreshToken }
          );
          
          const newAccessToken = response.data.access_token;
          await AsyncStorage.setItem("accessToken", newAccessToken);
          
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosClient(originalRequest);
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        
        // Clear stored tokens and redirect to login
        await AsyncStorage.multiRemove([
          "accessToken", 
          "refreshToken", 
          "userId", 
          "userInfo"
        ]);
        
        // You might want to redirect to login page here
        // router.replace("/login");
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