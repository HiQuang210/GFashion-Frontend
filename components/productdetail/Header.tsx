import React from "react";
import { View, Text } from "react-native";
import BackButton from "@/components/BackButton";
import { styles } from "@/styles/product-detail/header";
import FavoriteButton from "@/components/FavoriteButton";

export default function ProductHeader() {
  return (
    <View style={styles.header}>
      {/* Back Button */}
      <BackButton />

      {/* Title */}
      <Text style={styles.headerTitle}>Product Details</Text>

      {/* Favorite Button */}
      <View style={styles.favoriteButtonContainer}>
        <FavoriteButton productId={""} />
      </View>
    </View>
  );
}
