import { TextInput, StyleSheet } from "react-native";

export default function VerifyInput() {
  return (
    <TextInput
      inputMode="numeric"
      keyboardType="number-pad"
      style={styles.verify_input}
      maxLength={1}
      textAlign="center"
    />
  );
}

const styles = StyleSheet.create({
  verify_input: {
    width: 60,
    height: 50,
    borderColor: "#bcbcbc",
    borderWidth: 1,
    borderRadius: 20,
  },
});
