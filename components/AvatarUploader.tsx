import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import layout from "@/styles/layout";
import { useUpdateUser } from "@/hooks/useUpdateUser";
import { router } from "expo-router";
import link from "@/styles/link";
import text from "@/styles/text";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AvatarUploader({
  userId,
  userAvatar,
  userData,
}: {
  userId: string;
  userAvatar: string;
  userData: any;
}) {
  const [image, setImage] = useState<string | null>(null);
  const uploadMutation = useUpdateUser();

  const goToProfile = async () => {
    await AsyncStorage.setItem("userId", userId);
    router.push("/tabs/homepage");
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permisson denied");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const picked = result.assets[0];
      setImage(picked.uri);

      // Tạo FormData
      const formData = new FormData();

      // Nếu bạn muốn cập nhật thêm các trường text, ví dụ firstName, lastName, thì append ở đây:
      // formData.append("firstName", "Nguyen");
      // formData.append("lastName", "Van A");

      // Chỉ append avatar dưới key "avatar" (phải khớp với upload.single("avatar") bên server)
      formData.append("avatar", {
        uri: picked.uri,
        name: picked.fileName || `avatar_${Date.now()}.jpg`,
        type:
          picked.type === "image" ? "image/jpeg" : picked.type || "image/jpeg",
      } as any);

      // Gọi mutation – truyền trực tiếp formData dưới dạng 'file',
      // và để data={} (hoặc chứa các field text nếu cần)
      uploadMutation.mutate(
        {
          id: userId,
          data: {}, // không đặt avatar ở đây nữa
          file: formData, // chúng ta sẽ gửi formData làm 'file'
        } as any,
        {
          onSuccess: () => {
            Alert.alert("Thành công", "Ảnh đại diện đã được cập nhật.");
          },
          onError: (error: any) => {
            Alert.alert("Lỗi cập nhật", error.message || "Có lỗi xảy ra");
          },
        }
      );
    }
  };

  return (
    <>
      <View style={{ position: "relative" }}>
        <Image
          source={
            image
              ? { uri: image }
              : userAvatar
              ? { uri: userAvatar }
              : require("@/assets/images/default-avatar.png")
          }
          style={styles.img}
        />

        <TouchableOpacity
          onPress={pickImage}
          style={[styles.edit, layout.flex_col_center]}
        >
          <Feather name="edit-3" size={25} color={"#fff"} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={[
          link.btn_link,
          link.btn_link_base,
          { marginTop: 20, marginBottom: 20 },
        ]}
        onPress={goToProfile}
      >
        <Text style={text.text_btn}>Sign In</Text>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  img: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginHorizontal: "auto",
  },
  edit: {
    width: 50,
    height: 50,
    borderWidth: 3,
    borderColor: "#fff",
    backgroundColor: "#704F38",
    borderRadius: 30,
    position: "absolute",
    bottom: 0,
    right: 70,
  },
});
