import React, { useState, useMemo, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useFocusEffect } from '@react-navigation/native';
import SearchBar from '@/components/SearchBar';
import ProductItem from '@/components/ProductItem';
import Pagination from '@/components/Pagination';
import { useFavorites } from '@/hooks/useFavorite';
import { useWishlistRealtime } from '@/hooks/useWishlist';
import { useAuth } from '@/hooks/useAuth';
import { getUserFavoriteProducts } from '@/api/services/UserService';
import { Product } from '@/types/product';
import text from '@/styles/text';
import { styles } from '@/styles/wishlist';

const ITEMS_PER_PAGE = 8;

export default function WishlistPage() {
  const { userInfo } = useAuth();
  const queryClient = useQueryClient();
  const { favorites } = useFavorites(); // Get current favorites list
  const { refreshWishlist } = useWishlistRealtime(); // Real-time updates
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);

  // Fetch favorite products details using the existing GET endpoint
  const { data: favoriteProducts = [], isLoading, refetch } = useQuery({
    queryKey: ['favoriteProducts', userInfo?._id],
    queryFn: async () => {
      if (!userInfo?._id) return [];
      
      const response = await getUserFavoriteProducts();
      console.log('Favorite products response:', response.data); // Debug log
      return response.data || [];
    },
    enabled: !!userInfo?._id,
    staleTime: 1000 * 60 * 5,
  });

  // Refetch when favorites change or when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      if (userInfo?._id) {
        refetch();
      }
    }, [userInfo?._id, refetch])
  );

  // Auto-refetch when favorites array changes
  useEffect(() => {
    if (userInfo?._id && favorites.length !== favoriteProducts.length) {
      refetch();
    }
  }, [favorites, favoriteProducts.length, userInfo?._id, refetch]);

  // Filter favoriteProducts to only show items that are still in favorites
  // This provides immediate UI update while waiting for refetch
  const syncedFavoriteProducts = useMemo(() => {
    return favoriteProducts.filter((product: Product) => 
      favorites.includes(product._id)
    );
  }, [favoriteProducts, favorites]);

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return syncedFavoriteProducts;
    
    return syncedFavoriteProducts.filter((product: Product) =>
      product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [syncedFavoriteProducts, searchQuery]);

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const startIndex = currentPage * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  // Reset page when search changes
  React.useEffect(() => {
    setCurrentPage(0);
  }, [searchQuery]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle when a product is removed from favorites
  const handleFavoriteChange = (productId: string, isFavorite: boolean) => {
    // The useFavorites hook will handle the optimistic update
    // We just need to invalidate queries to ensure data consistency
    queryClient.invalidateQueries({ queryKey: ['favoriteProducts', userInfo?._id] });
    queryClient.invalidateQueries({ queryKey: ['userFavorites', userInfo?._id] });
    
    // Optionally refetch immediately for real-time update
    setTimeout(() => {
      refetch();
    }, 500); // Small delay to allow backend to process
  };

  const renderProductItem = ({ item }: { item: Product }) => (
    <View style={styles.productItemContainer}>
      <ProductItem 
        data={item} 
        onFavoriteChange={handleFavoriteChange}
      />
    </View>
  );

  const renderEmptyState = () => {
    if (searchQuery && filteredProducts.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No products found matching "{searchQuery}"
          </Text>
        </View>
      );
    }

    if (favoriteProducts.length === 0 && syncedFavoriteProducts.length === 0 && !isLoading) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Your wishlist is empty.{'\n'}Start adding products you love!
          </Text>
        </View>
      );
    }

    return null;
  };

  const renderLoadingState = () => (
    <View style={styles.emptyContainer}>
      <ActivityIndicator size="large" color="#704F38" />
      <Text style={styles.loadingText}>Loading your wishlist...</Text>
    </View>
  );

  const renderFooter = () => {
    if (totalPages > 1) {
      return (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          hasNextPage={currentPage < totalPages - 1}
        />
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[text.base_text, styles.title]}>My Wishlist</Text>
        <View>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search in wishlist..."
          />
        </View>
      </View>

      {/* Products Container */}
      <View style={styles.productsContainer}>
        {isLoading ? (
          renderLoadingState()
        ) : (
          <FlatList
            data={paginatedProducts}
            renderItem={renderProductItem}
            keyExtractor={(item) => item._id}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'space-between' }} 
            contentContainerStyle={styles.productsList}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={renderEmptyState}
            ListFooterComponent={renderFooter}
          />
        )}
      </View>
    </SafeAreaView>
  );
}