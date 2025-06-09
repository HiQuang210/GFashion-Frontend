import React, { useState, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, LayoutChangeEvent } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Product } from "@/types/product";
import { styles } from "@/styles/product-detail/info";
import { Text as RNText } from "react-native";

interface ProductInfoProps {
  product: Product;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const [textShown, setTextShown] = useState(false);
  const [showMoreButton, setShowMoreButton] = useState(false);
  const textRef = useRef<RNText>(null);
  const [fullHeight, setFullHeight] = useState(0);
  const [shortHeight, setShortHeight] = useState(0);

  useEffect(() => {
    if (fullHeight > shortHeight && shortHeight !== 0) {
      setShowMoreButton(true);
    }
  }, [fullHeight, shortHeight]);

  const toggleNumberOfLines = () => {
    setTextShown(!textShown);
  };

  return (
    <View style={styles.productInfo}>
      {/* Type + Rating */}
      <View style={styles.typeAndRatingRow}>
        <Text style={styles.productType}>{product.type}</Text>
        <View style={styles.ratingContainer}>
          <FontAwesome name="star" size={20} color="#FFD700" />
          <Text style={styles.ratingText}>{product.rating}/5</Text>
        </View>
      </View>

      {/* Product Name + Sold */}
      <View style={styles.nameAndSoldRow}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.soldText}>{product.sold} sold</Text>
      </View>

      {/* Producer */}
      <Text style={styles.producerText}>by {product.producer}</Text>

      {/* Product Details */}
      <View style={styles.detailsSection}>
        <Text style={styles.sectionTitle}>Product Details</Text>
        <Text style={styles.materialText}>Material: {product.material}</Text>

        <Text style={styles.descriptionLabel}>Description:</Text>

        {/* Hidden full text for height measurement */}
        <Text
          style={[styles.descriptionText, { position: "absolute", opacity: 0, zIndex: -1 }]}
          onLayout={(e) => setFullHeight(e.nativeEvent.layout.height)}
        >
          {product.description}
        </Text>

        {/* Shown text with optional numberOfLines */}
        <Text
          style={styles.descriptionText}
          numberOfLines={textShown ? undefined : 2}
          ref={textRef}
          onLayout={(e) => setShortHeight(e.nativeEvent.layout.height)}
        >
          {product.description}
        </Text>

        {showMoreButton && (
          <TouchableOpacity onPress={toggleNumberOfLines}>
            <Text style={styles.readMoreText}>
              {textShown ? "Show less" : "Read more"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
