import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";

interface StatsCardProps {
  icon: React.ComponentProps<typeof FontAwesome>["name"];
  label: string;
  value: any;
  onPress?: () => void;
}

const StatsCard = ({ icon, label, value, onPress }: StatsCardProps) => {
  const displayValue = String(value ?? "0");

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} disabled={!onPress}>
      <FontAwesome name={icon} size={24} color="#704F38" />
      <Text style={styles.value}>{displayValue}</Text>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
  },
  value: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2029",
    marginTop: 8,
  },
  label: {
    fontSize: 13,
    color: "#797979",
    marginTop: 2,
  },
});

export default StatsCard;