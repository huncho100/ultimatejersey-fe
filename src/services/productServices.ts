import { apiRequest } from "./api";

import type { Product } from "../types/product";

/**
 * ===========================================
 * Wire Format
 * ===========================================
 *
 * Exactly what GET /products returns. Kept
 * separate from Product so that a change on
 * either side shows up here as a type error
 * rather than as a silently wrong value.
 *
 * price, old_price and rating are Decimal columns
 * on the backend and arrive as JSON *strings*
 * ("89.99"), not numbers. Using them without
 * parsing produces string concatenation in every
 * total on the site.
 */

export interface ApiProduct {
  id: number;

  name: string;
  sport: string;
  category: string;

  team: string | null;
  league: string | null;
  brand: string | null;

  price: string;
  old_price: string | null;

  rating: number;

  image: string | null;

  is_featured: boolean;
  is_new: boolean;
  is_best_seller: boolean;
  in_stock: boolean;

  stock_quantity: number | null;

  created_at: string;
  updated_at: string;
}

/**
 * ===========================================
 * Translation
 * ===========================================
 */

function toNumber(
  value: string | number | null
): number {
  if (value === null) return 0;

  const parsed =
    typeof value === "number"
      ? value
      : Number.parseFloat(value);

  return Number.isFinite(parsed) ? parsed : 0;
}

/**
 * Convert one API product into the shape the UI
 * expects.
 *
 * gallery, description and sizes are deliberately
 * absent: the products table has no such columns,
 * and inventing values here would put text on the
 * page that nobody in the business wrote.
 */
export function toProduct(
  data: ApiProduct
): Product {
  return {
    id: data.id,

    name: data.name,
    team: data.team,
    sport: data.sport,
    category: data.category,

    league: data.league,
    brand: data.brand,

    price: toNumber(data.price),

    oldPrice:
      data.old_price === null
        ? null
        : toNumber(data.old_price),

    rating: toNumber(data.rating),

    image: data.image,

    isNew: data.is_new,
    isFeatured: data.is_featured,
    isBestSeller: data.is_best_seller,
    inStock: data.in_stock,

    stockQuantity: data.stock_quantity,
  };
}

/**
 * ===========================================
 * Product Service
 * ===========================================
 *
 * Both endpoints are public, so these use the
 * unauthenticated request helper.
 */

export const productService = {
  /**
   * Fetch the whole catalog.
   */
  async getProducts(): Promise<Product[]> {
    const data =
      await apiRequest<ApiProduct[]>("/products");

    return data.map(toProduct);
  },

  /**
   * Fetch a single product.
   *
   * Throws with the API's message when the product
   * does not exist.
   */
  async getProduct(
    productId: number
  ): Promise<Product> {
    const data = await apiRequest<ApiProduct>(
      `/products/${productId}`
    );

    return toProduct(data);
  },
};
