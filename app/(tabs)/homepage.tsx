import BestSeller from "@/components/BestSeller";
import Category from "@/components/Category";
import HomeHeader from "@/components/HomeHeader";
import NewSection from "@/components/NewSection";
import SearchBar from "@/components/SearchBar";
import Slider from "@/components/Slider";
import { SafeAreaView, View, StyleSheet, ScrollView } from "react-native";

export default function HomePage() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={{ marginTop: 0, marginHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <HomeHeader />
        <SearchBar />
        <Slider />
        <Category />
        <NewSection />
        <BestSeller />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f9f9f9",
  },
});
