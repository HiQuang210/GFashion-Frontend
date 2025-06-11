import axiosClient from "@/api/axiosClient";
import {
  CreateOrderData,
  OrderResponse,
  OrdersResponse,
  CancelOrderResponse,
  OrderFilters,
  Order,
} from "@/types/order";

const buildQueryParams = (params: Record<string, any>): string => {
  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      queryParams.append(key, value.toString());
    }
  });

  return queryParams.toString();
};

const handleApiCall = async <T>(
  operation: string,
  apiCall: () => Promise<{ data: T }>
): Promise<T> => {
  try {
    const response = await apiCall();
    return response.data;
  } catch (error: any) {
    // console.error(`${operation} error:`, error.response?.data || error.message);
    throw error;
  }
};

export class OrderAPI {
  /**
   * Create a new order
   */
  static async createOrder(orderData: CreateOrderData): Promise<OrderResponse> {
    return handleApiCall("Create order", () =>
      axiosClient.post("order/create", orderData)
    );
  }

  /**
   * Cancel an order by ID
   */
  static async cancelOrder(orderId: string): Promise<CancelOrderResponse> {
    return handleApiCall("Cancel order", () =>
      axiosClient.put(`order/cancel/${orderId}`)
    );
  }

  /**
   * Get all orders for the authenticated user
   */
  static async getAllOrders(filters?: OrderFilters): Promise<OrdersResponse> {
    const queryString = filters ? `?${buildQueryParams(filters)}` : "";
    
    return handleApiCall("Get all orders", () =>
      axiosClient.get(`order/get-all${queryString}`)
    );
  }

  /**
   * Get order details by ID
   */
  static async getOrderDetail(orderId: string): Promise<OrderResponse> {
    return handleApiCall("Get order detail", () =>
      axiosClient.get(`order/get-detail/${orderId}`)
    );
  }

  /**
   * Get orders by status
   */
  static async getOrdersByStatus(
    status: string,
    page?: number,
    limit?: number
  ): Promise<OrdersResponse> {
    const filters: OrderFilters = { status };
    if (page) filters.page = page;
    if (limit) filters.limit = limit;

    return this.getAllOrders(filters);
  }

  /**
   * Get pending orders
   */
  static async getPendingOrders(): Promise<OrdersResponse> {
    return this.getOrdersByStatus("pending");
  }

  /**
   * Get completed orders
   */
  static async getCompletedOrders(): Promise<OrdersResponse> {
    return this.getOrdersByStatus("completed");
  }

  /**
   * Get cancelled orders
   */
  static async getCancelledOrders(): Promise<OrdersResponse> {
    return this.getOrdersByStatus("cancelled");
  }

  /**
   * Check if order can be cancelled
   */
  static canCancelOrder(order: Order): boolean {
    return order.status === "pending";
  }

  /**
   * Calculate order total
   */
  static calculateOrderTotal(order: Order): number {
    return order.products.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    );
  }

  /**
   * Get order status display text
   */
  static getOrderStatusText(status: string): string {
    const statusMap: Record<string, string> = {
      pending: "Pending",
      processing: "Processing",
      shipping: "Shipping",
      completed: "Completed", 
      cancelled: "Cancelled",
    };
    return statusMap[status] || status;
  }

  /**
   * Get order status color for UI
   */
  static getOrderStatusColor(status: string): string {
    const colorMap: Record<string, string> = {
      pending: "#FFA500", // Orange
      processing: "#007BFF", // Blue
      shipping: "#6610F2", // Purple
      completed: "#28A745", // Green
      cancelled: "#DC3545", // Red
    };
    return colorMap[status] || "#6C757D"; // Gray as default
  }

  /**
   * Validate order data before submission
   */
  static validateOrderData(orderData: CreateOrderData): {
    isValid: boolean;
    errors: Record<string, string>;
  } {
    const errors: Record<string, string> = {};

    if (!orderData.recipient?.trim()) {
      errors.recipient = "Recipient name is required";
    }

    if (!orderData.phone?.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^\+?[\d\s-()]+$/.test(orderData.phone.trim())) {
      errors.phone = "Please enter a valid phone number";
    }

    if (!orderData.delivery?.trim()) {
      errors.delivery = "Delivery method is required";
    }

    if (!orderData.address?.trim()) {
      errors.address = "Delivery address is required";
    }

    if (!orderData.payment?.trim()) {
      errors.payment = "Payment method is required";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }
}

export const {
  createOrder,
  cancelOrder,
  getAllOrders,
  getOrderDetail,
  getOrdersByStatus,
  getPendingOrders,
  getCompletedOrders,
  getCancelledOrders,
} = OrderAPI;