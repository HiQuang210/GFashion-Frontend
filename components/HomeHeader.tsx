import { Link, useRouter } from "expo-router";
import { Text, TouchableOpacity, View, StyleSheet, Image } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import layout from "@/styles/layout";
import { useUser } from "@/hooks/useUser";
import { useEffect, useState } from "react";

export default function HomeHeader() {
  const [userId, setUserId] = useState<string | undefined>(undefined);

  useEffect(() => {
    AsyncStorage.getItem("userId")
      .then((id) => {
        console.log("User ID:", id);
        setUserId(id || undefined);
      })
      .catch((err) => console.error("AsyncStorage error:", err));
  }, []);

  const { user, isLoading } = useUser(userId);

  if (!userId || isLoading) {
    return <Text>loading...</Text>;
  }

  if (!user || !user.data) {
    return <Text>User data not available</Text>;
  }

  return (
    <View style={{ marginBottom: 15 }}>
      <View style={[layout.flex_row, { justifyContent: "space-between" }]}>
        <View style={[layout.flex_row, { alignItems: "center" }]}>
          <Image
            source={
              user.data?.img 
                ? { uri: user.data.img }
                : require("@/assets/images/default-avatar.png")
            }
            style={styles.avatar}
            onError={(e) => console.log("Lỗi load ảnh:", e.nativeEvent.error)}
          />
          <View style={styles.textContainer}>
            <Text style={styles.sub_title_text}>Welcome back,</Text>
            <Text style={styles.main_title_text}>{user.data.firstName}</Text>
          </View>
        </View>
        <Link href="/" style={[styles.notify_btn, { paddingTop: 2 }]}>
          <Ionicons
            name="notifications"
            size={25}
            style={{ textAlign: "center" }}
          />
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sub_title_text: {
    color: "#797979",
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Inter",
  },
  main_title_text: {
    color: "#704F38",
    fontSize: 30,
    fontWeight: "bold",
    fontFamily: "Inter",
  },
  notify_btn: {
    width: 35,
    height: 35,
    backgroundColor: "#ededed",
    borderRadius: 60,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#f0f0f0",
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
    paddingLeft: 5,
  },
});