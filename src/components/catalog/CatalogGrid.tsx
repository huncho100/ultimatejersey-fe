import type { ReactNode } from "react";

import ProductCard from "../products/ProductCard";

import type { Product } from "../../types/product";

interface CatalogGridProps {
  products: Product[];

  /**
   * What to say when there is nothing to show.
   *
   * Pages set this because the two reasons a grid is
   * empty need different answers: a search that
   * matched nothing is the customer's to undo, while
   * a collection with no products in it is the
   * store's to fill and no amount of retyping will
   * help.
   */
  emptyTitle: string;
  emptyMessage: ReactNode;

  /** Usually a "clear filters" button. */
  emptyAction?: ReactNode;
}

/**
 * ===========================================
 * Catalog Grid
 * ===========================================
 *
 * The product grid shared by every listing page.
 */

export default function CatalogGrid({
  products,
  emptyTitle,
  emptyMessage,
  emptyAction,
}: CatalogGridProps) {

  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">

        <h3 className="text-2xl font-bold text-slate-700">
          {emptyTitle}
        </h3>

        <div className="mx-auto mt-3 max-w-md text-slate-500">
          {emptyMessage}
        </div>

        {emptyAction && (
          <div className="mt-6">{emptyAction}</div>
        )}

      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
        />
      ))}
    </div>
  );
}
