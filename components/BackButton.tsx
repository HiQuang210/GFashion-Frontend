import { useRouter } from "expo-router";
import { TouchableOpacity, View } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";

import layout from "@/styles/layout";

export default function BackButton() {
  const router = useRouter();
  return (
    <TouchableOpacity
      style={[layout.container_rounded_small, { marginBottom: 20 }]}
      onPress={() => router.back()}
    >
      <View style={[layout.flex_row_center, { width: 40, height: 40 }]}>
        <AntDesign name="arrowleft" size={22} color={"#704F38"} />
      </View>
    </TouchableOpacity>
  );
}
