import type { ReactNode } from "react";

import Container from "../ui/Container";
import SectionTitle from "../ui/SectionTitle";

import ActiveFilters from "./ActiveFilters";
import CatalogFilters from "./CatalogFilters";
import CatalogGrid from "./CatalogGrid";
import CatalogSearch from "./CatalogSearch";
import CatalogState from "./CatalogState";
import CatalogToolbar from "./CatalogToolbar";

import { useCatalogFilters } from "../../hooks/useCatalogFilters";

import type { Product } from "../../types/product";
import type { SortOption } from "../../types/filter";

/**
 * ===========================================
 * Catalog Page
 * ===========================================
 *
 * The whole of a product listing page: search,
 * filters, active filters, sorting, grid and the
 * loading and error states.
 *
 * There were four of these. The three collection
 * pages were copies of each other differing only in
 * which products they passed in and what the heading
 * said, and the products page was a fourth version
 * that had drifted -- different filter fields, a
 * different empty state, and no search at all. The
 * drift is the point: a customer on /products could
 * not search, and the categories offered there
 * matched nothing in the catalog.
 *
 * A page now decides three things -- what it is
 * called, which products it covers, and what to say
 * when it covers none -- and everything else is here.
 */

interface CatalogPageProps {
  title: string;
  subtitle: string;

  /**
   * The products this page is responsible for.
   * Filters and search operate within them, and the
   * facet options are read off them.
   */
  products: Product[];

  loading: boolean;
  error: string | null;
  onRetry: () => void;

  searchPlaceholder?: string;

  defaultSort?: SortOption;

  /**
   * Shown instead of the controls when `products` is
   * empty -- a collection with nothing in it, rather
   * than a search that matched nothing.
   *
   * Omitted by pages that cover the whole catalog,
   * where empty means the store has no products at
   * all and the ordinary empty grid says that fine.
   */
  emptyCollection?: ReactNode;
}

export default function CatalogPage({
  title,
  subtitle,
  products,
  loading,
  error,
  onRetry,
  searchPlaceholder,
  defaultSort = "featured",
  emptyCollection,
}: CatalogPageProps) {

  const {
    query,
    setQuery,
    filters,
    toggleFilter,
    setMaxPrice,
    setInStockOnly,
    sortBy,
    setSortBy,
    facets,
    results,
    activeFilters,
    hasActiveFilters,
    reset,
  } = useCatalogFilters(products, defaultSort);

  /**
   * Offering a search box and a filter panel for a
   * collection that holds nothing is just something
   * else for the customer to try before concluding
   * the page is broken.
   */
  const collectionEmpty =
    !loading &&
    !error &&
    products.length === 0 &&
    Boolean(emptyCollection);

  return (
    <section className="min-h-screen bg-slate-50 py-16">
      <Container>

        <SectionTitle
          title={title}
          subtitle={subtitle}
          align="left"
        />

        {collectionEmpty ? (

          emptyCollection

        ) : (

          <>
            <div className="mt-8">
              <CatalogSearch
                value={query}
                onChange={setQuery}
                placeholder={searchPlaceholder}
                label={`Search ${title}`}
              />
            </div>

            <div className="mt-10 grid gap-10 lg:grid-cols-[280px_1fr]">

              <CatalogFilters
                facets={facets}
                filters={filters}
                toggleFilter={toggleFilter}
                setMaxPrice={setMaxPrice}
                setInStockOnly={setInStockOnly}
                onReset={reset}
                activeCount={activeFilters.length}
              />

              <div>
                {loading || error ? (

                  <CatalogState
                    loading={loading}
                    error={error}
                    onRetry={onRetry}
                  />

                ) : (

                  <>
                    <CatalogToolbar
                      total={products.length}
                      showing={results.length}
                      sortBy={sortBy}
                      onSortChange={setSortBy}
                    />

                    <ActiveFilters
                      filters={activeFilters}
                      query={query}
                      onClearQuery={() => setQuery("")}
                      onClearAll={reset}
                    />

                    <CatalogGrid
                      products={results}
                      emptyTitle="No jerseys found"
                      emptyMessage={
                        hasActiveFilters
                          ? "Nothing matches what you are searching and filtering for. Try removing one of them."
                          : "There are no jerseys to show here yet."
                      }
                      emptyAction={
                        hasActiveFilters && (
                          <button
                            type="button"
                            onClick={reset}
                            className="
                              rounded-xl
                              bg-blue-600
                              px-6
                              py-3
                              font-semibold
                              text-white
                              transition
                              hover:bg-blue-700
                            "
                          >
                            Clear search and filters
                          </button>
                        )
                      }
                    />
                  </>

                )}
              </div>

            </div>
          </>

        )}

      </Container>
    </section>
  );
}
