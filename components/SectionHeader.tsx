import layout from "@/styles/layout";
import link from "@/styles/link";
import { Link } from "expo-router";
import { Text, View, StyleSheet } from "react-native";

type InputProps = {
  content: string;
  route: string;
};

export default function SectionHeader({ content }: InputProps) {
  return (
    <View
      style={[
        layout.flex_row,
        { justifyContent: "space-between", marginBottom: 15 },
      ]}
    >
      <Text style={styles.section_label}>{content}</Text>
      <Link href={{ pathname: `/tabs/searchpage` }} style={link.sub_link}>
        See All
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  section_label: {
    color: "#1F2029",
    fontSize: 20,
    fontFamily: "Inter",
    fontWeight: "bold",
  },
  link_text: {
    color: "#704F38",
    width: 50,
    height: 50,
    borderRadius: 60,
  },
});
