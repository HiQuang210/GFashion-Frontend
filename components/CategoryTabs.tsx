import React from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image, ImageSourcePropType } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { Ionicons } from "@expo/vector-icons";
import { Category, CategoryTabsProps } from "@/types/category";

export default function CategoryTabs({ 
  categories, 
  selectedCategory, 
  onCategoryChange 
}: CategoryTabsProps) {
  const imageMap: { [key: string]: ImageSourcePropType } = {
    tshirt: require("@/assets/images/tshirt.png"),
    pant: require("@/assets/images/pant.png"),
    dress: require("@/assets/images/dress.png"),
    jacket: require("@/assets/images/jacket.png"),
    shoes: require("@/assets/images/shoes.png"),
    accessories: require("@/assets/images/accessories.png"),
    bags: require("@/assets/images/bags.png"),
    hat: require("@/assets/images/hat.png"),
  };

  const renderIcon = (category: Category, isSelected: boolean) => {
    const iconColor = isSelected ? "#fff" : "#704F38";
    const iconSize = 16;

    switch (category.iconLibrary) {
      case "feather":
        return (
          <Feather
            name={category.icon as any}
            size={iconSize}
            color={iconColor}
          />
        );
      case "ionicons":
        return (
          <Ionicons
            name={category.icon as any}
            size={iconSize}
            color={iconColor}
          />
        );
      case "image":
        return (
          <Image
            source={imageMap[category.icon]}
            style={[
              styles.categoryIcon,
              {
                tintColor: iconColor,
              }
            ]}
            resizeMode="contain"
          />
        );
      default:
        return (
          <Feather
            name="help-circle"
            size={iconSize}
            color={iconColor}
          />
        );
    }
  };

  const renderCategoryTab = (category: Category) => (
    <TouchableOpacity
      key={category.id}
      style={[
        styles.categoryTab,
        selectedCategory === category.id && styles.categoryTabActive,
      ]}
      onPress={() => onCategoryChange(category.id)}
    >
      {renderIcon(category, selectedCategory === category.id)}
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
  categoryIcon: {
    width: 16,
    height: 16,
  },
});