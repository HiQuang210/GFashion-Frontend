import { ScrollView, View, Text } from "react-native";
import SectionHeader from "./SectionHeader";
import ProductItem from "./ProductItem";
import layout from "@/styles/layout";
import { useTop4LatestProducts } from "../customHooks/product/useProducts";

export default function NewSection() {
  const { data, isLoading, isError } = useTop4LatestProducts();

  if (isLoading) return <Text>...Loading</Text>;
  return (
    <View style={{ marginBottom: 20 }}>
      <SectionHeader content="Newest" route="" />
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
