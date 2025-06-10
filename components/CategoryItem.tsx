import layout from "@/styles/layout";
import { capitalize } from "@/utils/helper";
import {
  Image,
  Text,
  View,
  StyleSheet,
  ImageSourcePropType,
  TouchableOpacity,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";

type InputProps = {
  content: string;
  onPress?: () => void;
};

export default function CategoryItem({ content, onPress }: InputProps) {
  const imageMap: { [key: string]: ImageSourcePropType } = {
    tshirt: require("@/assets/images/tshirt.png"),
    pant: require("@/assets/images/pant.png"),
    dress: require("@/assets/images/dress.png"),
    jacket: require("@/assets/images/jacket.png"),
    shoes: require("@/assets/images/shoes.png"),
    accessories: require("@/assets/images/accessories.png"),
    bags: require("@/assets/images/bags.png"),
    hat: require("@/assets/images/hat.png"),
  };

  const renderIcon = () => {
    return (
      <Image
        source={imageMap[content]}
        resizeMode="stretch"
        style={styles.img}
      />
    );
  };

  const CategoryContent = () => (
    <View style={layout.flex_col}>
      <View style={[styles.img_container, layout.flex_col_center]}>
        {renderIcon()}
      </View>
      <Text style={styles.text}>{capitalize(content)}</Text>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <CategoryContent />
      </TouchableOpacity>
    );
  }

  return <CategoryContent />;
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