/**
 * ===========================================
 * Cart Storage
 * ===========================================
 *
 * Where the cart survives a page refresh.
 *
 * For a signed-in customer the backend cart is the
 * real one; this is a cache that lets the page paint
 * the right thing before GET /cart answers, and a
 * fallback for when it does not answer at all. For a
 * guest there is no backend cart, so this is the
 * only copy.
 *
 * What is written is the product as it was displayed
 * plus a quantity. Prices are included so the cart
 * can be rendered offline, but they are display
 * values only: the amount actually charged is
 * computed by the backend from the products table
 * when the order is created, never read from here.
 *
 * Nothing authentication- or payment-related is
 * stored. The owner field below is a plain user id,
 * used to tell one customer's cached cart from
 * another's -- it grants nothing on its own.
 */

import type { CartItem } from "../types/cart";

const STORAGE_KEY = "ultimatekits.cart";

/**
 * Bumped when the stored shape changes. An older
 * payload is discarded rather than guessed at.
 */
const STORAGE_VERSION = 1;

/**
 * Who a cached cart belongs to: a user id, or null
 * for one built while signed out.
 */
export type CartOwner = number | null;

export interface StoredCart {
  owner: CartOwner;
  items: CartItem[];
}

interface StoredPayload extends StoredCart {
  version: number;
}

/**
 * Accept a line only if it can actually be rendered
 * and priced.
 *
 * Storage is editable by anyone with devtools, and a
 * half-written payload survives a crash mid-write,
 * so nothing read back is assumed to be well formed.
 */
function isUsableItem(
  value: unknown
): value is CartItem {
  if (
    value === null ||
    typeof value !== "object"
  ) {
    return false;
  }

  const item = value as Partial<CartItem>;

  return (
    typeof item.id === "number" &&
    Number.isInteger(item.id) &&
    item.id > 0 &&
    typeof item.name === "string" &&
    typeof item.price === "number" &&
    Number.isFinite(item.price) &&
    typeof item.quantity === "number" &&
    Number.isInteger(item.quantity) &&
    item.quantity > 0
  );
}

/**
 * Read the cached cart.
 *
 * Returns null when there is nothing usable stored,
 * which callers must read as "no cache", not as "an
 * empty cart".
 */
export function readStoredCart(): StoredCart | null {
  let raw: string | null;

  // Storage access itself throws when the browser
  // has it disabled, or in private modes with a zero
  // quota. A customer with cookies switched off gets
  // a cart that does not survive refresh rather than
  // a page that does not load.
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as StoredPayload;

    if (
      parsed === null ||
      typeof parsed !== "object" ||
      parsed.version !== STORAGE_VERSION ||
      !Array.isArray(parsed.items)
    ) {
      return null;
    }

    const owner =
      typeof parsed.owner === "number" &&
      Number.isInteger(parsed.owner)
        ? parsed.owner
        : null;

    return {
      owner,
      items: parsed.items.filter(isUsableItem),
    };
  } catch {
    return null;
  }
}

/**
 * Cache the cart against the customer it belongs to.
 */
export function writeStoredCart(
  owner: CartOwner,
  items: CartItem[]
): void {
  const payload: StoredPayload = {
    version: STORAGE_VERSION,
    owner,
    items,
  };

  // A failed write costs persistence, not the
  // session. Over quota is the realistic cause.
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(payload)
    );
  } catch {
    /* Cart stays in memory for this page only. */
  }
}

export function clearStoredCart(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* Nothing further to do. */
  }
}
