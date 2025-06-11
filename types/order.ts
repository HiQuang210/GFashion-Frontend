import { ApiResponse } from "./user";
export interface OrderProduct {
  productId: string;
  color: string;
  size: string;
  quantity: number;
  name: string;
  price: number;
  image?: string;
  type: string;
  producer: string;
  material?: string;
  description?: string;
}

export interface Order {
  _id: string;
  recipient: string;
  phone: string;
  delivery: string;
  address: string;
  payment: string;
  products: OrderProduct[];
  status: 'pending' | 'processing' | 'shipping' | 'completed' | 'cancelled';
  userId: string;
  rated: boolean;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderData {
  recipient: string;
  phone: string;
  delivery: string;
  address: string;
  payment: string;
  note?: string;
  products?: OrderProduct[]; 
}

export interface OrderResponse extends ApiResponse {
  data: Order;
}

export interface OrdersResponse extends ApiResponse {
  data: Order[];
  total?: number;
  page?: number;
  limit?: number;
}

export interface CancelOrderResponse extends ApiResponse {
  data: {
    id: string;
    status: string;
  };
}

export interface OrderSummary {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalSpent: number;
}

export interface OrderFilters {
  status?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface OrderValidationResult {
  isValid: boolean;
  errors: {
    recipient?: string;
    phone?: string;
    delivery?: string;
    address?: string;
    payment?: string;
    products?: string;
  };
}

export interface OrderOperationResult {
  success: boolean;
  message: string;
  data?: Order | { id: string; status: string };
}