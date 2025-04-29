import { ScrollView, View, Text } from "react-native";
import SectionHeader from "./SectionHeader";
import ProductItem from "./ProductItem";
import layout from "@/styles/layout";
import { useTop4BestSellingProducts } from "../customHooks/product/useProducts";

export default function BestSeller() {
  const { data, isLoading, isError } = useTop4BestSellingProducts();
  console.log("best");
  console.log(data);

  if (isLoading) return <Text>...Loading</Text>;
  return (
    <View style={{ marginBottom: 20 }}>
      <SectionHeader content="Best Seller" route="" />
      <View
        style={[
          { display: "flex", flexDirection: "row", flexWrap: "wrap" },
          layout.gap_l,
        ]}
      >
        <ProductItem data={data.data} />
        <ProductItem data={data.data} />
        <ProductItem data={data.data} />
        <ProductItem data={data.data} />
      </View>
    </View>
  );
}
