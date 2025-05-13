import { useMutation } from "@tanstack/react-query";
import { logIn, LoginData, LoginResponse } from "@/api/services/auth";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function useLogIn() {
  const router = useRouter();
  
  const mutation = useMutation({
    mutationFn: logIn,
    onSuccess: async (response: LoginResponse) => {
      // Store user data
      await AsyncStorage.multiSet([
        ["accessToken", response.access_token],
        ["refreshToken", response.refresh_token],
        ["userId", response.userInfo._id],
        ["userInfo", JSON.stringify(response.userInfo)]
      ]);

      Toast.show({
        type: "success",
        text1: "Welcome back!",
        text2: `Hi ${response.userInfo.firstName}`,
      });

      router.replace("/homepage");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Login failed";
      Toast.show({
        type: "error",
        text1: "Login Error",
        text2: message,
      });
    },
  });

  return {
    login: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error
  };
}