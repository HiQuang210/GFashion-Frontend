import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  StyleSheet,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";

interface FilterState {
  sortBy: string;
  priceRange: { min: string; max: string };
  selectedProducer: string;
}

interface SortOption {
  id: string;
  name: string;
}

interface FilterModalProps {
  visible: boolean;
  filters: FilterState;
  sortOptions: SortOption[];
  producers: string[];
  onApply: (filters: FilterState) => void;
  onClear: () => void;
  onClose: () => void;
}

export default function FilterModal({
  visible,
  filters,
  sortOptions,
  producers,
  onApply,
  onClear,
  onClose,
}: FilterModalProps) {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleApply = () => {
    onApply(localFilters);
  };

  const handleClear = () => {
    const clearedFilters = {
      sortBy: "newest",
      priceRange: { min: "", max: "" },
      selectedProducer: "",
    };
    setLocalFilters(clearedFilters);
    onClear();
  };

  const updateSortBy = (sortBy: string) => {
    setLocalFilters(prev => ({ ...prev, sortBy }));
  };

  const updatePriceRange = (field: 'min' | 'max', value: string) => {
    setLocalFilters(prev => ({
      ...prev,
      priceRange: { ...prev.priceRange, [field]: value }
    }));
  };

  const updateProducer = (producer: string) => {
    setLocalFilters(prev => ({
      ...prev,
      selectedProducer: prev.selectedProducer === producer ? "" : producer
    }));
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filter Products</Text>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={24} color="#704F38" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            {/* Sort By */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Sort By</Text>
              {sortOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={styles.filterOption}
                  onPress={() => updateSortBy(option.id)}
                >
                  <Text style={styles.filterOptionText}>{option.name}</Text>
                  {localFilters.sortBy === option.id && (
                    <Feather name="check" size={16} color="#704F38" />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Price Range */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Price Range</Text>
              <View style={styles.priceInputContainer}>
                <TextInput
                  style={styles.priceInput}
                  placeholder="Min"
                  value={localFilters.priceRange.min}
                  onChangeText={(text) => updatePriceRange('min', text)}
                  keyboardType="numeric"
                />
                <Text style={styles.priceInputSeparator}>-</Text>
                <TextInput
                  style={styles.priceInput}
                  placeholder="Max"
                  value={localFilters.priceRange.max}
                  onChangeText={(text) => updatePriceRange('max', text)}
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Producer/Brand */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Brand</Text>
              {producers.map((producer) => (
                <TouchableOpacity
                  key={producer}
                  style={styles.filterOption}
                  onPress={() => updateProducer(producer)}
                >
                  <Text style={styles.filterOptionText}>{producer}</Text>
                  {localFilters.selectedProducer === producer && (
                    <Feather name="check" size={16} color="#704F38" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClear}
            >
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={handleApply}
            >
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  modalBody: {
    flex: 1,
    padding: 20,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  filterOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  filterOptionText: {
    fontSize: 14,
    color: "#333",
  },
  priceInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  priceInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  priceInputSeparator: {
    fontSize: 16,
    color: "#666",
  },
  modalFooter: {
    flexDirection: "row",
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  clearButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#704F38",
    alignItems: "center",
  },
  clearButtonText: {
    fontSize: 16,
    color: "#704F38",
    fontWeight: "500",
  },
  applyButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#704F38",
    alignItems: "center",
  },
  applyButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "500",
  },
});