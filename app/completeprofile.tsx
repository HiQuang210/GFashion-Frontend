import { View, StyleSheet, SafeAreaView } from "react-native";
import Title from "@/components/Title";
import AccessButton from "@/components/AccessButton";
import BackButton from "@/components/BackButton";
import AvatarUploader from "@/components/AvatarUploader";
import { launchImageLibrary } from "react-native-image-picker";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CompleteProfile() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem("userId")
      .then((id) => {
        console.log("User ID:", id);
        setUserId(id);
      })
      .catch((err) => console.error("AsyncStorage error:", err));
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ marginTop: 10, marginHorizontal: 25 }}>
        <BackButton />
        <Title
          mainTitle="Upload Your Avatar"
          subTitle="Strike a pose—or not. Only you’ll see it!"
          margin_bot={30}
        />

        {userId && (
          <AvatarUploader userId={userId} userAvatar={""} userData={{}} />
        )}

        {/* <AccessButton route="location" content="Complete Profile" /> */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
});
