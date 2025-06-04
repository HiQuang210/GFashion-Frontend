import { View, Text, ScrollView, Dimensions } from "react-native";
import SectionHeader from "./SectionHeader";
import ProductItem from "./ProductItem";
import layout from "@/styles/layout";
import { useTop3BestSellingProducts } from "@/hooks/useProduct";

const { width: screenWidth } = Dimensions.get('window');

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

  const itemWidth = screenWidth * 0.45; 
  const itemSpacing = 16;

  return (
    <View style={{ marginBottom: 40 }}>
      <SectionHeader content="Best Seller" route="" />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
        }}
        decelerationRate="fast"
        snapToInterval={itemWidth + itemSpacing}
        snapToAlignment="start"
      >
        {data.data.slice(0, 3).map((product, index) => (
          <View 
            key={product._id || index}
            style={{
              width: itemWidth,
              marginRight: index < data.data.slice(0, 3).length - 1 ? itemSpacing : 0,
            }}
          >
            <ProductItem data={product} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}