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
} from "@/types/user";

export interface HandleFavoriteData {
  action: "add" | "remove";
  userId: string;
  productId: string;
}

export interface GetFavoriteProductsData {
  productIds: string[];
}

export class UserAPI {
  static async requestEmailVerification(formData: SignUpData): Promise<ApiResponse> {
    try {
      const response = await axiosClient.post("user/request-email-verification", formData);
      console.log("Email verification request successful:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Email verification request error:", error.response?.data || error.message);
      throw error;
    }
  }

  static async signUp(formData: SignUpData): Promise<SignUpResponse> {
    try {
      const response = await axiosClient.post("user/sign-up", formData);
      console.log("Sign up successful:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Sign up error:", error.response?.data || error.message);
      throw error;
    }
  }

  static async signIn(formData: LoginData): Promise<LoginResponse> {
    try {
      const response = await axiosClient.post("user/sign-in", formData);
      console.log("Login successful:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Login error:", error.response?.data || error.message);
      throw error;
    }
  }

  static async getUserDetail(userId: string): Promise<UserDetailResponse> {
    try {
      const response = await axiosClient.get(`user/get-detail/${userId}`);
      console.log("Get user detail successful:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Get user detail error:", error.response?.data || error.message);
      throw error;
    }
  }

  static async updateUser(userId: string, data: UpdateUserData): Promise<UpdateUserResponse> {
    try {
      const response = await axiosClient.put(`user/${userId}`, data);
      console.log("Update user successful:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Update user error:", error.response?.data || error.message);
      throw error;
    }
  }

  static async changePassword(userId: string, data: ChangePasswordData): Promise<ChangePasswordResponse> {
    try {
      const response = await axiosClient.put(`user/${userId}/change-password`, data);
      console.log("Change password successful:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Change password error:", error.response?.data || error.message);
      throw error;
    }
  }

  static async requestPasswordReset(
    data: RequestPasswordResetData
  ): Promise<ApiResponse> {
    try {
      const response = await axiosClient.post("user/request-password-reset", data);
      console.log("Password reset request successful:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Password reset request error:", error.response?.data || error.message);
      throw error;
    }
  }

  static async verifyResetCode(
    data: VerifyResetCodeData
  ): Promise<ApiResponse> {
    try {
      const response = await axiosClient.post("user/verify-reset-code", data);
      console.log("Reset code verification successful:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Reset code verification error:", error.response?.data || error.message);
      throw error;
    }
  }

  static async resetPassword(data: ResetPasswordData): Promise<ApiResponse> {
    try {
      const response = await axiosClient.post("user/reset-password", data);
      console.log("Password reset successful:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Password reset error:", error.response?.data || error.message);
      throw error;
    }
  }

  static async signOut(): Promise<ApiResponse> {
    try {
      const response = await axiosClient.post("user/sign-out");
      console.log("Sign out successful:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Sign out error:", error.response?.data || error.message);
      throw error;
    }
  }

  static async handleFavorite(data: HandleFavoriteData): Promise<ApiResponse> {
    try {
      const queryParams = new URLSearchParams({
        action: data.action,
        userId: data.userId,
        productId: data.productId
      });

      const response = await axiosClient.post(`user/handle-favorite?${queryParams.toString()}`);
      console.log("Handle favorite successful:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Handle favorite error:", error.response?.data || error.message);
      throw error;
    }
  }

  static async getUserFavoriteProducts(): Promise<ApiResponse> {
    try {
      const response = await axiosClient.get("user/get-user-favorites");
      console.log("Get user favorites successful:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Get user favorites error:", error.response?.data || error.message);
      throw error;
    }
  }
}

export const requestEmailVerification = UserAPI.requestEmailVerification;
export const signUp = UserAPI.signUp;
export const logIn = UserAPI.signIn;
export const getUserDetail = UserAPI.getUserDetail;
export const updateUser = UserAPI.updateUser;
export const changePassword = UserAPI.changePassword;
export const requestPasswordReset = UserAPI.requestPasswordReset;
export const verifyResetCode = UserAPI.verifyResetCode;
export const resetPassword = UserAPI.resetPassword;
export const signOut = UserAPI.signOut;
export const handleFavorite = UserAPI.handleFavorite;
export const getUserFavoriteProducts = UserAPI.getUserFavoriteProducts;
export { LoginData, LoginResponse };