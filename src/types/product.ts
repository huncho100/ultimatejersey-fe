/**
 * ===========================================
 * Product Types
 * ===========================================
 *
 * The camelCase shape the UI works with. The API
 * speaks snake_case and sends decimals as strings,
 * so nothing here is a direct copy of a response
 * body -- see productServices.toProduct for the
 * translation.
 */

export interface Product {
  id: number;

  // Basic Information
  name: string;

  // Nullable on the API. A product is not obliged
  // to belong to a team.
  team?: string | null;

  sport: string;
  category: string;

  // Metadata
  league?: string | null;
  brand?: string | null;

  // Pricing. Already parsed into numbers; the API
  // sends these as decimal strings.
  price: number;
  oldPrice?: number | null;

  // Reviews
  rating: number;

  // Images
  image?: string | null;

  // Not supplied by the API. Anything reading these
  // must cope with them being absent.
  gallery?: string[];
  description?: string;
  sizes?: string[];

  // Status
  isNew?: boolean;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  inStock?: boolean;

  // null means the product is uncounted, where
  // inStock alone decides availability. A number is
  // the quantity the backend will actually allow.
  stockQuantity?: number | null;
}
