import { useState } from "react";
import { SlidersHorizontal, RotateCcw } from "lucide-react";

import { formatNaira } from "../../utils/currency";

import type {
  CatalogFacets,
  CatalogFilterState,
  CatalogListFacet,
} from "../../types/filter";

/**
 * ===========================================
 * Catalog Filters
 * ===========================================
 *
 * The filter panel for a product listing page.
 *
 * Every option shown here is read off the products
 * the page is displaying. The panel it replaces wrote
 * its options down by hand -- categories of "Home",
 * "Away", "Third Kit" and "Player Edition" against a
 * catalog whose categories are nothing of the sort --
 * so ticking a category could only ever empty the
 * page. Deriving the options means that cannot happen
 * again, and that a new brand or league shows up here
 * the moment an administrator uses it.
 *
 * A facet with only one value is left out. Narrowing
 * to the only option there is does nothing, and the
 * catalog currently has exactly one category and one
 * sport, so showing them would be most of the panel.
 */

/** Above this many options a section collapses. */
const VISIBLE_OPTIONS = 8;

interface CatalogFiltersProps {
  facets: CatalogFacets;
  filters: CatalogFilterState;

  toggleFilter: (
    facet: CatalogListFacet,
    value: string
  ) => void;
  setMaxPrice: (value: number | null) => void;
  setInStockOnly: (value: boolean) => void;

  onReset: () => void;

  /** Drives the badge and the reset button. */
  activeCount: number;
}

export default function CatalogFilters({
  facets,
  filters,
  toggleFilter,
  setMaxPrice,
  setInStockOnly,
  onReset,
  activeCount,
}: CatalogFiltersProps) {

  /**
   * On a phone the panel would push the products an
   * entire screen down, so it starts collapsed there
   * and is always open from `lg` up.
   */
  const [open, setOpen] = useState(false);

  const priceRange =
    facets.maxPrice > facets.minPrice;

  const step =
    facets.maxPrice - facets.minPrice <= 100
      ? 1
      : Math.ceil(
          (facets.maxPrice - facets.minPrice) / 100
        );

  /**
   * No explicit limit reads as the top of the range,
   * which is also where the thumb belongs.
   */
  const priceValue =
    filters.maxPrice ?? facets.maxPrice;

  function handlePriceChange(value: number) {
    // Dragging back to the top is the customer
    // removing the limit, not asking for one that
    // happens to match the most expensive jersey.
    setMaxPrice(
      value >= facets.maxPrice ? null : value
    );
  }

  return (
    <aside className="h-fit lg:sticky lg:top-24">

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        {/* Header */}

        <div className="flex items-center justify-between gap-3">

          <h3 className="flex items-center gap-2 text-xl font-bold text-slate-900">

            Filters

            {activeCount > 0 && (
              <span className="rounded-full bg-blue-600 px-2.5 py-0.5 text-xs font-semibold text-white">
                {activeCount}
              </span>
            )}

          </h3>

          {/* Mobile toggle */}

          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="catalog-filter-panel"
            className="
              flex
              items-center
              gap-2
              rounded-xl
              border
              border-slate-300
              px-3
              py-2
              text-sm
              font-medium
              text-slate-700
              transition
              hover:border-blue-500
              hover:text-blue-600
              lg:hidden
            "
          >
            <SlidersHorizontal size={16} />
            {open ? "Hide" : "Show"}
          </button>

        </div>

        {/* Panel */}

        <div
          id="catalog-filter-panel"
          className={`${open ? "block" : "hidden"} lg:block`}
        >

          <FacetSection
            title="Category"
            options={facets.categories}
            selected={filters.categories}
            onToggle={(value) =>
              toggleFilter("categories", value)
            }
          />

          <FacetSection
            title="Sport"
            options={facets.sports}
            selected={filters.sports}
            onToggle={(value) =>
              toggleFilter("sports", value)
            }
          />

          <FacetSection
            title="League"
            options={facets.leagues}
            selected={filters.leagues}
            onToggle={(value) =>
              toggleFilter("leagues", value)
            }
          />

          <FacetSection
            title="Team"
            options={facets.teams}
            selected={filters.teams}
            onToggle={(value) =>
              toggleFilter("teams", value)
            }
          />

          <FacetSection
            title="Brand"
            options={facets.brands}
            selected={filters.brands}
            onToggle={(value) =>
              toggleFilter("brands", value)
            }
          />

          {/* Price */}

          {priceRange && (

            <section className="mt-8">

              <div className="mb-4 flex items-baseline justify-between">

                <h4 className="font-semibold text-slate-900">
                  Max Price
                </h4>

                <span className="text-sm font-medium text-blue-600">
                  {formatNaira(priceValue)}
                </span>

              </div>

              <input
                type="range"
                min={facets.minPrice}
                max={facets.maxPrice}
                step={step}
                value={priceValue}
                aria-label="Maximum price"
                onChange={(e) =>
                  handlePriceChange(
                    Number(e.target.value)
                  )
                }
                className="w-full accent-blue-600"
              />

              <div className="mt-2 flex justify-between text-xs text-slate-500">
                <span>
                  {formatNaira(facets.minPrice)}
                </span>

                <span>
                  {formatNaira(facets.maxPrice)}
                </span>
              </div>

            </section>

          )}

          {/* Availability */}

          <section className="mt-8">

            <h4 className="mb-4 font-semibold text-slate-900">
              Availability
            </h4>

            <label className="flex cursor-pointer items-center gap-3 text-sm text-slate-700">

              <input
                type="checkbox"
                checked={filters.inStockOnly}
                onChange={(e) =>
                  setInStockOnly(e.target.checked)
                }
                className="h-4 w-4 rounded accent-blue-600"
              />

              In stock only

            </label>

          </section>

          {/* Reset */}

          {activeCount > 0 && (

            <button
              type="button"
              onClick={onReset}
              className="
                mt-10
                flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-slate-300
                py-3
                font-medium
                transition
                hover:border-red-500
                hover:bg-red-50
                hover:text-red-600
              "
            >
              <RotateCcw size={16} />
              Clear Filters
            </button>

          )}

        </div>

      </div>

    </aside>
  );
}

/**
 * One group of pill options.
 *
 * Renders nothing unless there is a real choice to
 * make, and keeps long lists -- teams, mostly -- from
 * running off the panel.
 */
function FacetSection({
  title,
  options,
  selected,
  onToggle,
}: {
  title: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  if (options.length < 2) return null;

  const overflowing =
    options.length > VISIBLE_OPTIONS;

  const visible =
    overflowing && !expanded
      ? options.slice(0, VISIBLE_OPTIONS)
      : options;

  return (
    <section className="mt-8">

      <h4 className="mb-4 font-semibold text-slate-900">
        {title}
      </h4>

      <div className="flex flex-wrap gap-2">

        {visible.map((option) => {
          const active = selected.includes(option);

          return (
            <button
              key={option}
              type="button"
              onClick={() => onToggle(option)}
              aria-pressed={active}
              className={`
                rounded-full
                border
                px-4
                py-2
                text-sm
                font-medium
                transition-all
                duration-300

                ${
                  active
                    ? "border-blue-600 bg-blue-600 text-white shadow-md"
                    : "border-slate-300 bg-white text-slate-700 hover:border-blue-500 hover:text-blue-600"
                }
              `}
            >
              {option}
            </button>
          );
        })}

      </div>

      {overflowing && (

        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          {expanded
            ? "Show less"
            : `Show all ${options.length}`}
        </button>

      )}

    </section>
  );
}
