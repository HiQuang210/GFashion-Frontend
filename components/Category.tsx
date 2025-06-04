import { View, StyleSheet, ScrollView } from "react-native";
import SectionHeader from "./SectionHeader";
import CategoryItem from "./CategoryItem";

export default function Category() {
  const categories = [
    "tshirt",
    "pant", 
    "jacket",
    "dress",
    "shoes",
    "accessories",
    "bags",
    "hat"
  ];

  return (
    <View style={{ marginBottom: 30 }}>
      <SectionHeader content="Category" route="" />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          gap: 16, 
        }}
        style={{ marginHorizontal: -16 }} 
      >
        {categories.map((category, index) => (
          <View key={index} style={styles.categoryWrapper}>
            <CategoryItem content={category} />
          </View>
        ))}
      </ScrollView>
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
  categoryWrapper: {

  },
});