import { Link } from "expo-router";
import { TouchableOpacity, View, StyleSheet, TextInput } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from "@expo/vector-icons/Feather";

export default function SearchBar() {
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Feather name="search" size={24} color={"#704F38"} />
        <TextInput
          placeholder="Search"
          keyboardType="default"
          inputMode="text"
          style={styles.input}
        />
        <TouchableOpacity style={styles.filterButton}>
          <Link href="/" asChild>
            <TouchableOpacity style={styles.filterButton}>
              <AntDesign name="filter" size={24} color="black" />
            </TouchableOpacity>
          </Link>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.5,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 30,
    borderColor: "#bcbcbc",
    gap: 12,
  },

  input: {
    fontSize: 20,
    fontFamily: "Inter",
    color: "#797979",
    flex: 1,
  },
  
  filterButton: {
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
});