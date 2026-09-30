import { authenticatedRequest } from "./api";

/**
 * ===========================================
 * Wire Format
 * ===========================================
 *
 * What GET /cart and PUT /cart return. unit_price
 * and subtotal are computed by the backend from the
 * products table, and arrive as decimal *strings*
 * the same way product prices do.
 *
 * These are the authoritative figures: the checkout
 * summary shows them rather than anything the
 * browser worked out for itself.
 */

export interface ApiCartItem {
  id: number;
  cart_id: number;
  product_id: number;
  quantity: number;
  unit_price: string;
  subtotal: string;
}

export interface ApiCart {
  id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  items: ApiCartItem[];
}

export interface CartSyncItem {
  product_id: number;
  quantity: number;
}

export const cartService = {
  /**
   * Read the signed-in customer's cart.
   */
  getCart() {
    return authenticatedRequest<ApiCart>("/cart");
  },

  /**
   * Replace the signed-in customer's cart with the
   * supplied lines.
   *
   * A replace rather than a series of increments, so
   * the backend ends up holding exactly what the
   * browser is showing. Repeating the same call
   * changes nothing, which is what makes it safe to
   * send on every cart edit and again at checkout.
   */
  syncCart(items: CartSyncItem[]) {
    return authenticatedRequest<ApiCart>("/cart", {
      method: "PUT",
      body: JSON.stringify({ items }),
    });
  },
};
