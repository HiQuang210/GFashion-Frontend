import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import link from "@/styles/link";

interface CustomButtonProps {
  content: string;
  onPress: () => void;
  isPending?: boolean;
  disabled?: boolean;
  style?: any;
}

const CustomButton = ({
  content,
  onPress,
  isPending = false,
  disabled = false,
  style,
}: CustomButtonProps) => {
  return (
    <TouchableOpacity
      style={[
        link.btn_link,
        link.btn_link_base,
        styles.button,
        isPending && styles.disabledButton,
        style,
        {
          opacity: isPending ? 0.6 : 1,
          alignItems: "center",
          justifyContent: "center",
          height: 50,
        },
      ]}
      onPress={onPress}
      disabled={disabled || isPending}
    >
      <Text style={styles.buttonText}>
        {isPending ? "Signing In..." : content}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#704F38", 
  },
  buttonText: {
    color: "#fff",            
    fontSize: 18,              
    textAlign: "center",     
  },
  disabledButton: {
    opacity: 0.6,            
  },
});

export default CustomButton;
