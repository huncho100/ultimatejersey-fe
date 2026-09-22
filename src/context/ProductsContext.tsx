import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import { productService } from "../services/productServices";

import type { Product } from "../types/product";

/**
 * ===========================================
 * Products Context
 * ===========================================
 *
 * The catalog is read by the home page, the
 * listing pages and search. Fetching it once here
 * keeps those pages consistent with each other and
 * avoids six copies of the same request.
 *
 * This holds the whole catalog in memory, which is
 * fine while the store has tens of products. Once
 * it has thousands, this needs to become a paged,
 * server-filtered query -- see the note in the
 * production readiness report.
 */

interface ProductsContextType {
  products: Product[];

  loading: boolean;

  /**
   * A message suitable for showing the customer,
   * or null when the last load succeeded.
   */
  error: string | null;

  reload: () => void;
}

const ProductsContext =
  createContext<ProductsContextType | null>(null);

interface ProductsProviderProps {
  children: ReactNode;
}

export function ProductsProvider({
  children,
}: ProductsProviderProps) {
  const [products, setProducts] = useState<Product[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      setProducts(
        await productService.getProducts()
      );
    } catch (caught) {
      setProducts([]);

      setError(
        caught instanceof Error
          ? caught.message
          : "Unable to load products."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <ProductsContext.Provider
      value={{
        products,
        loading,
        error,
        reload: () => void load(),
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);

  if (!context) {
    throw new Error(
      "useProducts must be used inside ProductsProvider"
    );
  }

  return context;
}
