import PageHeader from "@/components/PageHeader";
import { useUser } from "@/hooks/useUser";
import layout from "@/styles/layout";
import Feather from "@expo/vector-icons/Feather";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";

import {
  SafeAreaView,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
  Alert,
} from "react-native";
import { useUpdateUser } from "@/hooks/useUpdateUser";
import SectionProfile from "@/components/SectionProfile";
import LogoutSec from "@/components/LogoutSec";

export default function ProfilePage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const uploadMutation = useUpdateUser();
  const [hide, useHide] = useState(false);
  const { user, isLoading, refetch } = useUser(userId);

  useEffect(() => {
    AsyncStorage.getItem("userId")
      .then((id) => {
        console.log("User ID:", id);
        setUserId(id);
      })
      .catch((err) => console.error("AsyncStorage error:", err));
  }, []);

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
      formData.append("avatar", {
        uri: picked.uri,
        name: picked.fileName || `avatar_${Date.now()}.jpg`,
        type:
          picked.type === "image" ? "image/jpeg" : picked.type || "image/jpeg",
      } as any);

      uploadMutation.mutate(
        {
          id: userId,
          data: {}, 
          file: formData, 
        } as any,
        {
          onSuccess: async (user) => {
            await refetch();
            Alert.alert("Thành công", "Ảnh đại diện đã được cập nhật.");
          },
          onError: (error: any) => {
            Alert.alert("Lỗi cập nhật", error.message || "Có lỗi xảy ra");
          },
        }
      );
    }
  };

  if (!userId || isLoading) {
    return <Text>loading...</Text>;
  }
  return (
    <SafeAreaView style={styles.container}>
      <PageHeader content={"Profile"}></PageHeader>
      <View>
        <View style={{ position: "relative" }}>
          {user.data?.img && (
            <Image source={{ uri: user.data.img }} style={styles.img} />
          )}

          <TouchableOpacity
            onPress={pickImage}
            style={[styles.edit, layout.flex_col_center]}
          >
            <Feather name="edit-3" size={25} color={"#fff"} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ marginTop: 20 }}>
        <Text
          style={{
            textAlign: "center",
            fontSize: 20,
            fontWeight: 500,
            fontFamily: "Inter",
          }}
        >
          {user.data.lastName} {user.data.firstName}
        </Text>
      </View>
      <View style={{ height: 460 }}>
        <SectionProfile
          icon={"user-o"}
          content={"Your profile"}
          route={"/changeInfo"}
        />
        <SectionProfile icon={"list-alt"} content={"My Order"} route={""} />
        <SectionProfile
          icon={"gear"}
          content={"Settings"}
          route={"/settings"}
        />
        <SectionProfile
          icon={"exclamation"}
          content={"Help Center"}
          route={""}
        />
        <SectionProfile icon={"lock"} content={"Privacy policy"} route={""} />
        <SectionProfile
          icon={"sign-out"}
          content={"Log out"}
          route={""}
          handleHide={useHide}
          hide={hide}
        />
      </View>
      {hide && <LogoutSec handleHide={useHide} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f9f9f9",
  },
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
    right: 90,
  },
});
