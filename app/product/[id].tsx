import React, { useState } from "react";
import { View, ScrollView, ActivityIndicator, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

import { useProductDetail } from "@/hooks/useProduct";
import { Product } from "@/types/product";

import ProductHeader from "@/components/productdetail/Header";
import ProductImageGallery from "@/components/productdetail/ImageGallery";
import ProductInfo from "@/components/productdetail/Info";
import ProductSelections from "@/components/productdetail/Selection";
import ProductBottomBar from "@/components/productdetail/BottomBar";
import { styles } from "@/styles/productDetail";

export default function ProductDetail() {
  const { id } = useLocalSearchParams();
  
  // Handle the id parameter properly - convert array to string if needed
  const productId = Array.isArray(id) ? id[0] : id;
  
  const { data, isLoading, isError } = useProductDetail(productId);
  const [activeVariantIndex, setActiveVariantIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("S");
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#704F38" />
        <Text style={styles.loadingText}>Loading product details...</Text>
      </View>
    );
  }

  // Error state
  if (isError || !data?.data) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Failed to load product details</Text>
        <Text style={styles.errorSubtext}>Please try again later</Text>
      </View>
    );
  }

  const product: Product = data.data;
  const currentVariant = product.variants[activeVariantIndex];

  const handleVariantChange = (index: number) => {
    setActiveVariantIndex(index);
    // Reset size selection when changing color variant
    if (product.variants[index].sizes.length > 0) {
      setSelectedSize(product.variants[index].sizes[0].size);
    }
  };

  const getCurrentPrice = () => {
    return product.price;
  };

  const getSelectedSizeStock = () => {
    const selectedSizeData = currentVariant?.sizes.find(
      (sizeOption) => sizeOption.size === selectedSize
    );
    return selectedSizeData?.stock || 0;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <ProductHeader />

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Image Gallery */}
        <ProductImageGallery
          images={product.images}
          activeImageIndex={activeImageIndex}
          onImageChange={setActiveImageIndex}
        />

        {/* Product Info */}
        <ProductInfo
          product={product}
        />

        {/* Product Selections */}
        <ProductSelections
          product={product}
          currentVariant={currentVariant}
          activeVariantIndex={activeVariantIndex}
          selectedSize={selectedSize}
          onVariantChange={handleVariantChange}
          onSizeChange={setSelectedSize}
        />
      </ScrollView>

      {/* Bottom Bar */}
      <ProductBottomBar
        price={getCurrentPrice()}
        stock={getSelectedSizeStock()}
      />
    </View>
  );
}

ProductDetail.options = {
  tabBarStyle: { display: "none" },
  tabBarButton: () => null,
};