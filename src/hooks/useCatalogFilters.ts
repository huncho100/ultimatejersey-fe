import {
  useCallback,
  useDeferredValue,
  useMemo,
  useState,
} from "react";

import { maxQuantityFor } from "../context/CartContext";

import { matchesQuery } from "../utils/catalog";
import { formatNaira } from "../utils/currency";

import type { Product } from "../types/product";
import type {
  ActiveFilter,
  CatalogFacets,
  CatalogFilterState,
  CatalogListFacet,
  SortOption,
} from "../types/filter";

import { emptyCatalogFilters } from "../types/filter";

/**
 * ===========================================
 * Catalog Filters
 * ===========================================
 *
 * Search, filtering and sorting for a product
 * listing page.
 *
 * Every listing page used to carry its own copy of
 * this: the three collection pages held the same
 * eighty lines with one predicate changed, and the
 * products page held a fourth version that filtered
 * different fields and had no search at all. Keeping
 * them in step by hand is what let the products page
 * drift into offering categories the catalog does not
 * contain.
 *
 * The page supplies the products it is responsible
 * for -- all of them, or one collection -- and gets
 * back the filtered list plus the state the controls
 * bind to.
 *
 * Filtering happens here in the browser, over the
 * catalog ProductsContext has already loaded, so
 * typing costs no requests. That is the existing
 * architecture and it holds while the store has tens
 * of products; the note in ProductsContext covers
 * what has to change when it has thousands.
 */

/**
 * Distinct, sorted values of one text column.
 *
 * Nulls and blanks are dropped: "no brand recorded"
 * is not a brand a customer can usefully pick.
 */
function distinct(
  products: Product[],
  read: (product: Product) => string | null | undefined
): string[] {
  const values = new Set<string>();

  for (const product of products) {
    const value = read(product)?.trim();

    if (value) values.add(value);
  }

  return [...values].sort((a, b) =>
    a.localeCompare(b)
  );
}

function isSoldOut(product: Product): boolean {
  // The same rule the cart and the product card use,
  // so a product never reads as available in one
  // place and sold out in another.
  return maxQuantityFor(product) < 1;
}

function sortProducts(
  products: Product[],
  sortBy: SortOption
): Product[] {
  // Sorting a copy: the caller's array is derived
  // from context state and must not be reordered in
  // place.
  const sorted = [...products];

  switch (sortBy) {
    case "price-low":
      return sorted.sort(
        (a, b) => a.price - b.price
      );

    case "price-high":
      return sorted.sort(
        (a, b) => b.price - a.price
      );

    case "rating":
      return sorted.sort(
        (a, b) => b.rating - a.rating
      );

    case "newest":
      return sorted.sort(
        (a, b) =>
          Number(Boolean(b.isNew)) -
          Number(Boolean(a.isNew))
      );

    case "featured":
    default:
      return sorted.sort(
        (a, b) =>
          Number(Boolean(b.isFeatured)) -
          Number(Boolean(a.isFeatured))
      );
  }
}

export interface UseCatalogFilters {
  query: string;
  setQuery: (value: string) => void;

  filters: CatalogFilterState;
  toggleFilter: (
    facet: CatalogListFacet,
    value: string
  ) => void;
  setMaxPrice: (value: number | null) => void;
  setInStockOnly: (value: boolean) => void;

  sortBy: SortOption;
  setSortBy: (value: SortOption) => void;

  /** Options present in the supplied products. */
  facets: CatalogFacets;

  /** What to render. */
  results: Product[];

  /** Everything the customer has chosen, removable. */
  activeFilters: ActiveFilter[];

  /** True when a search term or any facet is set. */
  hasActiveFilters: boolean;

  reset: () => void;
}

