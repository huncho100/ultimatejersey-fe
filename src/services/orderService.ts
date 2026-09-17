import { authService } from "./authService";

import type { Order } from "../types/order";

/**
 * ===========================================
 * Configuration
 * ===========================================
 */

const API_BASE_URL = "http://localhost:5000/api/orders";

/**
 * ===========================================
 * Generic Request Helper
 * ===========================================
 */

async function request<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const token = authService.getToken();

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      headers: {
        "Content-Type": "application/json",

        ...(token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {}),

        ...(options?.headers || {}),
      },

      ...options,
    }
  );

  if (!response.ok) {
    const error = await response.text();

    throw new Error(
      error || "Something went wrong."
    );
  }

  return response.json();
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