// hooks/useRegister.ts
import { useMutation } from "@tanstack/react-query";
import { AuthAPI } from "@/api/services/UserService";
import { SignUpData } from "@/types/user";
import { useToast } from "./useToast";
import { useRouter } from "expo-router";

export function useRegister() {
  const router = useRouter();
  const { showSuccessToast, showErrorToast } = useToast();
  
  const mutation = useMutation({
    mutationFn: (signupData: SignUpData) => AuthAPI.requestEmailVerification(signupData),
    onSuccess: () => {
      showSuccessToast(
        "Registration Initiated",
        "Please check your email for verification"
      );
      
      router.push("/emailverify");
    },
    onError: (error: any) => {
      console.error("Registration error:", error);
      
      // Handle different error formats
      let message = "Something went wrong";
      
      if (error?.response?.data?.message) {
        message = error.response.data.message;
      } else if (error?.message) {
        message = error.message;
      } else if (typeof error === 'string') {
        message = error;
      }
      
      showErrorToast("Registration Failed", message);
    },
  });

  const register = async (data: SignUpData) => {
    return mutation.mutateAsync(data);
  };

  return {
    register,
    isPending: mutation.isPending,
    error: mutation.error,
    isError: mutation.isError,
    reset: mutation.reset
  };
}