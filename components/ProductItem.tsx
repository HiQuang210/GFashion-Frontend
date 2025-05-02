import { Image, Text, View, StyleSheet, TouchableOpacity } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, router } from "expo-router";
import layout from "@/styles/layout";
import text from "@/styles/text";
import LikeButton from "./LikeButton";

export default function ProductItem({ data }: any) {
  return (
    <TouchableOpacity
      onPress={() =>
        router.push({ pathname: "/product/[id]", params: { id: data[0]._id } })
      }
      style={{ position: "relative" }}
    >
      <LikeButton />
      <View style={layout.margin_bottom_xs}>
        <Image
          source={{ uri: data[0]?.images[0] }}
          resizeMode="stretch"
          style={styles.img}
        />
      </View>
      <View style={[styles.flex, { justifyContent: "space-between" }]}>
        <View>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[styles.name_product, { width: 120 }]}
          >
            {data[0]?.name}
          </Text>
          <Text style={styles.price}>
            {data[0].price.toLocaleString?.("vi-VN")}đ
          </Text>
        </View>
        <View
          style={[styles.flex, { alignItems: "flex-start" }, layout.gap_xs]}
        >
          <FontAwesome name="star" size={20} color={"#fcaf23"} />
          <Text style={text.gray_text}>{data[0]?.rating}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  flex: {
    display: "flex",
    flexDirection: "row",
  },
  img: {
    width: 160,
    height: 160,
    borderRadius: 20,
  },
  name_product: {
    fontSize: 12,
    fontFamily: "Inter",
  },
  price: {
    fontSize: 16,
    fontWeight: "600",
  },
});
