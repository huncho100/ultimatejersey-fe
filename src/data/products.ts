import { catalogProducts } from "./catalog";

/**
 * ============================================================
 * PRODUCT COLLECTIONS
 * Derived from the master catalog.
 * ============================================================
 */

export const featuredProducts = catalogProducts.filter(
  (product) => product.isFeatured
);

export const newArrivals = catalogProducts.filter(
  (product) => product.isNew
);

export const bestSellers = catalogProducts.filter(
  (product) => product.isBestSeller
);

export const inStockProducts = catalogProducts.filter(
  (product) => product.inStock
);

/**
 * ============================================================
 * FILTER OPTIONS
 * Generated automatically from the master catalog.
 * ============================================================
 */

export const categories = [
  ...new Set(
    catalogProducts
      .map((product) => product.category)
      .filter(Boolean)
  ),
].sort();

export const leagues = [
  ...new Set(
    catalogProducts
      .map((product) => product.league)
      .filter(Boolean)
  ),
].sort() as string[];

export const brands = [
  ...new Set(
    catalogProducts
      .map((product) => product.brand)
      .filter(Boolean)
  ),
].sort() as string[];

export const minPrice = Math.min(
  ...catalogProducts.map((product) => product.price)
);

export const maxProductPrice = Math.max(
  ...catalogProducts.map((product) => product.price)
);