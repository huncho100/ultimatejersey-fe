/**
 * ===========================================
 * Order Types
 * ===========================================
 */

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface Order {
  id: number;
  user_id: number;
  status: string;
  total_amount: number;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}