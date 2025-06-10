import { useState, useEffect, useCallback } from "react";
import { Product, ProductVariant } from "@/types/product";
import { UserAPI, HandleCartData } from "@/api/services/UserService";
import { useToast } from "@/hooks/useToast";

interface UseCartParams {
  product: Product;
  currentVariant: ProductVariant;
  selectedSize: string;
}

interface UseCartReturn {
  quantity: number;
  isLoading: boolean;
  availableStock: number;
  maxQuantity: number;
  currentCartQuantity: number;
  errorMessage: string | null;
  warningMessage: string | null;
  setQuantity: (quantity: number) => void;
  incrementQuantity: () => void;
  decrementQuantity: () => void;
  resetQuantity: () => void;
  validateStock: () => boolean;
  addToCart: () => Promise<boolean>;
  getTotalPrice: () => number;
  isValidSelection: () => boolean;
  clearMessages: () => void;
}

export function useCart({ product, currentVariant, selectedSize }: UseCartParams): UseCartReturn {
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCartQuantity, setCurrentCartQuantity] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const { showSuccessToast, showErrorToast } = useToast();

  // Get available stock for selected size
  const getAvailableStock = useCallback(() => {
    if (!currentVariant || !selectedSize) return 0;
    
    const selectedSizeData = currentVariant.sizes.find(
      (sizeOption) => sizeOption.size === selectedSize
    );
    return selectedSizeData?.stock || 0;
  }, [currentVariant, selectedSize]);

  const availableStock = getAvailableStock();
  
  // Calculate max quantity - ensure it's at least 1 if stock is available
  const maxQuantity = availableStock > 0 ? Math.min(availableStock, 99) : 0;

  // Fetch current cart quantity for this specific product/variant/size
  const fetchCurrentCartQuantity = useCallback(async () => {
    if (!product || !currentVariant || !selectedSize) {
      setCurrentCartQuantity(0);
      return;
    }

    try {
      const response = await UserAPI.getUserCart();
      if (response.status === "OK" && response.data) {
        const existingItem = response.data.find(
          (item: any) =>
            item.product._id === product._id &&
            item.color === currentVariant.color &&
            item.size === selectedSize
        );
        setCurrentCartQuantity(existingItem ? existingItem.quantity : 0);
      } else {
        setCurrentCartQuantity(0);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCurrentCartQuantity(0);
    }
  }, [product?._id, currentVariant?.color, selectedSize]);

  // Fetch cart quantity when component mounts or key params change
  useEffect(() => {
    fetchCurrentCartQuantity();
  }, [fetchCurrentCartQuantity]);

  // Clear error and warning messages
  const clearMessages = useCallback(() => {
    setErrorMessage(null);
    setWarningMessage(null);
  }, []);

  // Check for quantity conflicts and show warnings
  useEffect(() => {
    // Don't show messages if we don't have valid data yet
    if (!product || !currentVariant || !selectedSize || availableStock === 0) {
      return;
    }

    clearMessages();
    
    if (availableStock === 0) {
      setErrorMessage("This item is currently out of stock");
    }
  }, [quantity, currentCartQuantity, availableStock, product, currentVariant, selectedSize, clearMessages]);

  // Reset quantity to 1
  const resetQuantity = useCallback(() => {
    setQuantity(1);
    clearMessages();
  }, [clearMessages]);

  // Frontend stock validation
  const validateStock = useCallback((): boolean => {
    // Check if product exists
    if (!product) {
      setErrorMessage("Product not found");
      return false;
    }

    // Check if variant exists
    if (!currentVariant) {
      setErrorMessage("Product variant not found");
      return false;
    }

    // Check if size is selected
    if (!selectedSize) {
      setErrorMessage("Please select a size");
      return false;
    }

    // Check if size exists in variant
    const sizeVariant = currentVariant.sizes.find((s) => s.size === selectedSize);
    if (!sizeVariant) {
      setErrorMessage("Size not found in variant");
      return false;
    }

    // Check if stock is available at all
    if (sizeVariant.stock === 0) {
      setErrorMessage("This item is currently out of stock");
      return false;
    }

    // Check if quantity is valid
    if (quantity <= 0) {
      setErrorMessage("Please select a valid quantity");
      return false;
    }

    // Check combined quantity (current cart + new quantity)
    const totalQuantity = currentCartQuantity + quantity;
    if (totalQuantity > sizeVariant.stock) {
      setErrorMessage(`Only ${sizeVariant.stock} items in stock`);
      return false;
    }

    return true;
  }, [product, currentVariant, selectedSize, quantity, currentCartQuantity]);

  // Increment quantity with stock validation
  const incrementQuantity = useCallback(() => {
    if (availableStock === 0) {
      setErrorMessage("This item is currently out of stock");
      return;
    }

    const newQuantity = quantity + 1;
    const totalQuantity = currentCartQuantity + newQuantity;
    
    // Check if we can increment
    if (newQuantity <= maxQuantity && totalQuantity <= availableStock) {
      setQuantity(newQuantity);
      // Clear error messages when successfully incrementing
      if (errorMessage && totalQuantity <= availableStock) {
        clearMessages();
      }
    } else {
      setErrorMessage(`Maximum quantity available: ${maxQuantity}`);
    }
  }, [quantity, maxQuantity, availableStock, currentCartQuantity, errorMessage, clearMessages]);

  // Decrement quantity
  const decrementQuantity = useCallback(() => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
      // Clear messages when reducing quantity as it might resolve conflicts
      clearMessages();
    }
  }, [quantity, clearMessages]);

  // Add item to cart
  const addToCart = useCallback(async (): Promise<boolean> => {
    // Pre-validate before API call
    if (!validateStock()) {
      return false;
    }

    setIsLoading(true);
    
    try {
      const cartData: HandleCartData = {
        action: "add",
        productId: product._id,
        color: currentVariant.color,
        size: selectedSize,
        quantity: quantity,
      };

      const response = await UserAPI.handleCart(cartData);
      
      // Check if the response indicates success
      if (response.status === "OK") {
        showSuccessToast(
          "Added to Cart",
          `${quantity} item(s) added successfully!`
        );
        // Update current cart quantity after successful addition
        setCurrentCartQuantity(prev => prev + quantity);
        // Reset quantity to 1 for next addition
        setQuantity(1);
        clearMessages();
        return true;
      } else {
        // Handle backend error response
        const message = response.message || "Failed to add item to cart";
        setErrorMessage(message);
        showErrorToast("Error", message);
        return false;
      }
    } catch (error: any) {
      console.error("Add to cart error:", error);
      
      let errorMessage = "Failed to add item to cart. Please try again.";
      
      // Handle specific backend error messages
      if (error.response?.data?.message) {
        const backendMessage = error.response.data.message;
        errorMessage = backendMessage;
      } else if (error.response?.status === 400) {
        errorMessage = "Invalid request. Please check your selection.";
      } else if (error.response?.status === 401) {
        errorMessage = "Please login to add items to cart.";
      } else if (error.response?.status === 404) {
        errorMessage = "Product or variant not found.";
      }
      
      setErrorMessage(errorMessage);
      showErrorToast("Error", errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [validateStock, product._id, currentVariant.color, selectedSize, quantity, showSuccessToast, showErrorToast, clearMessages]);

  // Calculate total price
  const getTotalPrice = useCallback((): number => {
    return product?.price ? product.price * quantity : 0;
  }, [product?.price, quantity]);

  // Additional validation for render
  const isValidSelection = useCallback((): boolean => {
    const hasValidData = !!(product && currentVariant && selectedSize && availableStock > 0);
    const hasNoErrors = !errorMessage;
    const hasValidQuantity = quantity > 0 && quantity <= maxQuantity;
    const totalQuantity = currentCartQuantity + quantity;
    const withinStockLimit = totalQuantity <= availableStock;
    
    return hasValidData && hasNoErrors && hasValidQuantity && withinStockLimit;
  }, [product, currentVariant, selectedSize, availableStock, errorMessage, quantity, maxQuantity, currentCartQuantity]);

  return {
    quantity,
    isLoading,
    availableStock,
    maxQuantity,
    currentCartQuantity,
    errorMessage,
    warningMessage,
    setQuantity,
    incrementQuantity,
    decrementQuantity,
    resetQuantity,
    validateStock,
    addToCart,
    getTotalPrice,
    isValidSelection,
    clearMessages,
  };
}