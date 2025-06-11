import React, { useState } from "react";
import { View, ScrollView, ActivityIndicator, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import Toast from "react-native-toast-message";
import { useProductDetail } from "@/hooks/useProduct";
import { Product } from "@/types/product";
import ProductHeader from "@/components/productdetail/Header";
import ProductImageGallery from "@/components/productdetail/ImageGallery";
import ProductInfo from "@/components/productdetail/Info";
import ProductSelections from "@/components/productdetail/Selection";
import ProductBottomBar from "@/components/productdetail/BottomBar";
import { styles } from "@/styles/product-detail";

export default function ProductDetail() {
  const { id } = useLocalSearchParams();
  
  const productId = Array.isArray(id) ? id[0] : id;
  
  const { data, isLoading, isError } = useProductDetail(productId);
  const [activeVariantIndex, setActiveVariantIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#704F38" />
        <Text style={styles.loadingText}>Loading product details...</Text>
      </View>
    );
  }

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
    // Set first available size or first size if none available
    if (product.variants[index].sizes.length > 0) {
      const availableSize = product.variants[index].sizes.find(size => size.stock > 0);
      setSelectedSize(availableSize?.size || product.variants[index].sizes[0].size);
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

  const handleCartUpdate = () => {
    console.log("Cart updated successfully");
    // Show success toast when item is added to cart
    Toast.show({
      type: 'success',
      text1: 'Added to Cart',
      text2: 'Item has been successfully added to your cart',
      position: 'top',
      visibilityTime: 3000,
      autoHide: true,
      topOffset: 60,
    });
  };

  const handleCartError = (errorMessage: string) => {
    // Show error toast when adding to cart fails
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: errorMessage || 'Failed to add item to cart',
      position: 'top',
      visibilityTime: 4000,
      autoHide: true,
      topOffset: 60,
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <ProductHeader 
        productId={product._id}
      />

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
        selectedSizeStock={getSelectedSizeStock()}
        product={product}
        currentVariant={currentVariant}
        selectedSize={selectedSize}
        onCartUpdate={handleCartUpdate}
        onCartError={handleCartError}
      />
      <Toast />
    </View>
  );
}

ProductDetail.options = {
  tabBarStyle: { display: "none" },
  tabBarButton: () => null,
};