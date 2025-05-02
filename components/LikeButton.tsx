import { View, StyleSheet, TouchableOpacity } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import layout from "@/styles/layout";
import { useState } from "react";
import Toast from "react-native-toast-message";

export default function LikeButton() {
  const [touch, setTouch] = useState(false);

  function handleTouch() {
    setTouch(!touch);
    Toast.show({
      type: "info",
      text1: !touch ? "Add to Wishlist success" : "Remove to Wishlist success",
      position: "bottom",
    });
  }

  return (
    <TouchableOpacity
      style={[styles.container, layout.flex_col_center]}
      onPress={handleTouch}
    >
      <AntDesign
        name={touch ? "heart" : "hearto"}
        color={"#704F38"}
        size={20}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    backgroundColor: "#ededed",
    borderRadius: 50,
    position: "absolute",
    top: 5,
    right: 5,
    zIndex: 2,
  },
});
