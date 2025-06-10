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
import { useFilter, FilterState } from "@/hooks/useFilter";

const PRODUCTS_PER_PAGE = 8;

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [showFilterModal, setShowFilterModal] = useState(false);

  // Use the custom filter hook
  const {
    filters,
    selectedCategory,
    updateFilters,
    updateCategory,
    clearAllFilters,
    buildApiParams,
    getActiveFiltersText,
    hasActiveFilters,
    activeFiltersCount,
  } = useFilter({
    onFiltersChange: () => {
      setCurrentPage(0);
    }
  });

  const { data: productsData, isLoading, error } = useQuery({
    queryKey: ["products", searchQuery, selectedCategory, currentPage, filters],
    queryFn: () => {
      const params = buildApiParams(searchQuery, currentPage, PRODUCTS_PER_PAGE);
      return ProductAPI.getAllProducts(params);
    },
    staleTime: 30000, // 30 seconds
    gcTime: 300000, // 5 minutes 
  });

  const currentProducts = productsData?.data || [];
  const totalPages = productsData?.totalPage || 1;
  const hasNextPage = currentPage < totalPages - 1;

  const handleCategoryChange = useCallback((categoryId: string) => {
    updateCategory(categoryId);
    setCurrentPage(0);
  }, [updateCategory]);

  const handleApplyFilters = useCallback((newFilters: FilterState) => {
    console.log('Applying filters:', newFilters);
    updateFilters(newFilters);
    setCurrentPage(0);
    setShowFilterModal(false);
  }, [updateFilters]);

  const handleClearFilters = useCallback(() => {
    console.log('Clearing all filters');
    clearAllFilters();
    setCurrentPage(0);
  }, [clearAllFilters]);

  const handlePageChange = useCallback((page: number) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  }, [totalPages]);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(0); 
  }, []);

  const renderProductItem = useCallback(({ item }: { item: Product }) => (
    <View style={styles.productItemContainer}>
      <ProductItem data={item} />
    </View>
  ), []);

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        {error ? "Error loading products" : "No products found"}
      </Text>
      {hasActiveFilters && (
        <Text style={styles.emptySubText}>
          Try adjusting your filters or search terms
        </Text>
      )}
    </View>
  );

  const renderLoadingState = () => (
    <View style={styles.loadingContainer}>
      <Text style={styles.loadingText}>Loading products...</Text>
    </View>
  );

  const renderFooter = () => {
    if (totalPages > 1) {
      return (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          hasNextPage={hasNextPage}
          onPageChange={handlePageChange}
        />
      );
    }
    return null;
  };

  const activeFiltersText = getActiveFiltersText();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Search Bar */}
      <View style={styles.header}>
        <SearchBar
          value={searchQuery}
          onChangeText={handleSearchChange}
          onFilterPress={() => setShowFilterModal(true)}
          placeholder="Search something..."
        />
      </View>

      {/* Category Tabs */}
      <CategoryTabs
        categories={CATEGORIES}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />

      {/* Active Filters Display */}
      {activeFiltersText && (
        <View style={[styles.header, styles.activeFiltersContainer]}>
          <Text style={styles.activeFiltersText}>
            Active filters: {activeFiltersText}
          </Text>
          {hasActiveFilters && (
            <Text 
              style={styles.clearFiltersButton}
              onPress={handleClearFilters}
            >
              Clear All
            </Text>
          )}
        </View>
      )}

      {/* Products Grid */}
      <View style={styles.productsContainer}>
        {isLoading ? (
          renderLoadingState()
        ) : (
          <FlatList
            data={currentProducts}
            renderItem={renderProductItem}
            keyExtractor={(item) => item._id}
            numColumns={2}
            contentContainerStyle={styles.productsList}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={renderEmptyState}
            ListFooterComponent={renderFooter}
            // Performance optimizations
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            windowSize={10}
            initialNumToRender={8}
            getItemLayout={(data, index) => ({
              length: 200, // Approximate item height
              offset: 200 * index,
              index,
            })}
          />
        )}
      </View>

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