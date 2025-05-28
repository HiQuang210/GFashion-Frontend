import { useMutation } from "@tanstack/react-query";
import { logIn, LoginData, LoginResponse } from "@/api/services/UserService";
import { useAuth } from "./useAuth";
import { useToast } from "./useToast";
import { useRouter } from "expo-router";

export function useLogIn() {
  const router = useRouter();
  const { storeAuthData } = useAuth();
  const { showSuccessToast, showErrorToast } = useToast();
  
  const mutation = useMutation({
    mutationFn: logIn,
    onSuccess: async (response: LoginResponse) => {
      try {
        // Store authentication data
        await storeAuthData(response);

        // Show success message
        showSuccessToast(
          "Welcome back!",
          `Hi ${response.userInfo.firstName}`
        );

        // Navigate to homepage
        router.replace("/homepage");
      } catch (error) {
        console.error("Error storing auth data:", error);
        showErrorToast("Login Error", "Failed to save login data");
      }
    },
    onError: (error: any) => {
      // Handle different error formats
      let message = "Login failed";
      
      if (error?.response?.data?.message) {
        message = error.response.data.message;
      } else if (error?.message) {
        message = error.message;
      } else if (typeof error === 'string') {
        message = error;
      }
      
      showErrorToast("Login Error", message);
    },
  });

  return {
    login: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
    isError: mutation.isError,
    reset: mutation.reset
  };
}