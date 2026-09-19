import { authenticatedRequest } from "./api";

import type { Order } from "../types/order";

/**
 * ===========================================
 * Configuration
 * ===========================================
 */

async function request<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  return authenticatedRequest<T>(
    `/orders${endpoint}`,
    {
      ...options,
      headers: {
        ...(options?.headers || {}),
      },
    }
  );
}

/**
 * ===========================================
 * Order Service
 * ===========================================
 */

export const orderService = {
  /**
   * Create an order from the user's
   * current cart.
   */
  createOrder() {
    return request<Order>("", {
      method: "POST",
    });
  },

  /**
   * Get all orders belonging to
   * the authenticated user.
   */
  getOrders() {
    return request<Order[]>("", {
      method: "GET",
    });
  },

  /**
   * Get a specific order.
   */
  getOrder(orderId: number) {
    return request<Order>(`/${orderId}`, {
      method: "GET",
    });
  },
};