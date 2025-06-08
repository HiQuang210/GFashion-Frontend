import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function BackButton() {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={{
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#F5F5F5",
        justifyContent: "center",
        alignItems: "center",
      }}
      onPress={() => router.back()}
    >
      <FontAwesome name="arrow-left" size={20} color="#000000" />
    </TouchableOpacity>
  );
}
