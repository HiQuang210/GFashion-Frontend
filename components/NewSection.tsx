import { ScrollView, View, Text } from "react-native";
import SectionHeader from "./SectionHeader";
import ProductItem from "./ProductItem";
import layout from "@/styles/layout";
import { useTop4LatestProducts } from "../hooks/useProduct";

export default function NewSection() {
  const { data, isLoading, isError } = useTop4LatestProducts();

  if (isLoading) return <Text>...Loading</Text>;
  
  if (isError || !data || !data.data || data.data.length === 0) {
    return <Text>No products available</Text>;
  }

  return (
    <View style={{ marginBottom: 20 }}>
      <SectionHeader content="Newest" route="" />
      <View
        style={[
          { display: "flex", flexDirection: "row", flexWrap: "wrap" },
          layout.gap_l,
        ]}
      >
        {data.data.slice(0, 4).map((product, index) => (
          <ProductItem key={product._id || index} data={product} />
        ))}
      </View>
    </View>
  );
}