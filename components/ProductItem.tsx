import { Image, Text, View, StyleSheet, TouchableOpacity } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router } from "expo-router";
import text from "@/styles/text";
import FavoriteButton from "./FavoriteButton";
import { Product } from "@/types/product";

interface ProductItemProps {
  data: Product;
  onFavoriteChange?: (productId: string, isFavorite: boolean) => void;
}

export default function ProductItem({ data, onFavoriteChange }: ProductItemProps) {
  if (!data) {
    return (
      <View>
        <Text>No product data</Text>
      </View>
    );
  }

  const handleFavoriteChange = (isFavorite: boolean) => {
    onFavoriteChange?.(data._id, isFavorite);
  };

  return (
    <TouchableOpacity
      onPress={() =>
        router.push({ pathname: "/product/[id]", params: { id: data._id } })
      }
      style={styles.container}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: data.images?.[0] || "" }}
          resizeMode="stretch"
          style={styles.img}
        />
        <View style={styles.favoriteButton}>
          <FavoriteButton productId={data._id} onFavoriteChange={handleFavoriteChange} />
        </View>
      </View>

      <View style={styles.productInfo}>
        <View style={styles.leftInfo}>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.name_product}>
            {data.name || "Unknown Product"}
          </Text>
          <Text style={styles.price}>
            {data.price?.toLocaleString?.("vi-VN") || "0"}đ
          </Text>
        </View>

        <View style={styles.rightInfo}>
          <View style={styles.ratingContainer}>
            <FontAwesome name="star" size={16} color={"#fcaf23"} />
            <Text style={[text.gray_text, styles.ratingText]}>
              {data.rating || "0"}
            </Text>
          </View>
          <Text style={styles.soldText}>
            {data.sold ?? 0} sold
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
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  imageContainer: {
    position: "relative",
    marginBottom: 12,
  },
  img: {
    width: "100%",
    height: 180,
    borderRadius: 12,
  },
  favoriteButton: {
    position: "absolute",
    top: 1,
    right: 1,
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
  rightInfo: {
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 40,
    marginTop: -2,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
  },
  soldText: {
    fontSize: 12,
    color: "#999",
  },
});
