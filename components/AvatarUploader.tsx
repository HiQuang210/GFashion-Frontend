import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import layout from "@/styles/layout";
import { useUpdateUser } from "@/hooks/useUpdateUser";
import { router } from "expo-router";
import link from "@/styles/link";
import text from "@/styles/text";
import { useToast } from "@/hooks/useToast";

interface AvatarUploaderProps {
  userId: string;
  userAvatar?: string | null;
  userData: any;
  onAvatarUpdate?: () => void; 
  showSignInButton?: boolean; 
}

export default function AvatarUploader({
  userId,
  userAvatar,
  userData,
  onAvatarUpdate,
  showSignInButton = false,
}: AvatarUploaderProps) {
  const [image, setImage] = useState<string | null>(null);
  const uploadMutation = useUpdateUser();
  const { showSuccessToast, showErrorToast } = useToast();

  const goToProfile = () => {
    router.push("/tabs/homepage");
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        showErrorToast("Permission Required", "Sorry, we need camera roll permissions to make this work!");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const picked = result.assets[0];
        setImage(picked.uri);

        const formData = new FormData();

        if (Platform.OS === 'web') {
          try {
            const response = await fetch(picked.uri);
            const blob = await response.blob();
            
            formData.append("avatar", blob, picked.fileName || `avatar_${Date.now()}.jpg`);
          } catch (error) {
            console.error("Error processing image for web:", error);
            showErrorToast("Error", "Failed to process image. Please try again.");
            return;
          }
        } else {
          const fileObject = {
            uri: picked.uri,
            name: picked.fileName || `avatar_${Date.now()}.jpg`,
            type: picked.mimeType || "image/jpeg",
          };
          
          formData.append("avatar", fileObject as any);
        }

        uploadMutation.mutate(
          {
            id: userId,
            data: {},
            file: formData,
          },
          {
            onSuccess: (response) => {
              console.log("Avatar upload success:", response);
              showSuccessToast("Success", "Avatar has been updated successfully!");
              if (onAvatarUpdate) {
                onAvatarUpdate();
              }
            },
            onError: (error: any) => {
              console.error("Avatar upload error:", error);
              const errorMessage = error?.response?.data?.message || 
                                 error?.message || 
                                 "An error occurred while updating your avatar. Please try again.";
              showErrorToast("Upload Error", errorMessage);
              setImage(null);
            },
          }
        );
      }
    } catch (error) {
      console.error("Image picker error:", error);
      showErrorToast("Error", "Failed to open image picker. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
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
          disabled={uploadMutation.isPending}
        >
          <Feather 
            name="edit-3" 
            size={25} 
            color={uploadMutation.isPending ? "#ccc" : "#fff"} 
          />
        </TouchableOpacity>
      </View>

      {showSignInButton && (
        <TouchableOpacity
          style={[
            link.btn_link,
            link.btn_link_base,
            { marginTop: 20, marginBottom: 20 },
          ]}
          onPress={goToProfile}
        >
          <Text style={text.text_btn}>Continue</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 10,
  },
  img: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#f0f0f0',
  },
  edit: {
    width: 40,
    height: 40,
    borderWidth: 3,
    borderColor: "#fff",
    backgroundColor: "#704F38",
    borderRadius: 20,
    position: "absolute",
    bottom: 0,
    right: 0,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});