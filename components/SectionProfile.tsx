import layout from "@/styles/layout";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, router } from "expo-router";
import { Dispatch, SetStateAction, useState } from "react";
import { TouchableOpacity, View, Text } from "react-native";

interface props {
  icon: string;
  content: string;
  route: string;
  handlePress?: () => void;
}

export default function SectionProfile({
  icon,
  content,
  route,
  handlePress,
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
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomColor: "#ededed",
        borderBottomWidth: 1,
      }}
      onPress={hanldeButton}
    >
      <View style={[layout.flex_row, { gap: 10 }]}>
        <FontAwesome name={icon as any} size={22} color={"#704F38"} />
        <Text style={{ fontSize: 18, color: "#704F38" }}>{content}</Text>
      </View>

      <FontAwesome name="chevron-right" size={22} color={"#704F38"} />
    </TouchableOpacity>
  );
}