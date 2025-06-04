import { View, Text, Dimensions } from "react-native";
import SectionHeader from "./SectionHeader";
import ProductItem from "./ProductItem";
import { useTop4LatestProducts } from "@/hooks/useProduct";

const { width: screenWidth } = Dimensions.get('window');

export default function NewSection() {
  const { data, isLoading, isError } = useTop4LatestProducts();

  if (isLoading) return <Text>...Loading</Text>;
  if (isError || !data || !data.data || data.data.length === 0) {
    return <Text>No products available</Text>;
  }

  // Tính toán chiều rộng cho mỗi item (2 cột)
  const itemWidth = (screenWidth - 32) / 2; // 32 = padding left + right (16 mỗi bên)
  const gap = 12; // gap giữa các items

  return (
    <View style={{ marginBottom: 20 }}>
      <SectionHeader content="Newest" route="" />
      <View style={{
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
      }}>
        {data.data.slice(0, 4).map((product, index) => (
          <View 
            key={product._id || index}
            style={{ 
              width: '48%', // Chiếm 48% chiều rộng, để lại 4% cho gap
              marginBottom: 12
            }}
          >
            <ProductItem data={product} />
          </View>
        ))}
      </View>
    </View>
  );
}