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
} from "@/types/user";

export class AuthAPI {
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
}

export const requestEmailVerification = AuthAPI.requestEmailVerification;
export const signUp = AuthAPI.signUp;
export const logIn = AuthAPI.signIn;
export const requestPasswordReset = AuthAPI.requestPasswordReset;
export const verifyResetCode = AuthAPI.verifyResetCode;
export const resetPassword = AuthAPI.resetPassword;
export const signOut = AuthAPI.signOut;

export { LoginData, LoginResponse };