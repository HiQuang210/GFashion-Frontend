import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signUp } from "@/api/services/auth";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function useSignUp() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate: signup, isPending } = useMutation({
    mutationFn: signUp,
    onSuccess: async (user) => {
      Toast.show({
        type: "success",
        text1: "Dang ki thanh cong",
      });
      console.log("user");

      console.log(user.userInfo);
      await AsyncStorage.setItem("accessToken", user.access_token);
      await AsyncStorage.setItem("userId", user.userInfo.id);
      router.replace("/completeprofile");
    },
    onError: (error: any) => {
      Toast.show({
        type: "error",
        text1: "Dang ki that bai",
        text2: error?.response?.data?.message || error.message,
      });
    },
  });
  return { signup, isPending };
}
