import { View, Text } from "react-native";
import SectionHeader from "./SectionHeader";
import ProductItem from "./ProductItem";
import layout from "@/styles/layout";
import { useTop3BestSellingProducts } from "../hooks/useProduct";

export default function BestSeller() {
  const { data, isLoading, isError, error } = useTop3BestSellingProducts();

  if (isLoading) {
    return (
      <View style={{ marginBottom: 20 }}>
        <SectionHeader content="Best Seller" route="" />
        <Text>Loading best sellers...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={{ marginBottom: 20 }}>
        <SectionHeader content="Best Seller" route="" />
        <Text>Error loading best sellers: {error?.message}</Text>
      </View>
    );
  }

  if (!data?.data || data.data.length === 0) {
    return (
      <View style={{ marginBottom: 20 }}>
        <SectionHeader content="Best Seller" route="" />
        <Text>No best selling products found</Text>
      </View>
    );
  }

  return (
    <View style={{ marginBottom: 20 }}>
      <SectionHeader content="Best Seller" route="" />
      <View
        style={[
          { display: "flex", flexDirection: "row", flexWrap: "wrap" },
          layout.gap_l,
        ]}
      >
        {data.data.slice(0, 3).map((product, index) => (
          <ProductItem key={product._id || index} data={product} />
        ))}
      </View>
    </View>
  );
}