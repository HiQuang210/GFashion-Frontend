import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { ReviewAPI } from "@/api/services/ReviewService";

import BackButton from "@/components/BackButton";
import ReviewItemCard from "@/components/ReviewItemCard";

export default function MyReviewsPage() {
  const {
    data: reviewsData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["userReviews"],
    queryFn: () => ReviewAPI.getUserReviews(),
  });

  const renderContent = () => {
    if (isLoading) {
      return (
        <ActivityIndicator
          size="large"
          color="#704F38"
          style={{ marginTop: 50 }}
        />
      );
    }

    if (isError) {
      return (
        <Text style={styles.emptyText}>
          Failed to load reviews. Please try again.
        </Text>
      );
    }

    if (!reviewsData?.data || reviewsData.data.length === 0) {
      return (
        <Text style={styles.emptyText}>
          You haven't written any reviews yet.
        </Text>
      );
    }

    return (
      <FlatList
        data={reviewsData.data}
        renderItem={({ item }) => <ReviewItemCard review={item} />}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.headerTitle}>My Reviews</Text>
        <View style={{ width: 40 }} />
      </View>
      <View style={styles.content}>{renderContent()}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
  list: {
    padding: 16,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "#797979",
  },
});