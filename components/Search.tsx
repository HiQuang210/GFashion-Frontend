import { TextInput, View, StyleSheet } from "react-native";
import Input from "./Input";
import Octicons from "@expo/vector-icons/Octicons";
import layout from "@/styles/layout";

type InputProps = {
  width: number;
};

export default function Search({ width }: InputProps) {
  return (
    <View
      style={[
        layout.flex_row,
        layout.gap_m,
        styles.containter,
        { width: width },
      ]}
    >
      <Octicons name="search" size={24} color={"#704F38"} />
      <TextInput
        placeholder="Search"
        keyboardType="default"
        inputMode="text"
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  containter: {
    borderWidth: 0.5,
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderRadius: 30,
    borderColor: "#bcbcbc",
  },

  input: {
    fontSize: 20,
    fontFamily: "Inter",
    color: "#797979",
  },
});
