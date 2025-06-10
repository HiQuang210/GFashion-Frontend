import React from "react";
import { ScrollView, Text, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SubPageHeader from "@/components/SubPageHeader";

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem = ({ question, answer }: FAQItemProps) => (
  <View style={styles.faqItem}>
    <Text style={styles.question}>{question}</Text>
    <Text style={styles.answer}>{answer}</Text>
  </View>
);

export default function HelpCenterPage() {
  return (
    <SafeAreaView style={styles.container}>
      <SubPageHeader title="Help Center" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Frequently Asked Questions</Text>

        <FAQItem
          question="How do I track my order?"
          answer="You can track your order in the 'My Orders' section of your profile. Each order will have a status indicating its current stage (Processing, Shipping, Completed)."
        />

        <FAQItem
          question="What is your return policy?"
          answer="We accept returns within 30 days of purchase for items that are unused and in their original condition. Please contact our support team to initiate a return."
        />

        <FAQItem
          question="How can I change my shipping address?"
          answer="Currently, you cannot change the shipping address after an order has been placed. Please ensure your address is correct before finalizing your purchase. You can manage your saved addresses in your profile settings."
        />

        <FAQItem
          question="What payment methods do you accept?"
          answer="We accept major credit cards (Visa, MasterCard), PayPal, and Cash on Delivery (COD) for eligible orders."
        />

        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>Still need help?</Text>
          <Text style={styles.contactText}>
            Contact our support team at{" "}
            <Text style={styles.email}>support@gfashion.com</Text>.
          </Text>
        </View>
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
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 24,
  },
  faqItem: {
    marginBottom: 20,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
  },
  question: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  answer: {
    fontSize: 15,
    lineHeight: 22,
    color: "#666",
  },
  contactSection: {
    marginTop: 20,
    padding: 20,
    backgroundColor: "#F4F1ED",
    borderRadius: 12,
    alignItems: "center",
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  contactText: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
  },
  email: {
    color: "#704F38",
    fontWeight: "bold",
  },
});