import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

const STORAGE_KEYS = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
  USER_ID: "userId",
  USER_INFO: "userInfo"
} as const;

const axiosClient: AxiosInstance = axios.create({
  // baseURL: "http://192.168.1.4:5000/api",
  baseURL: "https://29f2xn0p-5000.asse.devtunnels.ms/api",
  timeout: 20000,
  headers: { "Content-Type": "application/json" }
});

axiosClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // console.log(`${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    const { config: originalRequest, response } = error;
    
    // console.error(`❌ ${response?.status || 'Network Error'} ${originalRequest?.url}`);

    if (response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
        
        if (refreshToken) {
          const { data } = await axiosClient.post("/user/refresh-token", { refreshToken });
          
          await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.access_token);
          originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
          
          return axiosClient(originalRequest);
        }
      } catch (refreshError) {
        //console.error("Token refresh failed:", refreshError);
        await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
        router.replace("/login");
      }
    }
    
    if (!error.response) {
      error.message = "Network error. Please check your connection.";
    }
    
    return Promise.reject(error);
  }
);

export default axiosClient;