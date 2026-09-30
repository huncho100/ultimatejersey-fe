import { X } from "lucide-react";

import type { ActiveFilter } from "../../types/filter";

interface ActiveFiltersProps {
  filters: ActiveFilter[];

  /** The current search term, if any. */
  query?: string;
  onClearQuery?: () => void;

  onClearAll: () => void;
}

/**
 * ===========================================
 * Active Filters
 * ===========================================
 *
 * A row of everything currently narrowing the page,
 * each one removable on its own.
 *
 * Without this the only record of what is applied
 * lives inside the filter panel, which is collapsed
 * on mobile -- so a customer looking at three results
 * has no way to see why there are only three.
 *
 * Renders nothing when nothing is applied, so pages
 * can include it unconditionally.
 */

export default function ActiveFilters({
  filters,
  query,
  onClearQuery,
  onClearAll,
}: ActiveFiltersProps) {

  const searchChip = Boolean(
    query?.trim() && onClearQuery
  );

  if (filters.length === 0 && !searchChip) {
    return null;
  }

  return (
    <div className="mb-6 flex flex-wrap items-center gap-3">

      <span className="text-sm font-medium text-slate-500">
        Active:
      </span>

      {searchChip && (
        <Chip
          label={`Search: ${query}`}
          onRemove={onClearQuery!}
        />
      )}

      {filters.map((filter) => (
        <Chip
          key={filter.id}
          label={filter.label}
          onRemove={filter.remove}
        />
      ))}

      <button
        type="button"
        onClick={onClearAll}
        className="
          text-sm
          font-semibold
          text-blue-600
          underline-offset-4
          transition
          hover:text-blue-700
          hover:underline
        "
      >
        Clear all
      </button>

    </div>
  );
}

function Chip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <span
      className="
        inline-flex
        items-center
        gap-2
        rounded-full
        border
        border-blue-200
        bg-blue-50
        py-1.5
        pl-4
        pr-2
        text-sm
        font-medium
        text-blue-700
      "
    >
      {label}

      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove filter: ${label}`}
        className="
          rounded-full
          p-1
          transition
          hover:bg-blue-200
          hover:text-blue-900
        "
      >
        <X size={14} />
      </button>
    </span>
  );
}
