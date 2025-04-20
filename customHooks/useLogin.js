import { useQueryClient, useMutation } from "@tanstack/react-query";
import { logIn } from "../services/auth";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function useLogIn() {
  const router = useRouter();
  const { mutate: login, isPending } = useMutation({
    mutationFn: logIn,
    onSuccess: async (user) => {
      Toast.show({
        type: "success",
        text1: "Dang nhap thanh cong",
      });
      console.log("user");

      console.log(user);
      await AsyncStorage.setItem("accessToken", user.access_token);
      await AsyncStorage.setItem("userId", user.userInfo._id);
      router.replace("/homepage");
    },
    onError: (error) => {
      Toast.show({
        type: "error",
        text1: "Dang nhap that bai",
        text2: error.respone?.data?.message || error.message,
      });
    },
  });
  return { login, isPending };
}
