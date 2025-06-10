import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Product, ProductSize, ProductVariant } from "@/types/product";
import { styles } from "@/styles/product-detail/selection";
import { getColorFromString } from "@/types/enum/color";

interface ProductSelectionsProps {
  product: Product;
  currentVariant: ProductVariant;
  activeVariantIndex: number;
  selectedSize: string;
  onVariantChange: (index: number) => void;
  onSizeChange: (size: string) => void;
}

export default function ProductSelections({
  product,
  currentVariant,
  activeVariantIndex,
  selectedSize,
  onVariantChange,
  onSizeChange,
}: ProductSelectionsProps) {
  
  const renderSizeOption = (sizeOption: ProductSize) => (
    <View key={sizeOption.size} style={styles.sizeOptionContainer}>
      <TouchableOpacity
        style={[
          styles.sizeButton,
          selectedSize === sizeOption.size && styles.sizeButtonActive,
          sizeOption.stock === 0 && styles.sizeButtonDisabled
        ]}
        onPress={() => onSizeChange(sizeOption.size)}
        disabled={sizeOption.stock === 0}
      >
        <Text
          style={[
            styles.sizeText,
            selectedSize === sizeOption.size && styles.sizeTextActive,
            sizeOption.stock === 0 && styles.sizeTextDisabled
          ]}
        >
          {sizeOption.size}
        </Text>
      </TouchableOpacity>
      <Text style={[
        styles.stockText,
        sizeOption.stock === 0 && styles.stockTextEmpty
      ]}>
        {sizeOption.stock > 0 ? `${sizeOption.stock} left` : 'Out of stock'}
      </Text>
    </View>
  );

  const renderColorOption = (variant: ProductVariant, index: number) => {
    const totalStock = variant.sizes.reduce((total, size) => total + size.stock, 0);
    
    return (
      <View key={variant.color} style={styles.colorOptionContainer}>
        <TouchableOpacity
          style={[
            styles.colorButton,
            { backgroundColor: getColorFromString(variant.color) },
            index === activeVariantIndex && styles.colorButtonSelected,
            totalStock === 0 && styles.colorButtonDisabled
          ]}
          onPress={() => onVariantChange(index)}
          disabled={totalStock === 0}
        >
          {variant.color.toLowerCase() === 'white' && (
            <View style={styles.whiteBorder} />
          )}
          {totalStock === 0 && <View style={styles.soldOutOverlay} />}
        </TouchableOpacity>
        <Text style={styles.colorLabel}>{variant.color}</Text>
        <Text style={[
          styles.stockText,
          totalStock === 0 && styles.stockTextEmpty
        ]}>
          {totalStock > 0 ? `${totalStock} available` : 'Sold out'}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Color Selection */}
      {product.variants && product.variants.length > 0 && (
        <View style={styles.selectionSection}>
          <Text style={styles.sectionTitle}>
            Select Color: <Text style={styles.selectedColorText}>{product.variants[activeVariantIndex].color}</Text>
          </Text>
          <View style={styles.colorContainer}>
            {product.variants.map(renderColorOption)}
          </View>
        </View>
      )}

      {/* Size Selection */}
      {currentVariant?.sizes && currentVariant.sizes.length > 0 && (
        <View style={styles.selectionSection}>
          <Text style={styles.sectionTitle}>
            Select Size: <Text style={styles.selectedSizeText}>{selectedSize}</Text>
          </Text>
          <View style={styles.sizeContainer}>
            {currentVariant.sizes.map(renderSizeOption)}
          </View>
        </View>
      )}
    </View>
  );
}