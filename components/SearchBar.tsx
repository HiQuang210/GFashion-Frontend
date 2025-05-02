import { Link, useRouter } from "expo-router";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import Octicons from "@expo/vector-icons/Octicons";

import layout from "@/styles/layout";
import Input from "./Input";
import Search from "./Search";

export default function SearchBar() {
  return (
    <View style={[layout.flex_row, layout.gap_m, { marginBottom: 20 }]}>
      <Search width={280} />
      <Link href="/" style={[styles.filter, { paddingTop: 12 }]}>
        <Octicons
          name="filter"
          size={24}
          color={"#fff"}
          style={{ textAlign: "center" }}
        />
      </Link>
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
