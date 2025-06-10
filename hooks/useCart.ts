import { useState, useEffect, useCallback } from "react";
import { Product, ProductVariant } from "@/types/product";
import { CartItemData } from "@/types/user";
import { UserAPI } from "@/api/services/UserService";
import { CartUtils } from "@/utils/cartHelper";
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

  const getAvailableStock = useCallback(() => {
    if (!currentVariant || !selectedSize) return 0;
    
    const selectedSizeData = currentVariant.sizes.find(
      (sizeOption) => sizeOption.size === selectedSize
    );
    return selectedSizeData?.stock || 0;
  }, [currentVariant, selectedSize]);

  const availableStock = getAvailableStock();
  const maxQuantity = availableStock > 0 ? Math.min(availableStock, 99) : 0;

  const fetchCurrentCartQuantity = useCallback(async () => {
    if (!product || !currentVariant || !selectedSize) {
      setCurrentCartQuantity(0);
      return;
    }

    try {
      const response = await UserAPI.getUserCart();
      if (response.status === "OK" && response.data) {
        const cartItems = response.data as CartItemData[];
        const currentQuantity = CartUtils.getCurrentCartQuantity(
          cartItems,
          product._id,
          currentVariant.color,
          selectedSize
        );
        setCurrentCartQuantity(currentQuantity);
      } else {
        setCurrentCartQuantity(0);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCurrentCartQuantity(0);
    }
  }, [product?._id, currentVariant?.color, selectedSize]);

  useEffect(() => {
    fetchCurrentCartQuantity();
  }, [fetchCurrentCartQuantity]);

  const clearMessages = useCallback(() => {
    setErrorMessage(null);
    setWarningMessage(null);
  }, []);

  useEffect(() => {
    if (!product || !currentVariant || !selectedSize || availableStock === 0) {
      return;
    }

    clearMessages();
    
    if (availableStock === 0) {
      setErrorMessage("This item is currently out of stock");
      return;
    }

    const totalQuantity = currentCartQuantity + quantity;
    if (totalQuantity > availableStock) {
      setWarningMessage(`Only ${availableStock} items available. You have ${currentCartQuantity} in cart.`);
    }
  }, [quantity, currentCartQuantity, availableStock, product, currentVariant, selectedSize, clearMessages]);

  const resetQuantity = useCallback(() => {
    setQuantity(1);
    clearMessages();
  }, [clearMessages]);

  const validateStock = useCallback((): boolean => {
    if (!product) {
      setErrorMessage("Product not found");
      return false;
    }

    if (!currentVariant) {
      setErrorMessage("Product variant not found");
      return false;
    }

    if (!selectedSize) {
      setErrorMessage("Please select a size");
      return false;
    }

    const sizeVariant = currentVariant.sizes.find((s) => s.size === selectedSize);
    if (!sizeVariant) {
      setErrorMessage("Size not found in variant");
      return false;
    }

    if (sizeVariant.stock === 0) {
      setErrorMessage("This item is currently out of stock");
      return false;
    }

    if (quantity <= 0) {
      setErrorMessage("Please select a valid quantity");
      return false;
    }

    const totalQuantity = currentCartQuantity + quantity;
    if (totalQuantity > sizeVariant.stock) {
      setErrorMessage(`Only ${sizeVariant.stock} items in stock. You have ${currentCartQuantity} in cart.`);
      return false;
    }

    return true;
  }, [product, currentVariant, selectedSize, quantity, currentCartQuantity]);

  const incrementQuantity = useCallback(() => {
    if (availableStock === 0) {
      setErrorMessage("This item is currently out of stock");
      return;
    }

    const newQuantity = quantity + 1;
    const totalQuantity = currentCartQuantity + newQuantity;
    

    if (newQuantity <= maxQuantity && totalQuantity <= availableStock) {
      setQuantity(newQuantity);
      if (errorMessage && totalQuantity <= availableStock) {
        clearMessages();
      }
    } else {
      const availableToAdd = availableStock - currentCartQuantity;
      setErrorMessage(`Maximum ${availableToAdd} more items can be added`);
    }
  }, [quantity, maxQuantity, availableStock, currentCartQuantity, errorMessage, clearMessages]);

  const decrementQuantity = useCallback(() => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
      clearMessages();
    }
  }, [quantity, clearMessages]);

  const addToCart = useCallback(async (): Promise<boolean> => {
    if (!validateStock()) {
      return false;
    }

    setIsLoading(true);
    
    try {
      const response = await CartUtils.addToCart(
        product._id,
        currentVariant.color,
        selectedSize,
        quantity
      );
      
      if (response.status === "OK") {
        showSuccessToast(
          "Added to Cart",
          `${quantity} item(s) added successfully!`
        );
        setCurrentCartQuantity(prev => prev + quantity);
        setQuantity(1);
        clearMessages();
        return true;
      } else {
        const message = response.message || "Failed to add item to cart";
        setErrorMessage(message);
        showErrorToast("Error", message);
        return false;
      }
    } catch (error: any) {
      console.error("Add to cart error:", error);
      
      const errorMessage = CartUtils.getErrorMessage(error, "Failed to add item to cart. Please try again.");
      
      setErrorMessage(errorMessage);
      showErrorToast("Error", errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [validateStock, product._id, currentVariant.color, selectedSize, quantity, showSuccessToast, showErrorToast, clearMessages]);

  const getTotalPrice = useCallback((): number => {
    return product?.price ? product.price * quantity : 0;
  }, [product?.price, quantity]);

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