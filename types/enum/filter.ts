import type { Category } from "@/types/category"; 

export const CATEGORIES: Category[] = [
  { id: "all", name: "All", icon: "grid", iconLibrary: "feather" },
  { id: "tshirt", name: "T-Shirt", icon: "tshirt", iconLibrary: "image" },
  { id: "pant", name: "Pants", icon: "pant", iconLibrary: "image" },
  { id: "jacket", name: "Jacket", icon: "jacket", iconLibrary: "image" },
  { id: "dress", name: "Dress", icon: "dress", iconLibrary: "image" },
  { id: "shoes", name: "Shoes", icon: "shoes", iconLibrary: "image" },
  { id: "accessories", name: "Accessories", icon: "accessories", iconLibrary: "image" },
  { id: "bags", name: "Bags", icon: "bags", iconLibrary: "image" },
  { id: "hat", name: "Hat", icon: "hat", iconLibrary: "image" },
  { id: "other", name: "Other", icon: "layers", iconLibrary: "feather" },
];

export const SORT_OPTIONS = [
  { id: "newest", name: "Newest" },
  { id: "price-low", name: "Price: Low to High" },
  { id: "price-high", name: "Price: High to Low" },
  { id: "highest-rating", name: "Highest Rating" },
  { id: "best-seller", name: "Best Seller" },
];

export const PRODUCERS = [
  "Nike", "Adidas", "Zara", "H&M", "Uniqlo", "Gucci", "Louis Vuitton", "Prada"
];