import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Feather from "@expo/vector-icons/Feather";

interface PaginationProps {
  currentPage: number;
  onPageChange: (page: number) => void;
  hasNextPage?: boolean;
}

export default function Pagination({ 
  currentPage, 
  onPageChange, 
  hasNextPage = true 
}: PaginationProps) {
  const handlePreviousPage = () => {
    if (currentPage > 0) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    onPageChange(currentPage + 1);
  };

  return (
    <View style={styles.paginationContainer}>
      <TouchableOpacity
        style={[
          styles.paginationButton,
          currentPage === 0 && styles.paginationButtonDisabled
        ]}
        onPress={handlePreviousPage}
        disabled={currentPage === 0}
      >
        <Feather 
          name="chevron-left" 
          size={20} 
          color={currentPage === 0 ? "#ccc" : "#704F38"} 
        />
      </TouchableOpacity>
      
      <Text style={styles.paginationText}>Page {currentPage + 1}</Text>
      
      <TouchableOpacity
        style={[
          styles.paginationButton,
          !hasNextPage && styles.paginationButtonDisabled
        ]}
        onPress={handleNextPage}
        disabled={!hasNextPage}
      >
        <Feather 
          name="chevron-right" 
          size={20} 
          color={!hasNextPage ? "#ccc" : "#704F38"} 
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    gap: 20
  },
  paginationButton: {
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#704F38",
  },
  paginationButtonDisabled: {
    borderColor: "#ccc",
  },
  paginationText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
});