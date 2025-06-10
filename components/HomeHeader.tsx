import { Text, View, StyleSheet, Image } from "react-native";

import layout from "@/styles/layout";
import { useUser } from "@/hooks/useUser";
import { useAuthContext } from "@/contexts/AuthContext";

export default function HomeHeader() {
  const { userInfo } = useAuthContext();

  const { user, isLoading } = useUser(userInfo?._id);

  if (!userInfo?._id || isLoading) {
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
            onError={(e) => console.log("Image rendering error:", e.nativeEvent.error)}
          />
          <View style={styles.textContainer}>
            <Text style={styles.sub_title_text}>Welcome back,</Text>
            <Text style={styles.main_title_text}>{user.data.firstName}</Text>
          </View>
        </View>
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