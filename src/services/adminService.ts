import { authenticatedRequest } from "./api";
import { productService } from "./productServices";
import type { ApiProduct } from "./productServices";

export interface AdminCustomer {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  is_active: boolean;
  order_count: number;
}

export interface AdminOrder {
  id: number;
  user_id: number;
  status: string;
  total_amount: string;
  created_at: string;
  updated_at: string;
  customer: Omit<AdminCustomer, "order_count">;
  payment_status: string;
  available_actions: string[];
  product_names: Record<string, string>;
  items: {
    id: number;
    product_id: number;
    quantity: number;
    unit_price: string;
    subtotal: string;
  }[];
  payments: {
    reference: string;
    status: string;
    amount: string;
    currency: string;
    created_at: string;
  }[];
}

export interface PageResult<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
}

export interface AdminOverview {
  inventory: {
    total: number;
    in_stock: number;
    low_stock: number;
    out_of_stock: number;
    uncounted: number;
    low_stock_threshold: number;
  };
  total_orders: number;
  awaiting_processing: number;
  sales: {
    verified_orders: number;
    verified_sales_ngn: string;
    cancelled_verified_orders: number;
    cancelled_verified_ngn: string;
  };
  recent_orders: AdminOrder[];
}

export type ProductWrite = Pick<ApiProduct,
  "name" | "sport" | "category" | "team" | "league" | "brand" | "description" |
  "price" | "old_price" | "rating" | "image" | "is_featured" | "is_new" | "is_best_seller"
>;

export const adminService = {
  me: () => authenticatedRequest<{ role: string; is_active: boolean }>("/auth/me"),
  overview: () => authenticatedRequest<AdminOverview>("/admin/overview"),
  products: productService.getProducts,
  product: (id: number) => authenticatedRequest<ApiProduct>(`/products/${id}`),
  saveProduct: (data: ProductWrite, id?: number) =>
    authenticatedRequest<ApiProduct>(id === undefined ? "/products" : `/products/${id}`, {
      method: id === undefined ? "POST" : "PATCH",
      body: JSON.stringify(data),
    }),
  inventory: (id: number, data: {
    stock_quantity: number | null;
    in_stock: boolean;
    expected_stock_quantity: number | null;
    expected_in_stock: boolean;
  }) => authenticatedRequest<ApiProduct>(`/admin/inventory/${id}`, {
    method: "PUT", body: JSON.stringify(data),
  }),
  orders: (params: URLSearchParams) =>
    authenticatedRequest<PageResult<AdminOrder>>(`/admin/orders/page?${params}`),
  order: (id: number) => authenticatedRequest<AdminOrder>(`/admin/orders/${id}`),
  updateOrder: (id: number, status: string) =>
    authenticatedRequest<{ id: number; status: string }>(`/admin/orders/${id}`, {
      method: "PATCH", body: JSON.stringify({ status }),
    }),
  customers: (params: URLSearchParams) =>
    authenticatedRequest<PageResult<AdminCustomer>>(`/admin/customers?${params}`),
};
