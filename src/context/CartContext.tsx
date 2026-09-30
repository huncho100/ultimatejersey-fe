import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { useAuth } from "./AuthContext";

import {
  cartService,
  type ApiCart,
} from "../services/cartService";
import { productService } from "../services/productServices";

import {
  clearStoredCart,
  readStoredCart,
  writeStoredCart,
  type CartOwner,
} from "../utils/cartStorage";

import type { CartItem } from "../types/cart";
import type { Product } from "../types/product";

export type { CartItem };

/**
 * ===========================================
 * Cart Limits
 * ===========================================
 */

/**
 * Mirrors MAX_CART_ITEM_QUANTITY on the backend.
 *
 * The server remains the authority -- it rejects
 * anything above this -- but clamping here means the
 * customer meets the limit in the control they are
 * using rather than as a failed request after the
 * fact.
 */
export const MAX_CART_ITEM_QUANTITY = 99;

/**
 * The largest quantity of a product the cart will
 * accept.
 *
 * A null stock_quantity means the product is not
 * counted: availability is decided by the in-stock
 * flag alone and only the shared ceiling applies.
 * This is the same rule InventoryService applies on
 * the backend.
 */
export function maxQuantityFor(
  product: Product
): number {
  if (product.inStock === false) {
    return 0;
  }

  const stock = product.stockQuantity;

  if (typeof stock !== "number") {
    return MAX_CART_ITEM_QUANTITY;
  }

  return Math.max(
    0,
    Math.min(
      Math.trunc(stock),
      MAX_CART_ITEM_QUANTITY
    )
  );
}

/**
 * ===========================================
 * Helpers
 * ===========================================
 */

function messageFor(
  caught: unknown,
  fallback: string
): string {
  return caught instanceof Error && caught.message
    ? caught.message
    : fallback;
}

function tooManyMessage(
  product: Product,
  ceiling: number
): string {
  return (
    `Only ${ceiling} of ${product.name} ` +
    "can be in your cart."
  );
}

function toSyncItems(items: CartItem[]) {
  return items.map((item) => ({
    product_id: item.id,
    quantity: item.quantity,
  }));
}

/**
 * Combine a backend cart with one built while signed
 * out.
 *
 * Quantities are taken at the larger of the two
 * rather than added together. Adding would be right
 * if the two carts were always independent, but they
 * usually are not -- the cached copy is normally the
 * same cart the backend already holds -- and summing
 * would double every line on sign-in. Taking the
 * larger keeps whatever the customer put in on
 * either side without inventing units nobody asked
 * for.
 */
function mergeCarts(
  server: CartItem[],
  local: CartItem[]
): CartItem[] {
  const merged = new Map<number, CartItem>();

  for (const item of server) {
    merged.set(item.id, item);
  }

  for (const item of local) {
    const existing = merged.get(item.id);

    merged.set(
      item.id,
      existing
        ? {
            ...existing,
            quantity: Math.max(
              existing.quantity,
              item.quantity
            ),
          }
        : item
    );
  }

  return [...merged.values()];
}

function sameQuantities(
  a: CartItem[],
  b: CartItem[]
): boolean {
  if (a.length !== b.length) return false;

  const quantities = new Map(
    b.map((item) => [item.id, item.quantity])
  );

  return a.every(
    (item) =>
      quantities.get(item.id) === item.quantity
  );
}

/**
 * Turn the backend's cart -- product ids and
 * quantities -- back into lines the UI can render.
 *
 * Product details come from whatever the caller
 * already knows; only ids it has never seen are
 * fetched. On an ordinary refresh that is nothing at
 * all, and on a new device it is one request per
 * distinct product in the cart.
 *
 * A line whose product cannot be resolved -- deleted
 * since it was added, or unreachable -- is dropped
 * rather than rendered as a blank row with a price.
 */
async function resolveApiCart(
  cart: ApiCart,
  known: CartItem[]
): Promise<CartItem[]> {
  // The backend holds one line per product. Folding
  // first means a duplicate that somehow exists
  // still shows as a single line here.
  const quantities = new Map<number, number>();

  for (const line of cart.items) {
    quantities.set(
      line.product_id,
      (quantities.get(line.product_id) ?? 0) +
        line.quantity
    );
  }

  const catalog = new Map<number, Product>(
    known.map((item) => [item.id, item])
  );

  const unknownIds = [...quantities.keys()].filter(
    (id) => !catalog.has(id)
  );

  const fetched = await Promise.allSettled(
    unknownIds.map((id) =>
      productService.getProduct(id)
    )
  );

  for (const result of fetched) {
    if (result.status === "fulfilled") {
      catalog.set(result.value.id, result.value);
    }
  }

  const items: CartItem[] = [];

  for (const [
    productId,
    quantity,
  ] of quantities) {
    const product = catalog.get(productId);

    if (!product) continue;

    items.push({
      ...product,
      quantity: Math.min(
        Math.max(1, quantity),
        MAX_CART_ITEM_QUANTITY
      ),
    });
  }

  return items;
}

