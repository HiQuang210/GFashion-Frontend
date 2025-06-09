import React, { useState, useCallback, useRef, useEffect } from "react";
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

const PRODUCTS_PER_PAGE = 8;

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(0);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTER_STATE);

  const { data: productsData, isLoading, refetch } = useQuery({
    queryKey: ["products", searchQuery, selectedCategory, currentPage, filters],
    queryFn: () => {
      const params: any = {
        page: currentPage + 1,
        limitItem: PRODUCTS_PER_PAGE,
        sort: filters.sortBy,
      };
      
      if (searchQuery) params.searchQuery = searchQuery;
      if (selectedCategory !== "all") params.filter = selectedCategory;
      if (filters.selectedProducer) {
        params.filter = filters.selectedProducer;
      }

      return ProductAPI.getAllProducts(params);
    },
  });

  const currentProducts = productsData?.data || [];
  const totalPages = productsData?.totalPage || 1;
  const hasNextPage = currentPage < totalPages - 1;

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
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  }, [totalPages]);

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

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Search Bar */}
      <View style={styles.header}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
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
            data={currentProducts}
            renderItem={renderProductItem}
            keyExtractor={(item) => item._id}
            numColumns={2}
            contentContainerStyle={styles.productsList}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={renderEmptyState}
            ListFooterComponent={renderFooter}
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