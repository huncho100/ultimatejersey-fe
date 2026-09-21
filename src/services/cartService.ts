import { authenticatedRequest } from "./api";

interface CartSyncItem {
  product_id: number;
  quantity: number;
}

export const cartService = {
  syncCart(items: CartSyncItem[]) {
    return authenticatedRequest("/cart", {
      method: "PUT",
      body: JSON.stringify({ items }),
    });
  },
};