/**
 * ===========================================
 * Outcomes
 * ===========================================
 */

/**
 * What a backend write did.
 *
 * "superseded" is not a failure: a later edit
 * replaced this one before it was sent, and that
 * later edit reports for itself.
 */
type SyncOutcome =
  | { status: "saved" }
  | { status: "failed"; message: string }
  | { status: "superseded" };

/**
 * What an add did, from the point of view of
 * somebody who has to tell the customer about it.
 *
 * The three cases exist because "did it work" is not
 * a yes or no here. An add can be accepted, refused,
 * or clamped to a ceiling -- and a clamped add put
 * something in the cart while still not doing what
 * was asked, which is worth saying rather than
 * congratulating the customer on.
 *
 *   added   -- exactly what was asked for is in the
 *              cart, and the backend has it too
 *   problem -- something the customer needs to know
 *   silent  -- nothing happened, and nothing needs
 *              saying
 */
export type CartAddOutcome =
  | { status: "added"; quantity: number }
  | { status: "problem"; message: string }
  | { status: "silent" };

/**
 * ===========================================
 * Context
 * ===========================================
 */

interface CartContextType {
  cartItems: CartItem[];

  /**
   * Add a quantity of a product.
   *
   * Quantity defaults to one, must be at least one,
   * and is added to whatever the cart already holds
   * of that product rather than replacing it.
   *
   * Resolves once the change has been accepted --
   * for a signed-in customer that means the backend
   * has it, not merely that the screen has changed.
   * Callers that confirm the add to the customer
   * must wait for this, or they will confirm a
   * change the backend went on to refuse.
   */
  addToCart: (
    product: Product,
    quantity?: number
  ) => Promise<CartAddOutcome>;

  removeFromCart: (id: number) => void;

  /**
   * Set a line to an exact quantity. One is the
   * floor; removing is a separate action.
   */
  updateQuantity: (
    id: number,
    quantity: number
  ) => void;

  clearCart: () => void;

  /**
   * Re-read the backend cart. Used after payment,
   * where the backend empties the cart itself.
   */
  refreshCart: () => Promise<void>;

  /**
   * False until the stored cart has been restored.
   * Pages that decide something from the cart being
   * empty must wait for this, or they will say so
   * about a cart that is still loading.
   */
  hydrated: boolean;

  /** A cart edit is on its way to the backend. */
  syncing: boolean;

  /** The last cart problem worth showing, if any. */
  error: string | null;

  totalItems: number;

  totalPrice: number;
}

