import { useMutation } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { changePass } from "@/api/services/auth";

export function useChangePassword() {
  const { mutate: changePw, isPending } = useMutation({
    mutationFn: changePass,
    onSuccess: async (data) => {
      Toast.show({
        type: "success",
        text1: "Đổi mật khẩu thành công",
      });
      console.log(data);

      // Optional: Xóa token nếu bạn muốn buộc người dùng đăng nhập lại
      // await AsyncStorage.removeItem("accessToken");
      // await AsyncStorage.removeItem("userId");

      // Chuyển hướng nếu cần
      // router.replace("/login");
    },
    onError: (error: any) => {
      Toast.show({
        type: "error",
        text1: "Đổi mật khẩu thất bại",
        text2: error?.response?.data?.message || error.message,
      });
    },
  });

  return { changePw, isPending };
}
