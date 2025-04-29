import { Text, TouchableOpacity, View, StyleSheet } from "react-native";

import layout from "@/styles/layout";
import SectionHeader from "./SectionHeader";
import CategoryItem from "./CategoryItem";

export default function Category() {
  return (
    <View style={{ marginBottom: 30 }}>
      <SectionHeader content="Category" route="" />
      <View style={[layout.flex_row, layout.gap_m]}>
        <CategoryItem content="tshirt" />
        <CategoryItem content="pant" />
        <CategoryItem content="jacket" />
        <CategoryItem content="dress" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  filter: {
    backgroundColor: "#704F38",
    width: 50,
    height: 50,
    borderRadius: 60,
  },
});
