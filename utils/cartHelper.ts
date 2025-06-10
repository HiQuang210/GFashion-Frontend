import { CartItemData, CartValidationResult, ApiResponse } from '@/types/user';
import { UserAPI, HandleCartData } from '@/api/services/UserService';

export class CartUtils {
  static calculateTotalPrice(cartItems: CartItemData[]): number {
    return cartItems.reduce((total: number, item: CartItemData) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  }

  static calculateTotalItems(cartItems: CartItemData[]): number {
    return cartItems.reduce((total: number, item: CartItemData) => {
      return total + item.quantity;
    }, 0);
  }

  static calculateUniqueItemCount(cartItems: CartItemData[]): number {
    return cartItems.length;
  }

  static findCartItem(
    cartItems: CartItemData[], 
    productId: string, 
    color: string, 
    size: string
  ): CartItemData | undefined {
    return cartItems.find(
      (item: CartItemData) =>
        item.product._id === productId &&
        item.color === color &&
        item.size === size
    );
  }

  static getCurrentCartQuantity(
    cartItems: CartItemData[],
    productId: string,
    color: string,
    size: string
  ): number {
    const existingItem = CartUtils.findCartItem(cartItems, productId, color, size);
    return existingItem ? existingItem.quantity : 0;
  }

  static validateCartItem(item: CartItemData): CartValidationResult {
    if (!item) {
      return {
        isValid: false,
        errorMessage: 'Cart item data is missing'
      };
    }

    if (!item.product) {
      return {
        isValid: false,
        errorMessage: 'Product data is missing'
      };
    }

    if (!item.product._id || !item.product.name || item.product.price === undefined) {
      return {
        isValid: false,
        errorMessage: 'Invalid product data'
      };
    }

    if (!item.color || !item.size) {
      return {
        isValid: false,
        errorMessage: 'Product variant information is missing'
      };
    }

    if (item.quantity <= 0) {
      return {
        isValid: false,
        errorMessage: 'Invalid quantity'
      };
    }

    return { isValid: true };
  }

  static validateCart(cartItems: CartItemData[]): CartValidationResult {
    if (!Array.isArray(cartItems)) {
      return {
        isValid: false,
        errorMessage: 'Invalid cart data'
      };
    }

    if (cartItems.length === 0) {
      return {
        isValid: true,
        warningMessage: 'Cart is empty'
      };
    }

    for (const item of cartItems) {
      const validation = CartUtils.validateCartItem(item);
      if (!validation.isValid) {
        return validation;
      }
    }

    return { isValid: true };
  }

  static async updateCartItemQuantity(
    productId: string,
    color: string,
    size: string,
    newQuantity: number
  ): Promise<ApiResponse> {
    try {
      const cartData: HandleCartData = {
        action: 'update',
        productId,
        color,
        size,
        quantity: newQuantity,
      };

      return await UserAPI.handleCart(cartData);
    } catch (error: any) {
      console.error('Update cart error:', error);
      throw error;
    }
  }

  static async removeCartItem(
    productId: string,
    color: string,
    size: string
  ): Promise<ApiResponse> {
    try {
      const cartData: HandleCartData = {
        action: 'remove',
        productId,
        color,
        size,
        quantity: 0, 
      };

      return await UserAPI.handleCart(cartData);
    } catch (error: any) {
      console.error('Remove cart item error:', error);
      throw error;
    }
  }

  static async addToCart(
    productId: string,
    color: string,
    size: string,
    quantity: number
  ): Promise<ApiResponse> {
    try {
      const cartData: HandleCartData = {
        action: 'add',
        productId,
        color,
        size,
        quantity,
      };

      return await UserAPI.handleCart(cartData);
    } catch (error: any) {
      console.error('Add to cart error:', error);
      throw error;
    }
  }

  static async performCartOperation(
    operation: 'add' | 'update' | 'remove',
    productId: string,
    color: string,
    size: string,
    quantity: number,
    onSuccess?: () => Promise<void>
  ): Promise<ApiResponse> {
    try {
      let response: ApiResponse;
      
      switch (operation) {
        case 'add':
          response = await CartUtils.addToCart(productId, color, size, quantity);
          break;
        case 'update':
          response = await CartUtils.updateCartItemQuantity(productId, color, size, quantity);
          break;
        case 'remove':
          response = await CartUtils.removeCartItem(productId, color, size);
          break;
        default:
          throw new Error('Invalid cart operation');
      }

      if (response.status === 'OK' && onSuccess) {
        await onSuccess();
      }

      return response;
    } catch (error: any) {
      console.error(`Cart ${operation} operation error:`, error);
      throw error;
    }
  }

  static formatPrice(price: number): string {
    return `${price.toLocaleString('vi-VN')}đ`;
  }

  static getErrorMessage(error: any, defaultMessage: string = 'An error occurred'): string {
    if (error.response?.data?.message) {
      return error.response.data.message;
    } else if (error.response?.status === 400) {
      return 'Invalid request. Please check your selection.';
    } else if (error.response?.status === 401) {
      return 'Please login to continue.';
    } else if (error.response?.status === 404) {
      return 'Product or variant not found.';
    } else if (error.message) {
      return error.message;
    }
    return defaultMessage;
  }

  static getOptimisticCartUpdate(
    cartItems: CartItemData[],
    itemId: string,
    updateType: 'quantity' | 'remove',
    newQuantity?: number
  ): CartItemData[] {
    if (updateType === 'remove') {
      return cartItems.filter(item => item._id !== itemId);
    }

    if (updateType === 'quantity' && newQuantity !== undefined) {
      return cartItems.map(item => 
        item._id === itemId 
          ? { ...item, quantity: newQuantity }
          : item
      );
    }

    return cartItems;
  }

  static hasItems(cartItems: CartItemData[]): boolean {
    return Array.isArray(cartItems) && cartItems.length > 0;
  }

  static getCartSummary(cartItems: CartItemData[]) {
    const totalItems = CartUtils.calculateTotalItems(cartItems);
    const totalPrice = CartUtils.calculateTotalPrice(cartItems);
    const itemCount = cartItems.length;
    const uniqueItemCount = CartUtils.calculateUniqueItemCount(cartItems);

    return {
      itemCount,
      uniqueItemCount, 
      totalItems,
      totalPrice,
      formattedPrice: CartUtils.formatPrice(totalPrice),
      isEmpty: !CartUtils.hasItems(cartItems)
    };
  }
}