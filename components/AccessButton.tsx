import { Text, TouchableOpacity } from "react-native";
import link from "@/styles/link";

interface BtnProps {
  route?: string;
  content: string;
  color?: string;
  background?: string;
  onPress?: () => void;
  disabled?: boolean;
  style?: any;
}

export default function AccessButton({
  content,
  background = "#704F38",
  color = "#fff",
  onPress,
  disabled,
  style,
}: BtnProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        link.btn_link,
        link.btn_link_base,
        {
          backgroundColor: background,
          opacity: disabled ? 0.6 : 1,
          alignItems: "center",      
          justifyContent: "center",   
        },
        style,
      ]}
    >
      <Text
        style={{
          color,
          fontSize: 16,
          fontWeight: "600",
          textAlign: "center",
        }}
      >
        {content}
      </Text>
    </TouchableOpacity>
  );
}
