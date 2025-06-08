import { useTabNavigation } from "@/contexts/TabNavigation";
import layout from "@/styles/layout";
import link from "@/styles/link";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";

type InputProps = {
  content: string;
  route: string;
};

export default function SectionHeader({ content }: InputProps) {
  const { navigateToTab } = useTabNavigation();

  const handleSearchPress = () => {
    navigateToTab("search");
  };
  
  return (
    <View
      style={[
        layout.flex_row,
        { justifyContent: "space-between", marginBottom: 15 },
      ]}
    >
      <Text style={styles.section_label}>{content}</Text>
      <TouchableOpacity onPress={handleSearchPress}>
        <Text style={link.sub_link}>See All</Text>
      </TouchableOpacity>
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
