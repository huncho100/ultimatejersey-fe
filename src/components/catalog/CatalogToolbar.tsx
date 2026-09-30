import type { SortOption } from "../../types/filter";

interface CatalogToolbarProps {
  total: number;
  showing: number;
  sortBy: SortOption;
  onSortChange: (value: SortOption) => void;
}

export default function CatalogToolbar({
  total,
  showing,
  sortBy,
  onSortChange,
}: CatalogToolbarProps) {
  return (
    <div className="mb-8 flex flex-col items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center">

      {/* Results */}

      <div>
        <p className="text-sm text-slate-500">
          Showing
        </p>

        <h3 className="text-lg font-bold text-slate-900">
          {showing} of {total} Jerseys
        </h3>
      </div>

      {/* Sort */}

      <div className="flex items-center gap-3">

        <label
          htmlFor="sort"
          className="font-medium text-slate-700"
        >
          Sort By
        </label>

        <select
          id="sort"
          value={sortBy}
          onChange={(e) =>
            onSortChange(
              e.target.value as SortOption
            )
          }
          className="rounded-xl border border-slate-300 bg-white px-4 py-2 transition focus:border-blue-600 focus:outline-none"
        >
          <option value="featured">Featured</option>

          <option value="newest">Newest</option>

          <option value="price-low">
            Price: Low to High
          </option>

          <option value="price-high">
            Price: High to Low
          </option>

          <option value="rating">
            Highest Rated
          </option>
        </select>

      </div>

    </div>
  );
}
