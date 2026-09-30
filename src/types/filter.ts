/**
 * ===========================================
 * Catalog Filter Types
 * ===========================================
 *
 * Every facet below maps to a real column on the
 * products table. Nothing here is derived from a
 * field the API does not send, because a filter the
 * data cannot answer is a filter that silently
 * returns nothing.
 */

export type SortOption =
  | "featured"
  | "newest"
  | "rating"
  | "price-low"
  | "price-high";

/**
 * The facets a customer can tick. Each is a list of
 * accepted values; an empty list means "no
 * preference", not "match nothing".
 */
export interface CatalogFilterState {
  categories: string[];
  leagues: string[];
  brands: string[];
  teams: string[];
  sports: string[];

  /**
   * Upper price bound, or null for no limit.
   *
   * Null rather than a number so that the default is
   * independent of whatever the catalog happens to
   * cost. A hardcoded ceiling silently hides every
   * product priced above it the day someone adds one.
   */
  maxPrice: number | null;

  /** Hide products that cannot currently be bought. */
  inStockOnly: boolean;
}

/**
 * The facet keys that hold a list of values, which
 * are the ones a generic toggle can operate on.
 */
export type CatalogListFacet = Extract<
  keyof CatalogFilterState,
  "categories" | "leagues" | "brands" | "teams" | "sports"
>;

/**
 * The options actually present in a given set of
 * products, plus the price range they span.
 */
export interface CatalogFacets {
  categories: string[];
  leagues: string[];
  brands: string[];
  teams: string[];
  sports: string[];

  minPrice: number;
  maxPrice: number;
}

/**
 * One removable summary of something the customer has
 * chosen, for the "active filters" row.
 */
export interface ActiveFilter {
  /** Stable key for React and for removal. */
  id: string;

  label: string;

  remove: () => void;
}

export const emptyCatalogFilters: CatalogFilterState =
  {
    categories: [],
    leagues: [],
    brands: [],
    teams: [],
    sports: [],
    maxPrice: null,
    inStockOnly: false,
  };
