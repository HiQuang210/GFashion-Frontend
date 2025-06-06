import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import SearchBar from "@/components/SearchBar";
import ProductItem from "@/components/ProductItem";
import CategoryTabs from "@/components/CategoryTabs";
import FilterModal from "@/components/FilterModal";
import Pagination from "@/components/Pagination";
import { ProductAPI } from "@/api/services/ProductService";
import { Product } from "@/types/product";
import { styles } from "@/styles/searchpage";
import { CATEGORIES, SORT_OPTIONS, PRODUCERS } from "@/types/enum/filter";

interface FilterState {
  sortBy: string;
  priceRange: { min: string; max: string };
  selectedProducer: string;
}

const INITIAL_FILTER_STATE: FilterState = {
  sortBy: "newest",
  priceRange: { min: "", max: "" },
  selectedProducer: "",
};

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(0);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTER_STATE);

  // Fetch products with optimized query
  const { data: productsData, isLoading, refetch } = useQuery({
    queryKey: ["products", searchQuery, selectedCategory, currentPage, filters],
    queryFn: () => {
      const params: any = {
        page: currentPage,
        limit: 10,
        sortBy: filters.sortBy,
        sortOrder: filters.sortBy.includes("price-high") ? "desc" : "asc",
      };

      if (searchQuery) params.query = searchQuery;
      if (selectedCategory !== "all") params.type = selectedCategory;
      if (filters.selectedProducer) params.producer = filters.selectedProducer;
      if (filters.priceRange.min) params.minPrice = parseInt(filters.priceRange.min);
      if (filters.priceRange.max) params.maxPrice = parseInt(filters.priceRange.max);

      return ProductAPI.searchProducts(params);
    },
  });

  // Handlers
  const handleSearch = useCallback((text: string) => {
    setSearchQuery(text);
    setCurrentPage(0);
  }, []);

  const handleCategoryChange = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentPage(0);
  }, []);

  const handleApplyFilters = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(0);
    setShowFilterModal(false);
    refetch();
  }, [refetch]);

  const handleClearFilters = useCallback(() => {
    setFilters(INITIAL_FILTER_STATE);
    setCurrentPage(0);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // Render functions
  const renderProductItem = ({ item }: { item: Product }) => (
    <View style={styles.productItemContainer}>
      <ProductItem data={item} />
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No products found</Text>
    </View>
  );

  const renderLoadingState = () => (
    <View style={styles.loadingContainer}>
      <Text style={styles.loadingText}>Loading products...</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Search Bar */}
      <View style={styles.header}>
        <SearchBar
          value={searchQuery}
          onChangeText={handleSearch}
          onFilterPress={() => setShowFilterModal(true)}
        />
      </View>

      {/* Category Tabs */}
      <CategoryTabs
        categories={CATEGORIES}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />

      {/* Products Grid */}
      <View style={styles.productsContainer}>
        {isLoading ? (
          renderLoadingState()
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
            ListEmptyComponent={renderEmptyState}
          />
        )}
      </View>

      {/* Pagination */}
      {productsData?.data && productsData.data.length > 0 && (
        <Pagination
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      )}

      {/* Filter Modal */}
      <FilterModal
        visible={showFilterModal}
        filters={filters}
        sortOptions={SORT_OPTIONS}
        producers={PRODUCERS}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
        onClose={() => setShowFilterModal(false)}
      />
    </SafeAreaView>
  );
}