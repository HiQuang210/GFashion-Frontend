import { View } from "react-native";
import TypeItem from "./TypeItem";
import layout from "@/styles/layout";
import { useState } from "react";

export default function TypeSection() {
  const [activeType, setActiveType] = useState("All");

  const handlePress = (type: string) => {
    setActiveType(type);
  };
  return (
    <View
      style={[
        layout.flex_row,
        layout.gap_xs,
        { marginLeft: 20, marginBottom: 20 },
      ]}
    >
      <TypeItem
        type="All"
        isActive={activeType === "All"}
        onPress={handlePress}
      />
      <TypeItem
        type="Jacket"
        isActive={activeType === "Jacket"}
        onPress={handlePress}
      />
    </View>
  );
}
