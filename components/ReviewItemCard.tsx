import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { ReviewItemCardProps, RatingStarsProps } from "@/types/review";

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatCurrency = (value: number = 0): string =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    value
  );

const RatingStars = ({ rating }: RatingStarsProps) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Feather
        key={i}
        name="star"
        size={16}
        style={styles.starIcon}
        color={i <= rating ? "#FFD700" : "#d3d3d3"}
      />
    );
  }
  return <View style={{ flexDirection: "row" }}>{stars}</View>;
};

export default function ReviewItemCard({ review }: ReviewItemCardProps) {
  if (!review || !review.productReviews || review.productReviews.length === 0) {
    return null;
  }

  const firstProductReview = review.productReviews[0];
  const product = firstProductReview.productId;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.date}>
          Reviewed on: {formatDate(review.createdAt)}
        </Text>
        <RatingStars rating={review.overallRating} />
      </View>

      {review.overallComment && (
        <Text style={styles.overallComment}>"{review.overallComment}"</Text>
      )}

      <View style={styles.productSection}>
        {product?.images && product.images.length > 0 && (
          <Image
            source={{ uri: product.images[0] }}
            style={styles.productImage}
          />
        )}
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={1}>
            {product?.name || "Product not available"}
          </Text>
          <RatingStars rating={firstProductReview.rating} />
          {firstProductReview.comment && (
            <Text style={styles.productComment} numberOfLines={2}>
              - {firstProductReview.comment}
            </Text>
          )}
        </View>
      </View>
      {review.productReviews.length > 1 && (
        <Text style={styles.moreItemsText}>
          + {review.productReviews.length - 1} more reviewed items
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  date: {
    fontSize: 13,
    color: "#797979",
  },
  starIcon: {
    marginRight: 2,
  },
  overallComment: {
    fontStyle: "italic",
    color: "#555",
    marginBottom: 16,
    paddingLeft: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#f0f0f0",
  },
  productSection: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: "#f0f0f0",
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  productComment: {
    fontSize: 14,
    color: "#666",
    marginTop: 6,
  },
  moreItemsText: {
    textAlign: "right",
    fontSize: 13,
    color: "#704F38",
    marginTop: 8,
    fontWeight: "500",
  },
});