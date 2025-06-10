import layout from "@/styles/layout";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { Dispatch, SetStateAction, useState } from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";

interface props {
  icon: React.ComponentProps<typeof Feather>["name"];
  content: string;
  route: string;
  handlePress?: () => void;
  color?: string;
}

export default function SectionProfile({
  icon,
  content,
  route,
  handlePress,
  color = "#333",
}: props) {
  function hanldeButton() {
    if (handlePress) {
      handlePress();
    } else {
      router.push(`${route}` as any);
    }
  }

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={hanldeButton}
      activeOpacity={0.6}
    >
      <View style={styles.left}>
        <Feather name={icon} size={22} color={"#704F38"} />
        <Text style={[styles.content, { color: color }]}>{content}</Text>
      </View>

      <Feather name="chevron-right" size={22} color={"#704F38"} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: "#fff",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  content: {
    fontSize: 16,
  },
});