import { Image, Text, View, StyleSheet, TouchableOpacity } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router } from "expo-router";
import text from "@/styles/text";
import LikeButton from "./LikeButton";
import { Product } from "@/types/product";

interface ProductItemProps {
  data: Product;
}

export default function ProductItem({ data }: ProductItemProps) {
  if (!data) {
    return <View><Text>No product data</Text></View>;
  }

  return (
    <TouchableOpacity
      onPress={() =>
        router.push({ pathname: "/product/[id]", params: { id: data._id } })
      }
      style={styles.container}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: data.images?.[0] || '' }}
          resizeMode="stretch"
          style={styles.img}
        />
        <View style={styles.favoriteButton}>
          <LikeButton />
        </View>
      </View>

      <View style={styles.productInfo}>
        <View style={styles.leftInfo}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={styles.name_product}
          >
            {data.name || 'Unknown Product'}
          </Text>
          <Text style={styles.price}>
            {data.price?.toLocaleString?.("vi-VN") || '0'}đ
          </Text>
        </View>
        
        <View style={styles.ratingContainer}>
          <FontAwesome name="star" size={16} color={"#fcaf23"} />
          <Text style={[text.gray_text, styles.ratingText]}>
            {data.rating || '0'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    width: "100%",
  },
  imageContainer: {
    position: "relative",
    marginBottom: 8,
  },
  img: {
    width: "100%",
    height: 185,
    borderRadius: 20,
  },
  favoriteButton: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 1,
  },
  productInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  leftInfo: {
    flex: 1,
    marginRight: 8,
  },
  name_product: {
    fontSize: 12,
    fontFamily: "Inter",
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: "600",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
  },
});