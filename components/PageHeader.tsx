import { Text, View } from "react-native";
import BackButton from "./BackButton";
import layout from "@/styles/layout";
import text from "@/styles/text";

type InputProps = {
  content: string;
};

export default function PageHeader({ content }: InputProps) {
  return (
    <View
      style={[
        {
          marginHorizontal: 20,
          display: "flex",
          flexDirection: "row",
          alignItems: "baseline",
        },
      ]}
    >
      <BackButton />
      <Text
        style={[text.page_header, { width: "auto", marginHorizontal: "26%" }]}
      >
        {content}
      </Text>
    </View>
  );
}
