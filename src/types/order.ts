/**
 * ===========================================
 * Order Types
 * ===========================================
 *
 * Money fields are declared as strings because that
 * is what actually arrives. The order schemas type
 * them as Decimal, and Pydantic serialises Decimal to
 * a JSON string ("89.99"), exactly as the cart does.
 * Calling them numbers here would let arithmetic on
 * them typecheck and then concatenate at runtime, so
 * they go through parseDecimal instead.
 */

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  unit_price: string;
  subtotal: string;
}

export interface Order {
  id: number;
  user_id: number;
  status: string;
  total_amount: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}