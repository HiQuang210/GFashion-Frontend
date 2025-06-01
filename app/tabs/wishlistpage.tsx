import BackButton from "@/components/BackButton";
import Category from "@/components/Category";
import HomeHeader from "@/components/HomeHeader";
import NewSection from "@/components/NewSection";
import PageHeader from "@/components/PageHeader";
import ProductItem from "@/components/ProductItem";
import SearchBar from "@/components/SearchBar";
import Slider from "@/components/Slider";
import TypeSection from "@/components/TypeSection";
import layout from "@/styles/layout";
import { SafeAreaView, View, StyleSheet, ScrollView } from "react-native";

export default function WishlistPage() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{ height: "100%" }}>
        <PageHeader content="My Wishlist" />
        <TypeSection />
        <View
          style={[
            {
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              marginHorizontal: 20,
            },
            layout.gap_l,
          ]}
        ></View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  },
});
