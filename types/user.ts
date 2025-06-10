export interface UserInfo {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  img?: string | null;
  phone?: string | null;
  favorite?: string[];
  cartSize?: number;
  isAdmin: boolean;
  isActive: boolean;
  totalSpent?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  img?: string;
}

export interface ChangePasswordData {
  oldPassword: string;
  newPassword: string;
}

export interface RequestPasswordResetData {
  email: string;
}

export interface VerifyResetCodeData {
  email: string;
  code: string;
}

export interface ResetPasswordData {
  email: string;
  code: string; 
  newPassword: string;
}

export interface ApiResponse<T = any> {
  status: string;
  message: string;
  data?: T;
}

export interface LoginResponse extends ApiResponse {
  access_token: string;
  refresh_token: string;
  userInfo: UserInfo;
}

export interface SignUpResponse extends ApiResponse {
  data: UserInfo;
}

export interface UpdateUserResponse extends ApiResponse {
  data: UserInfo;
}

export interface UserDetailResponse extends ApiResponse {
  data: UserInfo;
}

export interface ChangePasswordResponse extends ApiResponse {
  message: string;
}

export interface RefreshTokenResponse extends ApiResponse {
  access_token: string;
  refresh_token?: string;
}

export interface CartResponse extends ApiResponse {
  cart?: CartItem[]; 
  data?: CartItem[]; 
}

export interface CartProduct {
  _id: string;
  name: string;
  price: number;
  images: string[];
}

export interface CartItem {
  product: CartProduct;
  color: string;
  size: string;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
}

export interface FavoriteProduct {
  _id: string;
  name: string;
  price: number;
  img: string;
  category?: string;
}

export interface ExtendedUserInfo extends UserInfo {
  cart?: Cart;
  favoriteProducts?: FavoriteProduct[];
}

export interface FormErrors {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  confirmPassword?: string;
  oldPassword?: string;
  newPassword?: string;
}

export interface AuthState {
  user: UserInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
}

export interface AuthContextType extends AuthState {
  login: (data: LoginData) => Promise<void>;
  logout: () => Promise<void>;
  signup: (data: SignUpData) => Promise<void>;
  updateProfile: (data: UpdateUserData, file?: FormData) => Promise<void>;
  changePassword: (data: ChangePasswordData) => Promise<void>;
  refreshUser: () => Promise<void>;
}