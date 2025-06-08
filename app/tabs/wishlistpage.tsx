import SearchBar from "@/components/SearchBar";
import { SafeAreaView, StyleSheet, ScrollView } from "react-native";

export default function WishlistPage() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{ height: "100%" }}>
        <SearchBar/>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  },
});
