import BackButton from "@/components/BackButton";
import CartItem from "@/components/CartItem";
import Category from "@/components/Category";
import HomeHeader from "@/components/HomeHeader";
import NewSection from "@/components/NewSection";
import PageHeader from "@/components/PageHeader";
import SearchBar from "@/components/SearchBar";
import Slider from "@/components/Slider";
import { SafeAreaView, View, StyleSheet, ScrollView } from "react-native";

export default function CartPage() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <PageHeader content="My Cart" />
        <View style={{}}>
          <CartItem />
          <CartItem />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f9f9f9",
  },
});
