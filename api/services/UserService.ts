import axiosClient from "@/api/axiosClient";
import {
  SignUpData,
  LoginData,
  LoginResponse,
  SignUpResponse,
  RequestPasswordResetData,
  VerifyResetCodeData,
  ResetPasswordData,
  ApiResponse,
  UserDetailResponse,
  UpdateUserData,
  UpdateUserResponse,
  ChangePasswordData,
  ChangePasswordResponse,
  CartResponse,
} from "@/types/user";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export interface HandleFavoriteData {
  action: "add" | "remove";
  userId: string;
  productId: string;
}

export interface GetFavoriteProductsData {
  productIds: string[];
}

export interface HandleCartData {
  action: "add" | "remove" | "update";
  productId: string;
  color: string;
  size: string;
  quantity: number;
}

const buildQueryParams = (params: Record<string, any>): string => {
  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      queryParams.append(key, value.toString());
    }
  });

  return queryParams.toString();
};

const handleApiCall = async <T>(
  operation: string,
  apiCall: () => Promise<{ data: T }>
): Promise<T> => {
  try {
    const response = await apiCall();
    return response.data;
  } catch (error: any) {
    console.error(`${operation} error:`, error.response?.data || error.message);
    throw error;
  }
};

export class UserAPI {
  static async requestEmailVerification(
    formData: SignUpData
  ): Promise<ApiResponse> {
    return handleApiCall("Email verification request", () =>
      axiosClient.post("user/request-email-verification", formData)
    );
  }

  static async signUp(formData: SignUpData): Promise<SignUpResponse> {
    return handleApiCall("Sign up", () =>
      axiosClient.post("user/sign-up", formData)
    );
  }

  static async signIn(formData: LoginData): Promise<LoginResponse> {
    return handleApiCall("Login", () =>
      axiosClient.post("user/sign-in", formData)
    );
  }

  static async signOut(): Promise<ApiResponse> {
    return handleApiCall("Sign out", () => axiosClient.post("user/sign-out"));
  }

  static async getUserDetail(userId: string): Promise<UserDetailResponse> {
    return handleApiCall("Get user detail", () =>
      axiosClient.get(`user/get-detail/${userId}`)
    );
  }

  static async updateUser(
    userId: string,
    data: UpdateUserData,
    file?: any
  ): Promise<UpdateUserResponse> {
    const token = await AsyncStorage.getItem("accessToken");

    return handleApiCall("Update user", async () => {
      if (file) {
        if (!token) throw new Error("No access token found");

        return axiosClient.put(`/user/update-user/${userId}`, file, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        return axiosClient.put(`/user/update-user/${userId}`, data);
      }
    });
  }

  static async changePassword(
    userId: string,
    data: ChangePasswordData
  ): Promise<ChangePasswordResponse> {
    return handleApiCall("Change password", () =>
      axiosClient.put(`user/change-password/${userId}`, data)
    );
  }

  static async requestPasswordReset(
    data: RequestPasswordResetData
  ): Promise<ApiResponse> {
    return handleApiCall("Password reset request", () =>
      axiosClient.post("user/request-password-reset", data)
    );
  }

  static async verifyResetCode(
    data: VerifyResetCodeData
  ): Promise<ApiResponse> {
    return handleApiCall("Reset code verification", () =>
      axiosClient.post("user/verify-reset-code", data)
    );
  }

  static async resetPassword(data: ResetPasswordData): Promise<ApiResponse> {
    return handleApiCall("Password reset", () =>
      axiosClient.post("user/reset-password", data)
    );
  }

  // Favorite methods
  static async handleFavorite(data: HandleFavoriteData): Promise<ApiResponse> {
    const queryString = buildQueryParams({
      action: data.action,
      userId: data.userId,
      productId: data.productId,
    });

    return handleApiCall("Handle favorite", () =>
      axiosClient.post(`user/handle-favorite?${queryString}`)
    );
  }

  static async getUserFavoriteProducts(): Promise<ApiResponse> {
    return handleApiCall("Get user favorites", () =>
      axiosClient.get("user/get-user-favorites")
    );
  }

  static async handleCart(data: HandleCartData): Promise<CartResponse> {
    return handleApiCall("Handle cart", () =>
      axiosClient.post("user/handle-cart", data)
    );
  }

  static async getUserCart(): Promise<CartResponse> {
    return handleApiCall("Get user cart", () =>
      axiosClient.get("user/get-user-cart")
    );
  }
}

export const {
  requestEmailVerification,
  signUp,
  signIn: logIn,
  signOut,
  getUserDetail,
  updateUser,
  changePassword,
  requestPasswordReset,
  verifyResetCode,
  resetPassword,
  handleFavorite,
  getUserFavoriteProducts,
} = UserAPI;

export { LoginData, LoginResponse };