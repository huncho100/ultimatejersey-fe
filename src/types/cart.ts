/**
 * ===========================================
 * Cart Types
 * ===========================================
 *
 * A cart line is a product plus how many of it the
 * customer wants. The cart model -- here and on the
 * backend -- allows exactly one line per product;
 * adding a product already in the cart raises its
 * quantity rather than appending a second line.
 *
 * This lives in types/ rather than in CartContext so
 * that the storage helper can describe what it
 * persists without importing the context that uses
 * it.
 */

import type { Product } from "./product";

export interface CartItem extends Product {
  quantity: number;
}
