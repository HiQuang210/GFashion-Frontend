import LikeButton from "@/components/LikeButton";
import PageHeader from "@/components/PageHeader";
import text from "@/styles/text";
import { productDetailStyles } from "@/styles/productDetail";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useLocalSearchParams } from "expo-router";
import { translateColor } from "../../utils/helper";
import {
  ScrollView,
  View,
  Image,
  Text,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useProductDetail } from "@/hooks/useProduct";
import { useState } from "react";
import Carousel from "react-native-reanimated-carousel";
import { Product, ProductSize, ProductVariant } from "@/types/product";

export default function ProductDetail() {
  const { id } = useLocalSearchParams();
  const { width } = Dimensions.get("window");
  
  // Handle the id parameter properly - convert array to string if needed
  const productId = Array.isArray(id) ? id[0] : id;
  
  const { data, isLoading, isError } = useProductDetail(productId);
  const [activeVariantIndex, setActiveVariantIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("S");

  // Loading state
  if (isLoading) {
    return (
      <View style={productDetailStyles.centerContainer}>
        <ActivityIndicator size="large" color="#704F38" />
        <Text style={productDetailStyles.loadingText}>Loading product details...</Text>
      </View>
    );
  }

  // Error state
  if (isError || !data?.data) {
    return (
      <View style={productDetailStyles.centerContainer}>
        <Text style={productDetailStyles.errorText}>Failed to load product details</Text>
        <Text style={productDetailStyles.errorSubtext}>Please try again later</Text>
      </View>
    );
  }

  const product: Product = data.data;
  const currentVariant = product.variants[activeVariantIndex];

  const renderCarouselItem = ({ item }: { item: string }) => (
    <Image
      source={{ uri: item }}
      style={productDetailStyles.carouselImage}
      resizeMode="contain"
    />
  );

  const renderSizeOption = (sizeOption: ProductSize) => (
    <TouchableOpacity
      key={sizeOption.size}
      style={[
        productDetailStyles.sizeButton,
        selectedSize === sizeOption.size && productDetailStyles.sizeButtonActive
      ]}
      onPress={() => setSelectedSize(sizeOption.size)}
      disabled={sizeOption.stock === 0}
    >
      <Text
        style={[
          productDetailStyles.sizeText,
          selectedSize === sizeOption.size && productDetailStyles.sizeTextActive,
          sizeOption.stock === 0 && productDetailStyles.sizeTextDisabled
        ]}
      >
        {sizeOption.size}
      </Text>
    </TouchableOpacity>
  );

  const renderColorOption = (variant: ProductVariant, index: number) => (
    <TouchableOpacity
      key={variant.color}
      style={[
        productDetailStyles.colorButton,
        { backgroundColor: translateColor(variant.color) }
      ]}
      onPress={() => {
        setActiveVariantIndex(index);
        // Reset size selection when changing color
        if (variant.sizes.length > 0) {
          setSelectedSize(variant.sizes[0].size);
        }
      }}
    >
      {index === activeVariantIndex && <View style={productDetailStyles.colorButtonSelected} />}
    </TouchableOpacity>
  );

  return (
    <View style={productDetailStyles.container}>
      <ScrollView style={productDetailStyles.scrollContainer}>
        {/* Header */}
        <View style={productDetailStyles.headerContainer}>
          <PageHeader content={""} />
          <LikeButton />
        </View>

        {/* Image Carousel */}
        <View style={productDetailStyles.imageContainer}>
          <Carousel
            width={width}
            height={400}
            autoPlay={false}
            data={product.images}
            scrollAnimationDuration={500}
            renderItem={renderCarouselItem}
          />
        </View>

        {/* Product Info */}
        <View style={productDetailStyles.contentContainer}>
          <View style={productDetailStyles.productInfoSection}>
            {/* Price and Rating */}
            <View style={productDetailStyles.priceRatingContainer}>
              <Text style={productDetailStyles.priceText}>
                {product.price.toLocaleString("vi-VN")}đ
              </Text>
              <View style={productDetailStyles.ratingContainer}>
                <FontAwesome name="star" size={20} color="#fcaf23" />
                <Text style={[productDetailStyles.ratingText, text.gray_text]}>
                  {product.rating || 0}
                </Text>
              </View>
            </View>

            {/* Product Name */}
            <Text style={productDetailStyles.productName}>{product.name}</Text>

            {/* Product Details */}
            <View style={productDetailStyles.detailsSection}>
              <Text style={productDetailStyles.sectionTitle}>Chi tiết sản phẩm</Text>
              <Text style={productDetailStyles.materialText}>
                Chất liệu: {product.material}
              </Text>
              <Text style={productDetailStyles.descriptionText}>
                {product.description}
              </Text>
            </View>
          </View>

          <View style={productDetailStyles.divider} />

          {/* Size and Color Selection */}
          <View style={productDetailStyles.selectionSection}>
            {/* Size Selection */}
            {currentVariant?.sizes && currentVariant.sizes.length > 0 && (
              <View style={productDetailStyles.sizeSection}>
                <Text style={productDetailStyles.sectionTitle}>Select Size</Text>
                <View style={productDetailStyles.optionsContainer}>
                  {currentVariant.sizes.map(renderSizeOption)}
                </View>
              </View>
            )}

            {/* Color Selection */}
            {product.variants && product.variants.length > 0 && (
              <View style={productDetailStyles.colorSection}>
                <Text style={productDetailStyles.sectionTitle}>Select Color:</Text>
                <View style={productDetailStyles.optionsContainer}>
                  {product.variants.map(renderColorOption)}
                </View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

ProductDetail.options = {
  tabBarStyle: { display: "none" },
  tabBarButton: () => null,
};