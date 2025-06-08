import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Product, ProductSize, ProductVariant } from "@/types/product";
import { styles } from "@/styles/product-detail/selection"

interface ProductSelectionsProps {
  product: Product;
  currentVariant: ProductVariant;
  activeVariantIndex: number;
  selectedSize: string;
  onVariantChange: (index: number) => void;
  onSizeChange: (size: string) => void;
}

// Color mapping function
const getColorFromString = (colorName: string): string => {
  const colorMap: { [key: string]: string } = {
    'red': '#FF0000',
    'blue': '#0000FF',
    'green': '#008000',
    'yellow': '#FFFF00',
    'orange': '#FFA500',
    'purple': '#800080',
    'pink': '#FFC0CB',
    'brown': '#A52A2A',
    'black': '#000000',
    'white': '#FFFFFF',
    'gray': '#808080',
    'grey': '#808080',
    'navy': '#000080',
    'maroon': '#800000',
    'olive': '#808000',
    'lime': '#00FF00',
    'aqua': '#00FFFF',
    'teal': '#008080',
    'silver': '#C0C0C0',
    'gold': '#FFD700',
    'beige': '#F5F5DC',
    'tan': '#D2B48C',
    'khaki': '#F0E68C',
    'coral': '#FF7F50',
    'salmon': '#FA8072',
    'crimson': '#DC143C',
    'magenta': '#FF00FF',
    'violet': '#EE82EE',
    'indigo': '#4B0082',
    'turquoise': '#40E0D0',
    'cyan': '#00FFFF',
    'mint': '#98FB98',
    'lavender': '#E6E6FA',
    'plum': '#DDA0DD',
    'ivory': '#FFFFF0',
    'pearl': '#F8F8FF',
    'cream': '#F5F5DC',
    'wheat': '#F5DEB3',
    'linen': '#FAF0E6',
    'snow': '#FFFAFA',
    'chocolate': '#D2691E',
    'sienna': '#A0522D',
    'saddle': '#8B4513',
    'rust': '#B7410E',
    'copper': '#B87333',
    'bronze': '#CD7F32',
    'brass': '#B5A642',
    'lightbrown': '#CD853F',
    'darkbrown': '#654321',
  };
  
  const normalizedColor = colorName.toLowerCase().replace(/\s+/g, '');
  return colorMap[normalizedColor] || '#704F38'; // Default to brown if color not found
};

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