import React from "react";
import { View, Text } from "react-native";
import LikeButton from "@/components/FavoriteButton";
import BackButton from "@/components/BackButton";
import { styles } from "@/styles/product-detail/header";

export default function ProductHeader() {
  return (
    <View style={styles.header}>
      {/* Back Button */}
      <BackButton />

      {/* Title */}
      <Text style={styles.headerTitle}>Product Details</Text>

      {/* Like Button */}
      <View style={styles.likeButtonContainer}>
        <LikeButton />
      </View>
    </View>
  );
}
