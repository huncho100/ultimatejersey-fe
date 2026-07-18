export interface Product {
  id: number;

  // Basic Information
  name: string;
  team: string;
  sport: string;
  category: string;

  // Optional metadata
  league?: string;
  brand?: string;

  // Pricing
  price: number;
  oldPrice?: number;

  // Reviews
  rating: number;

  // Image
  image: string;

  // Status
  isNew?: boolean;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  inStock?: boolean;
}