import layout from "@/styles/layout";
import { capitalize } from "@/utils/helper";
import {
  Image,
  Text,
  View,
  StyleSheet,
  ImageSourcePropType,
} from "react-native";

type InputProps = {
  content: string;
};

export default function CategoryItem({ content }: InputProps) {
  const imageMap: { [key: string]: ImageSourcePropType } = {
    tshirt: require("../assets/images/tshirt.png"),
    pant: require("../assets/images/pant.png"),
    dress: require("../assets/images/dress.png"),
    jacket: require("../assets/images/jacket.png"),
  };
  return (
    <View style={layout.flex_col}>
      <View style={[styles.img_container, layout.flex_col_center]}>
        <Image
          source={imageMap[content]}
          resizeMode="stretch"
          style={styles.img}
        />
      </View>
      <Text style={styles.text}>{capitalize(content)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  img: {
    width: 30,
    height: 30,
    color: "#704F38",
  },
  img_container: {
    width: 60,
    height: 60,
    borderRadius: 90,
    backgroundColor: "#f7f2ed",
    marginBottom: 8,
  },
  text: {
    fontFamily: "Inter",
    fontSize: 16,
    textAlign: "center",
    width: 60,
  },
});
