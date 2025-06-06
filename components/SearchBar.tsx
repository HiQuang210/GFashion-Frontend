import React from "react";
import { TouchableOpacity, View, StyleSheet, TextInput } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from "@expo/vector-icons/Feather";

interface SearchBarProps {
  value?: string;
  onChangeText?: (text: string) => void;
  onFilterPress?: () => void;
  placeholder?: string;
}

export default function SearchBar({ 
  value, 
  onChangeText, 
  onFilterPress, 
  placeholder = "Search" 
}: SearchBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Feather name="search" size={24} color={"#704F38"} />
        <TextInput
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          keyboardType="default"
          inputMode="text"
          style={styles.input}
        />
        {onFilterPress && (
          <TouchableOpacity style={styles.filterButton} onPress={onFilterPress}>
            <AntDesign name="filter" size={24} color="#704F38" />
          </TouchableOpacity>
        )}
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