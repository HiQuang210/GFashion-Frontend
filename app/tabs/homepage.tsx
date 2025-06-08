import BestSeller from "@/components/BestSeller";
import Category from "@/components/Category";
import HomeHeader from "@/components/HomeHeader";
import NewSection from "@/components/NewSection";
import SearchBar from "@/components/SearchBar";
import Slider from "@/components/Slider";
import { SafeAreaView, StyleSheet, ScrollView } from "react-native";
import { useTabNavigation } from "@/contexts/TabNavigation";

export default function HomePage() {
  const { navigateToTab } = useTabNavigation();

  const handleSearchPress = () => {
    navigateToTab("search");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 50 }} 
        style={{ marginHorizontal: 20 }} 
        showsVerticalScrollIndicator={false}
      >
        <HomeHeader />
        <SearchBar
          readOnly
          onPress={handleSearchPress}
        />
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
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
});