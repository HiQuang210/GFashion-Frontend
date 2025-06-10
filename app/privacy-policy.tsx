import React from "react";
import { ScrollView, Text, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SubPageHeader from "@/components/SubPageHeader";

interface PolicySectionProps {
  title: string;
  children: React.ReactNode;
}

const PolicySection = ({ title, children }: PolicySectionProps) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <Text style={styles.sectionContent}>{children}</Text>
  </View>
);

export default function PrivacyPolicyPage() {
  return (
    <SafeAreaView style={styles.container}>
      <SubPageHeader title="Privacy Policy" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.lastUpdated}>Last Updated: June, 2025</Text>

        <PolicySection title="1. Information We Collect">
          We collect information you provide directly to us, such as when you
          create an account, place an order, or contact customer support. This
          includes your name, email address, phone number, shipping address, and
          payment information.
        </PolicySection>

        <PolicySection title="2. How We Use Your Information">
          Your information is used to:
          {"\n"}- Fulfill and manage your orders.
          {"\n"}- Communicate with you about your account and provide customer
          support.
          {"\n"}- Personalize your shopping experience.
          {"\n"}- Improve our services and develop new features.
          {"\n"}- Prevent fraudulent activity.
        </PolicySection>

        <PolicySection title="3. Information Sharing">
          We do not sell your personal information. We may share your
          information with third-party service providers who perform services on
          our behalf, such as payment processing and order fulfillment. These
          providers are obligated to protect your information.
        </PolicySection>

        <PolicySection title="4. Data Security">
          We implement reasonable security measures to protect your information
          from unauthorized access, use, or disclosure. However, no method of
          transmission over the Internet is 100% secure.
        </PolicySection>

        <PolicySection title="5. Your Rights">
          You have the right to access, update, or delete your personal
          information at any time through your account settings or by contacting
          us directly.
        </PolicySection>
      </ScrollView>
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
  lastUpdated: {
    fontSize: 14,
    color: "#797979",
    marginBottom: 24,
    fontStyle: "italic",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#1F2029",
  },
  sectionContent: {
    fontSize: 15,
    lineHeight: 24,
    color: "#666",
  },
});