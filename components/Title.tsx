import text from "@/styles/text";
import { Text } from "react-native";

type TitleProps = {
  mainTitle: string;
  subTitle: string;
  margin_bot: number;
};

export default function Title({ mainTitle, subTitle, margin_bot }: TitleProps) {
  return (
    <>
      <Text style={text.main_title}>{mainTitle}</Text>
      <Text style={[text.sub_title, { marginBottom: margin_bot }]}>
        {subTitle}
      </Text>
    </>
  );
}
