import { TextInput, View, StyleSheet, DimensionValue } from "react-native";
import Octicons from "@expo/vector-icons/Octicons";
import layout from "@/styles/layout";

type InputProps = {
  width?: DimensionValue;
};

export default function Search({ width = "100%" }: InputProps) {
  return (
    <View
      style={[
        layout.flex_row,
        layout.gap_m,
        styles.container,
        { width },
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
  container: {
    borderWidth: 0.5,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 30,
    borderColor: "#bcbcbc",
    alignItems: "center",
  },

  input: {
    fontSize: 20,
    fontFamily: "Inter",
    color: "#797979",
    flex: 1,
  },
});