const CartContext =
  createContext<CartContextType | null>(null);

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({
  children,
}: CartProviderProps) {
  const { user, loading: authLoading } = useAuth();

  const userId = user?.id ?? null;

  const [cartItems, setCartItems] = useState<
    CartItem[]
  >([]);

  const [hydrated, setHydrated] = useState(false);

  const [syncing, setSyncing] = useState(false);

  const [error, setError] = useState<string | null>(
    null
  );

  /**
   * The committed cart and its owner, readable from
   * callbacks that must not close over a stale
   * render.
   */
  const itemsRef = useRef<CartItem[]>([]);

  const ownerRef = useRef<CartOwner>(null);

  /**
   * "Latest wins" tokens. A slow answer to an
   * earlier edit must never overwrite a later one.
   */
  const restoreToken = useRef(0);

  const syncToken = useRef(0);

  /**
   * Backend writes run one at a time. Two PUTs in
   * flight together can land in the opposite order
   * to the clicks that caused them, leaving the
   * backend holding the earlier cart.
   */
  const syncChain = useRef<Promise<void>>(
    Promise.resolve()
  );

  /**
   * ------------------------------------------
   * Adopting A Cart
   * ------------------------------------------
   */

  const adopt = useCallback(
    (owner: CartOwner, items: CartItem[]) => {
      ownerRef.current = owner;
      itemsRef.current = items;

      setCartItems(items);
      writeStoredCart(owner, items);
    },
    []
  );

  /**
   * ------------------------------------------
   * Reload From Backend
   * ------------------------------------------
   */

  const reloadFromServer =
    useCallback(async () => {
      const owner = ownerRef.current;

      if (owner === null) return;

      try {
        const items = await resolveApiCart(
          await cartService.getCart(),
          itemsRef.current
        );

        // The customer signed out, or signed in as
        // somebody else, while this was in flight.
        if (ownerRef.current !== owner) return;

        adopt(owner, items);
      } catch {
        /* Keep showing what we already have. */
      }
    }, [adopt]);

  /**
   * ------------------------------------------
   * Push To Backend
   * ------------------------------------------
   */

  const pushToServer = useCallback(
    (items: CartItem[]): Promise<SyncOutcome> => {
      // Guests have no backend cart. The local cache
      // is the whole of their persistence, so the
      // write is already done.
      if (ownerRef.current === null) {
        return Promise.resolve({ status: "saved" });
      }

      const token = ++syncToken.current;

      setSyncing(true);

      const run = async (): Promise<SyncOutcome> => {
        // A later edit has already replaced this
        // one. Sending it would write back a cart
        // the customer has moved on from.
        if (token !== syncToken.current) {
          return { status: "superseded" };
        }

        try {
          await cartService.syncCart(
            toSyncItems(items)
          );

          return { status: "saved" };
        } catch (caught) {
          if (token !== syncToken.current) {
            return { status: "superseded" };
          }

          const message = messageFor(
            caught,
            "Unable to save your cart."
          );

          setError(message);

          // The backend refused the change, so what
          // is on screen is not what exists. Take
          // its answer rather than leaving the
          // customer looking at quantities it will
          // not honour at checkout.
          await reloadFromServer();

          return { status: "failed", message };
        } finally {
          if (token === syncToken.current) {
            setSyncing(false);
          }
        }
      };

      const outcome = syncChain.current.then(
        run,
        run
      );

      // The chain carries ordering, not results. It
      // is kept free of both values and rejections
      // so that one failed push cannot stop or
      // reject the next one queued behind it.
      syncChain.current = outcome.then(
        () => undefined,
        () => undefined
      );

      return outcome;
    },
    [reloadFromServer]
  );

  /**
   * ------------------------------------------
   * Restore On Load And On Sign-In
   * ------------------------------------------
   */

  const restore = useCallback(async () => {
    const token = ++restoreToken.current;

    const stored = readStoredCart();

    const cached = stored?.items ?? [];
    const cachedOwner = stored?.owner ?? null;

    // --------------------------------------
    // Signed Out
    // --------------------------------------

    if (userId === null) {
      // A cart cached against an account is not the
      // next visitor's to inherit.
      if (cachedOwner !== null) {
        clearStoredCart();
        adopt(null, []);
      } else {
        adopt(null, cached);
      }

      setHydrated(true);
      return;
    }

    // --------------------------------------
    // Signed In
    // --------------------------------------

    let serverCart: ApiCart;

    try {
      serverCart = await cartService.getCart();
    } catch (caught) {
      if (token !== restoreToken.current) return;

      // Offline, or the API is down. Show the cached
      // cart rather than an empty one -- but only if
      // it belongs to this customer, or to the guest
      // they have just signed in as.
      adopt(
        userId,
        cachedOwner === null ||
          cachedOwner === userId
          ? cached
          : []
      );

      setError(
        messageFor(
          caught,
          "Unable to load your saved cart."
        )
      );

      setHydrated(true);
      return;
    }

    if (token !== restoreToken.current) return;

    const serverItems = await resolveApiCart(
      serverCart,
      cached
    );

    if (token !== restoreToken.current) return;

    // Only a cart built while signed out is merged
    // in. Everything else -- an ordinary refresh
    // included -- takes the backend's word, because
    // the cache is no more than a copy of it.
    const isGuestHandover =
      cachedOwner === null && cached.length > 0;

    if (!isGuestHandover) {
      adopt(userId, serverItems);
      setHydrated(true);
      return;
    }

    const merged = mergeCarts(serverItems, cached);

    adopt(userId, merged);
    setHydrated(true);

    if (!sameQuantities(merged, serverItems)) {
      await pushToServer(merged);
    }
  }, [userId, adopt, pushToServer]);

  useEffect(() => {
    // The user is not known yet, so neither is which
    // cart to restore.
    if (authLoading) return;

    void restore();
  }, [authLoading, restore]);

  /**
   * ------------------------------------------
   * Commit An Edit
   * ------------------------------------------
   */

  const commit = useCallback(
    (items: CartItem[]): Promise<SyncOutcome> => {
      itemsRef.current = items;

      setCartItems(items);
      writeStoredCart(ownerRef.current, items);

      return pushToServer(items);
    },
    [pushToServer]
  );

  /**
   * ------------------------------------------
   * Add To Cart
   * ------------------------------------------
   */

  const addToCart = useCallback(
    async (
      product: Product,
      quantity: number = 1
    ): Promise<CartAddOutcome> => {
      const requested = Math.trunc(
        Number(quantity)
      );

      // Below one is not a smaller order, it is not
      // an order. Nothing is added, and nothing
      // already in the cart is disturbed.
      if (
        !Number.isFinite(requested) ||
        requested < 1
      ) {
        return { status: "silent" };
      }

      const ceiling = maxQuantityFor(product);

      if (ceiling < 1) {
        const message = `${product.name} is out of stock.`;

        setError(message);

        return { status: "problem", message };
      }

      const current = itemsRef.current;

      const existing = current.find(
        (item) => item.id === product.id
      );

      // Adding a product the cart already holds
      // raises that line. The cart model -- here and
      // on the backend -- allows one line per
      // product.
      const wanted =
        (existing?.quantity ?? 0) + requested;

      const allowed = Math.min(wanted, ceiling);

      const clamped = wanted > ceiling;

      setError(
        clamped
          ? tooManyMessage(product, ceiling)
          : null
      );

      if (allowed === existing?.quantity) {
        // Already at the ceiling. Nothing moved, and
        // the ceiling is the reason.
        return {
          status: "problem",
          message: tooManyMessage(product, ceiling),
        };
      }

      const outcome = await commit(
        existing
          ? current.map((item) =>
              item.id === product.id
                ? {
                    // Refresh the snapshot too, so a
                    // repriced product does not keep
                    // showing its old price.
                    ...item,
                    ...product,
                    quantity: allowed,
                  }
                : item
            )
          : [
              ...current,
              { ...product, quantity: allowed },
            ]
      );

      if (outcome.status === "failed") {
        return {
          status: "problem",
          message: outcome.message,
        };
      }

      // A later edit overtook this one. Whatever it
      // was, it is the one that will be reported.
      if (outcome.status === "superseded") {
        return { status: "silent" };
      }

      // Some of what was asked for went in, but not
      // all of it. Confirming the add here would be
      // confirming a quantity the customer is not
      // getting.
      if (clamped) {
        return {
          status: "problem",
          message: tooManyMessage(product, ceiling),
        };
      }

      return {
        status: "added",
        quantity: requested,
      };
    },
    [commit]
  );

  /**
   * ------------------------------------------
   * Update Quantity
   * ------------------------------------------
   */

  const updateQuantity = useCallback(
    (id: number, quantity: number) => {
      const current = itemsRef.current;

      const existing = current.find(
        (item) => item.id === id
      );

      if (!existing) return;

      const requested = Math.trunc(
        Number(quantity)
      );

      // One is the floor. Stepping below it does
      // nothing rather than quietly emptying the
      // line -- removal is its own deliberate
      // action.
      if (
        !Number.isFinite(requested) ||
        requested < 1
      ) {
        return;
      }

      // A product that has sold out since it was
      // added still keeps its line; checkout is
      // where the backend refuses it.
      const ceiling = Math.max(
        1,
        maxQuantityFor(existing)
      );

      const allowed = Math.min(requested, ceiling);

      setError(
        requested > ceiling
          ? tooManyMessage(existing, ceiling)
          : null
      );

      if (allowed === existing.quantity) return;

      commit(
        current.map((item) =>
          item.id === id
            ? { ...item, quantity: allowed }
            : item
        )
      );
    },
    [commit]
  );

  /**
   * ------------------------------------------
   * Remove / Clear
   * ------------------------------------------
   */

  const removeFromCart = useCallback(
    (id: number) => {
      setError(null);

      commit(
        itemsRef.current.filter(
          (item) => item.id !== id
        )
      );
    },
    [commit]
  );

  const clearCart = useCallback(() => {
    setError(null);

    commit([]);
  }, [commit]);

  const refreshCart = useCallback(async () => {
    setError(null);

    await reloadFromServer();
  }, [reloadFromServer]);

  /**
   * ------------------------------------------
   * Totals
   * ------------------------------------------
   *
   * For display only. What the customer is actually
   * charged is computed by the backend from the
   * products table when the order is created.
   */

  const totalItems = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      ),
    [cartItems]
  );

  const totalPrice = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) =>
          sum + item.price * item.quantity,
        0
      ),
    [cartItems]
  );

  const value = useMemo<CartContextType>(
    () => ({
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      refreshCart,
      hydrated,
      syncing,
      error,
      totalItems,
      totalPrice,
    }),
    [
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      refreshCart,
      hydrated,
      syncing,
      error,
      totalItems,
      totalPrice,
    ]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}
