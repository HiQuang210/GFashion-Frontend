import { useMutation } from "@tanstack/react-query";
import { signOut } from "@/api/services/UserService";
import { useAuth } from "./useAuth";
import { useToast } from "./useToast";
import { useRouter } from "expo-router";

export function useLogout() {
  const router = useRouter();
  const { clearAuthData } = useAuth();
  const { showSuccessToast } = useToast();
  
  const mutation = useMutation({
    mutationFn: signOut,
    onSuccess: async () => {
      try {
        await clearAuthData();
        showSuccessToast("Logout", "Successfully logged out");
        router.replace("/login");
      } catch (error) {
        console.error("Error clearing auth data:", error);
        router.replace("/login");
      }
    },
    onError: async (error: any) => {
      try {
        await clearAuthData();
        showSuccessToast("Logout", "Successfully logged out");
        router.replace("/login");
      } catch (clearError) {
        console.error("Error clearing auth data after API failure:", clearError);
        router.replace("/login");
      }
    },
  });

  const logout = () => {
    mutation.mutate();
  };

  return logout;
}