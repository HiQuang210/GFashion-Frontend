import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  Platform,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { filterModalStyles } from "@/styles/filtermodal";

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
      presentationStyle="overFullScreen"
      statusBarTranslucent={true} // Important for Android
    >
      <View style={[filterModalStyles.modalOverlay, { paddingTop: Platform.OS === 'ios' ? 0 : 20 }]}>
        <View style={[
          filterModalStyles.modalContent,
          Platform.OS === 'ios' && {
            paddingBottom: 10, // Account for iPhone home indicator
          }
        ]}>
          {/* Fixed Header */}
          <View style={filterModalStyles.modalHeader}>
            <Text style={filterModalStyles.modalTitle}>Filter Products</Text>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={24} color="#704F38" />
            </TouchableOpacity>
          </View>

          {/* Scrollable Content */}
          <ScrollView 
            style={filterModalStyles.modalBody}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ 
              paddingBottom: Platform.OS === 'ios' ? 40 : 20,
              flexGrow: 1 
            }}
            bounces={false} // Disable bouncing on iOS
          >
            {/* Sort By */}
            <View style={filterModalStyles.filterSection}>
              <Text style={filterModalStyles.filterSectionTitle}>Sort By</Text>
              {sortOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={filterModalStyles.filterOption}
                  onPress={() => updateSortBy(option.id)}
                >
                  <Text style={filterModalStyles.filterOptionText}>{option.name}</Text>
                  {localFilters.sortBy === option.id && (
                    <Feather name="check" size={16} color="#704F38" />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Price Range */}
            <View style={filterModalStyles.filterSection}>
              <Text style={filterModalStyles.filterSectionTitle}>Price Range</Text>
              <View style={filterModalStyles.priceInputContainer}>
                <TextInput
                  style={filterModalStyles.priceInput}
                  placeholder="Min"
                  value={localFilters.priceRange.min}
                  onChangeText={(text) => updatePriceRange('min', text)}
                  keyboardType="numeric"
                />
                <Text style={filterModalStyles.priceInputSeparator}>-</Text>
                <TextInput
                  style={filterModalStyles.priceInput}
                  placeholder="Max"
                  value={localFilters.priceRange.max}
                  onChangeText={(text) => updatePriceRange('max', text)}
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Producer/Producer */}
            <View style={filterModalStyles.filterSection}>
              <Text style={filterModalStyles.filterSectionTitle}>Producer</Text>
              {producers.map((producer) => (
                <TouchableOpacity
                  key={producer}
                  style={filterModalStyles.filterOption}
                  onPress={() => updateProducer(producer)}
                >
                  <Text style={filterModalStyles.filterOptionText}>{producer}</Text>
                  {localFilters.selectedProducer === producer && (
                    <Feather name="check" size={16} color="#704F38" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* Fixed Footer */}
          <View style={filterModalStyles.modalFooter}>
            <TouchableOpacity
              style={filterModalStyles.clearButton}
              onPress={handleClear}
            >
              <Text style={filterModalStyles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={filterModalStyles.applyButton}
              onPress={handleApply}
            >
              <Text style={filterModalStyles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}