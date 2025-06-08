import React, { useState } from "react";
import { View, Text, TouchableOpacity, LayoutChangeEvent } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Product } from "@/types/product";
import { styles } from "@/styles/product-detail/info";

interface ProductInfoProps {
  product: Product;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const [textShown, setTextShown] = useState(false); // true = show full text
  const [showMoreButton, setShowMoreButton] = useState(false); // true = show "Read more"
  const [lineCount, setLineCount] = useState(0);

  const toggleNumberOfLines = () => {
    setTextShown(!textShown);
  };

  const onTextLayout = (e: any) => {
    if (e.nativeEvent.lines.length > 2 && !showMoreButton) {
      setShowMoreButton(true);
      setLineCount(e.nativeEvent.lines.length);
    }
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

        <Text
          style={styles.descriptionText}
          numberOfLines={textShown ? undefined : 2}
          onTextLayout={onTextLayout}
        >
          Description: {product.description}
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
