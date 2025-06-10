import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import BackButton from "@/components/BackButton";
import SectionProfile from "@/components/SectionProfile";
import SubPageHeader from "@/components/SubPageHeader";

export default function Settings() {
  return (
    <SafeAreaView style={styles.container}>
      <SubPageHeader title="Settings" />

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>
          <SectionProfile
            icon={"key"}
            content={"Password Manager"}
            route={"/change-password"}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  placeholder: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    color: "#999",
    backgroundColor: "#fff",
    borderRadius: 12,
  },
});