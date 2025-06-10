import React from "react";
import { View, Text, StyleSheet } from "react-native";
import BackButton from "./BackButton";

interface SubPageHeaderProps {
  title: string;
}

export default function SubPageHeader({ title }: SubPageHeaderProps) {
  return (
    <View style={styles.header}>
      <BackButton />
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={{ width: 40 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1F2029",
  },
});