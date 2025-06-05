import React from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import Feather from "@expo/vector-icons/Feather";

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface CategoryTabsProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export default function CategoryTabs({ 
  categories, 
  selectedCategory, 
  onCategoryChange 
}: CategoryTabsProps) {
  const renderCategoryTab = (category: Category) => (
    <TouchableOpacity
      key={category.id}
      style={[
        styles.categoryTab,
        selectedCategory === category.id && styles.categoryTabActive,
      ]}
      onPress={() => onCategoryChange(category.id)}
    >
      <Feather
        name={category.icon as any}
        size={16}
        color={selectedCategory === category.id ? "#fff" : "#704F38"}
      />
      <Text
        style={[
          styles.categoryTabText,
          selectedCategory === category.id && styles.categoryTabTextActive,
        ]}
      >
        {category.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.categoryContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryScrollContent}
      >
        {categories.map(renderCategoryTab)}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  categoryContainer: {
    backgroundColor: "#fff",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  categoryScrollContent: {
    paddingHorizontal: 16,
    gap: 10,
  },
  categoryTab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#704F38",
    gap: 6,
  },
  categoryTabActive: {
    backgroundColor: "#704F38",
  },
  categoryTabText: {
    fontSize: 12,
    color: "#704F38",
    fontWeight: "500",
  },
  categoryTabTextActive: {
    color: "#fff",
  },
});