export function useCatalogFilters(
  products: Product[],
  defaultSort: SortOption = "featured"
): UseCatalogFilters {
  const [query, setQuery] = useState("");

  const [filters, setFilters] =
    useState<CatalogFilterState>(
      emptyCatalogFilters
    );

  const [sortBy, setSortBy] =
    useState<SortOption>(defaultSort);

  /**
   * Keep the field itself instant while the grid
   * re-filters. No request is involved, so there is
   * nothing to debounce -- this is about not
   * re-rendering a large grid on every keystroke.
   */
  const deferredQuery = useDeferredValue(query);

  /**
   * ------------------------------------------
   * Facets
   * ------------------------------------------
   *
   * Derived from the products in hand rather than
   * written down, so the controls can only ever offer
   * values the catalog actually contains.
   */

  const facets = useMemo<CatalogFacets>(() => {
    const prices = products.map(
      (product) => product.price
    );

    return {
      categories: distinct(
        products,
        (product) => product.category
      ),
      leagues: distinct(
        products,
        (product) => product.league
      ),
      brands: distinct(
        products,
        (product) => product.brand
      ),
      teams: distinct(
        products,
        (product) => product.team
      ),
      sports: distinct(
        products,
        (product) => product.sport
      ),

      minPrice: prices.length
        ? Math.floor(Math.min(...prices))
        : 0,
      maxPrice: prices.length
        ? Math.ceil(Math.max(...prices))
        : 0,
    };
  }, [products]);

  /**
   * ------------------------------------------
   * Results
   * ------------------------------------------
   */

  const results = useMemo(() => {
    const search = deferredQuery
      .trim()
      .toLowerCase();

    const matched = products.filter((product) => {
      if (!matchesQuery(product, search)) {
        return false;
      }

      // An empty facet is "no preference". Reading it
      // as "match nothing" would empty the page the
      // moment the customer opened the panel.
      if (
        filters.categories.length > 0 &&
        !filters.categories.includes(
          product.category
        )
      ) {
        return false;
      }

      if (
        filters.leagues.length > 0 &&
        !filters.leagues.includes(
          product.league ?? ""
        )
      ) {
        return false;
      }

      if (
        filters.brands.length > 0 &&
        !filters.brands.includes(
          product.brand ?? ""
        )
      ) {
        return false;
      }

      if (
        filters.teams.length > 0 &&
        !filters.teams.includes(product.team ?? "")
      ) {
        return false;
      }

      if (
        filters.sports.length > 0 &&
        !filters.sports.includes(product.sport)
      ) {
        return false;
      }

      if (
        filters.maxPrice !== null &&
        product.price > filters.maxPrice
      ) {
        return false;
      }

      if (filters.inStockOnly && isSoldOut(product)) {
        return false;
      }

      return true;
    });

    return sortProducts(matched, sortBy);
  }, [products, deferredQuery, filters, sortBy]);

  /**
   * ------------------------------------------
   * Controls
   * ------------------------------------------
   */

  const toggleFilter = useCallback(
    (facet: CatalogListFacet, value: string) => {
      setFilters((previous) => {
        const selected = previous[facet];

        return {
          ...previous,
          [facet]: selected.includes(value)
            ? selected.filter(
                (item) => item !== value
              )
            : [...selected, value],
        };
      });
    },
    []
  );

  const setMaxPrice = useCallback(
    (value: number | null) => {
      setFilters((previous) => ({
        ...previous,
        maxPrice: value,
      }));
    },
    []
  );

  const setInStockOnly = useCallback(
    (value: boolean) => {
      setFilters((previous) => ({
        ...previous,
        inStockOnly: value,
      }));
    },
    []
  );

  const reset = useCallback(() => {
    setQuery("");
    setFilters(emptyCatalogFilters);
    setSortBy(defaultSort);
  }, [defaultSort]);

  /**
   * ------------------------------------------
   * Active Filters
   * ------------------------------------------
   *
   * One flat, removable list so the customer can see
   * what is narrowing the page without opening the
   * panel -- and undo one choice without clearing the
   * lot.
   */

  const activeFilters = useMemo<ActiveFilter[]>(() => {
    const chips: ActiveFilter[] = [];

    const listFacets: CatalogListFacet[] = [
      "categories",
      "leagues",
      "brands",
      "teams",
      "sports",
    ];

    for (const facet of listFacets) {
      for (const value of filters[facet]) {
        chips.push({
          id: `${facet}:${value}`,
          label: value,
          remove: () => toggleFilter(facet, value),
        });
      }
    }

    if (filters.maxPrice !== null) {
      chips.push({
        id: "maxPrice",
        label: `Under ${formatNaira(
          filters.maxPrice
        )}`,
        remove: () => setMaxPrice(null),
      });
    }

    if (filters.inStockOnly) {
      chips.push({
        id: "inStockOnly",
        label: "In stock only",
        remove: () => setInStockOnly(false),
      });
    }

    return chips;
  }, [
    filters,
    toggleFilter,
    setMaxPrice,
    setInStockOnly,
  ]);

  const hasActiveFilters =
    activeFilters.length > 0 ||
    query.trim().length > 0;

  return {
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
  };
}
