import { Search, X } from "lucide-react";

interface CatalogSearchProps {
  value: string;
  onChange: (value: string) => void;

  /**
   * Worth setting per page -- "Search retro kits"
   * tells the customer what they are searching
   * better than "Search" does.
   */
  placeholder?: string;

  /** For the visually hidden label. */
  label?: string;
}

/**
 * ===========================================
 * Catalog Search
 * ===========================================
 *
 * The search field for a product listing page.
 *
 * Searching is client-side, over the catalog already
 * in memory, so there is no request to debounce and
 * results land as the customer types. useCatalogFilters
 * defers the filtering pass so the field itself stays
 * responsive regardless of how large the grid is.
 */

export default function CatalogSearch({
  value,
  onChange,
  placeholder = "Search jerseys, teams, brands...",
  label = "Search products",
}: CatalogSearchProps) {
  return (
    <div className="relative w-full">

      <label htmlFor="catalog-search" className="sr-only">
        {label}
      </label>

      <Search
        size={20}
        aria-hidden="true"
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
      />

      <input
        id="catalog-search"
        type="search"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full
          rounded-xl
          border
          border-slate-300
          bg-white
          py-3
          pl-12
          pr-12
          text-slate-900
          outline-none
          transition-all
          duration-300
          focus:border-blue-500
          focus:ring-4
          focus:ring-blue-100

          [&::-webkit-search-cancel-button]:appearance-none
        "
      />

      {/*
        The browser's own clear affordance is
        suppressed above: it only appears in some
        engines, and never on touch. This one is
        always there and is large enough to hit on a
        phone.
      */}

      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="
            absolute
            right-3
            top-1/2
            -translate-y-1/2
            rounded-full
            p-1.5
            text-slate-400
            transition
            hover:bg-slate-100
            hover:text-slate-700
          "
        >
          <X size={18} />
        </button>
      )}

    </div>
  );
}
