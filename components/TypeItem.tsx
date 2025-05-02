import { Text, TouchableOpacity, StyleSheet } from "react-native";

type InputProps = {
  type: string;
  isActive: boolean;
  onPress: Function;
};

export default function TypeItem({ type, isActive, onPress }: InputProps) {
  return (
    <TouchableOpacity
      style={[styles.normal, isActive && styles.ative]}
      onPress={() => onPress(type)}
    >
      <Text style={isActive && { color: "#fff" }}>{type}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  normal: {
    borderWidth: 1,
    borderRadius: 20,
    borderColor: "#ededed",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  ative: {
    backgroundColor: "#704F38",
    borderWidth: 0,
  },
});
