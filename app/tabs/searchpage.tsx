import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ScrollView,
  Modal,
  Dimensions,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import Octicons from "@expo/vector-icons/Octicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import ProductItem from "@/components/ProductItem";
import { ProductAPI } from "@/api/services/ProductService";
import { Product } from "@/types/product";

const { width: screenWidth } = Dimensions.get("window");

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(0);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [selectedProducer, setSelectedProducer] = useState("");

  const categories = [
    { id: "all", name: "All", icon: "grid" },
    { id: "tshirt", name: "T-Shirt", icon: "user" },
    { id: "pant", name: "Pants", icon: "user" },
    { id: "jacket", name: "Jacket", icon: "user" },
    { id: "dress", name: "Dress", icon: "user" },
    { id: "shoes", name: "Shoes", icon: "user" },
    { id: "accessories", name: "Accessories", icon: "watch" },
    { id: "bags", name: "Bags", icon: "shopping-bag" },
    { id: "hat", name: "Hat", icon: "user" },
    { id: "other", name: "Other", icon: "more-horizontal" },
  ];

  const sortOptions = [
    { id: "newest", name: "Newest" },
    { id: "price-low", name: "Price: Low to High" },
    { id: "price-high", name: "Price: High to Low" },
    { id: "highest-rating", name: "Highest Rating" },
    { id: "best-seller", name: "Best Seller" },
  ];

  const producers = [
    "Nike", "Adidas", "Zara", "H&M", "Uniqlo", "Gucci", "Louis Vuitton", "Prada"
  ];

  // Fetch products based on current filters
  const { data: productsData, isLoading, refetch } = useQuery({
    queryKey: ["products", searchQuery, selectedCategory, currentPage, sortBy, priceRange, selectedProducer],
    queryFn: () => {
      const params: any = {
        page: currentPage,
        limit: 10,
        sortBy: sortBy,
        sortOrder: sortBy.includes("price-high") ? "desc" : "asc",
      };

      if (searchQuery) params.query = searchQuery;
      if (selectedCategory !== "all") params.type = selectedCategory;
      if (selectedProducer) params.producer = selectedProducer;
      if (priceRange.min) params.minPrice = parseInt(priceRange.min);
      if (priceRange.max) params.maxPrice = parseInt(priceRange.max);

      return ProductAPI.searchProducts(params);
    },
  });

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    setCurrentPage(0);
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentPage(0);
  };

  const handleApplyFilters = () => {
    setCurrentPage(0);
    setShowFilterModal(false);
    refetch();
  };

  const handleClearFilters = () => {
    setSortBy("newest");
    setPriceRange({ min: "", max: "" });
    setSelectedProducer("");
    setCurrentPage(0);
  };

  const renderProductItem = ({ item, index }: { item: Product; index: number }) => (
    <View style={[styles.productItemContainer, { width: (screenWidth - 48) / 2 }]}>
      <ProductItem data={item} />
    </View>
  );

  const renderCategoryTab = (category: any) => (
    <TouchableOpacity
      key={category.id}
      style={[
        styles.categoryTab,
        selectedCategory === category.id && styles.categoryTabActive,
      ]}
      onPress={() => handleCategoryChange(category.id)}
    >
      <Feather
        name={category.icon as any}
        size={16}
        color={selectedCategory === category.id ? "#fff" : "#704F38"}
      />
      <Text
        style={[
          styles.categoryTabText,
          selectedCategory === category.id && styles.categoryTabTextActive,
        ]}
      >
        {category.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Search Bar */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Octicons name="search" size={20} color="#704F38" />
          <TextInput
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={handleSearch}
            style={styles.searchInput}
          />
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowFilterModal(true)}
          >
            <AntDesign name="filter" size={20} color="#704F38" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Category Tabs */}
      <View style={styles.categoryContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScrollContent}
        >
          {categories.map(renderCategoryTab)}
        </ScrollView>
      </View>

      {/* Products Grid */}
      <View style={styles.productsContainer}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading products...</Text>
          </View>
        ) : (
          <FlatList
            data={productsData?.data || []}
            renderItem={renderProductItem}
            keyExtractor={(item) => item._id}
            numColumns={2}
            contentContainerStyle={styles.productsList}
            showsVerticalScrollIndicator={false}
            onEndReached={() => {
              if (productsData?.data && productsData.data.length === 10) {
                setCurrentPage(prev => prev + 1);
              }
            }}
            onEndReachedThreshold={0.1}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No products found</Text>
              </View>
            }
          />
        )}
      </View>

      {/* Pagination */}
      {productsData?.data && productsData.data.length > 0 && (
        <View style={styles.paginationContainer}>
          <TouchableOpacity
            style={[styles.paginationButton, currentPage === 0 && styles.paginationButtonDisabled]}
            onPress={() => setCurrentPage(prev => Math.max(0, prev - 1))}
            disabled={currentPage === 0}
          >
            <Feather name="chevron-left" size={20} color={currentPage === 0 ? "#ccc" : "#704F38"} />
          </TouchableOpacity>
          
          <Text style={styles.paginationText}>Page {currentPage + 1}</Text>
          
          <TouchableOpacity
            style={styles.paginationButton}
            onPress={() => setCurrentPage(prev => prev + 1)}
          >
            <Feather name="chevron-right" size={20} color="#704F38" />
          </TouchableOpacity>
        </View>
      )}

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Products</Text>
              <TouchableOpacity onPress={() => setShowFilterModal(false)}>
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
                    onPress={() => setSortBy(option.id)}
                  >
                    <Text style={styles.filterOptionText}>{option.name}</Text>
                    {sortBy === option.id && (
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
                    value={priceRange.min}
                    onChangeText={(text) => setPriceRange(prev => ({ ...prev, min: text }))}
                    keyboardType="numeric"
                  />
                  <Text style={styles.priceInputSeparator}>-</Text>
                  <TextInput
                    style={styles.priceInput}
                    placeholder="Max"
                    value={priceRange.max}
                    onChangeText={(text) => setPriceRange(prev => ({ ...prev, max: text }))}
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
                    onPress={() => setSelectedProducer(selectedProducer === producer ? "" : producer)}
                  >
                    <Text style={styles.filterOptionText}>{producer}</Text>
                    {selectedProducer === producer && (
                      <Feather name="check" size={16} color="#704F38" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.clearButton}
                onPress={handleClearFilters}
              >
                <Text style={styles.clearButtonText}>Clear All</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={handleApplyFilters}
              >
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 15,
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  filterButton: {
    padding: 4,
  },
  categoryContainer: {
    backgroundColor: "#fff",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  categoryScrollContent: {
    paddingHorizontal: 16,
    gap: 10,
  },
  categoryTab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#704F38",
    gap: 6,
  },
  categoryTabActive: {
    backgroundColor: "#704F38",
  },
  categoryTabText: {
    fontSize: 12,
    color: "#704F38",
    fontWeight: "500",
  },
  categoryTabTextActive: {
    color: "#fff",
  },
  productsContainer: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  productsList: {
    padding: 16,
    gap: 16,
  },
  productItemContainer: {
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    gap: 20,
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