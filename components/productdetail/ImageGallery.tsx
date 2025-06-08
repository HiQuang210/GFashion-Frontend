import React from "react";
import { View, Image, TouchableOpacity, FlatList, Text } from "react-native";
import { styles } from "@/styles/product-detail/imageGallery"

interface ProductImageGalleryProps {
  images: string[];
  activeImageIndex: number;
  onImageChange: (index: number) => void;
}

export default function ProductImageGallery({
  images,
  activeImageIndex,
  onImageChange,
}: ProductImageGalleryProps) {
  const renderThumbnail = ({ item, index }: { item: string; index: number }) => (
    <TouchableOpacity
      style={[
        styles.thumbnailContainer,
        index === activeImageIndex && styles.activeThumbnail
      ]}
      onPress={() => onImageChange(index)}
    >
      <Image
        source={{ uri: item }}
        style={styles.thumbnailImage}
        resizeMode="cover"
      />
      {index === images.length - 1 && images.length > 6 && (
        <View style={styles.moreImagesOverlay}>
          <Text style={styles.moreImagesText}>+{images.length - 5}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View>
      {/* Main Image */}
      <View style={styles.mainImageContainer}>
        <Image
          source={{ uri: images[activeImageIndex] || images[0] }}
          style={styles.mainImage}
          resizeMode="cover"
        />
      </View>

      {/* Thumbnail Images */}
      <View style={styles.thumbnailSection}>
        <FlatList
          data={images.slice(0, 6)}
          renderItem={renderThumbnail}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.thumbnailList}
        />
      </View>
    </View>
  );
}