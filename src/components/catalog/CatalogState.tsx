import { AlertTriangle, Loader2 } from "lucide-react";

interface CatalogStateProps {
  loading: boolean;

  /**
   * A message to show the customer, or null when
   * the last load succeeded.
   */
  error: string | null;

  onRetry: () => void;
}

/**
 * ===========================================
 * Catalog State
 * ===========================================
 *
 * What a listing page shows instead of products
 * while the catalog is loading, or when it could
 * not be loaded.
 *
 * Returns null when there is nothing to say, so a
 * page can render it unconditionally.
 */

export default function CatalogState({
  loading,
  error,
  onRetry,
}: CatalogStateProps) {
  if (loading) {
    return (
      <div
        className="
          flex
          flex-col
          items-center
          justify-center
          rounded-2xl
          border
          border-slate-200
          bg-white
          py-24
          text-center
        "
      >
        <Loader2
          size={32}
          className="animate-spin text-blue-600"
        />

        <p className="mt-4 font-medium text-slate-600">
          Loading jerseys...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="
          flex
          flex-col
          items-center
          justify-center
          rounded-2xl
          border
          border-red-200
          bg-red-50
          py-20
          text-center
        "
      >
        <AlertTriangle
          size={32}
          className="text-red-500"
        />

        <h3 className="mt-4 text-xl font-bold text-slate-800">
          We could not load the jerseys
        </h3>

        <p className="mt-2 max-w-md px-6 text-slate-600">
          {error}
        </p>

        <button
          onClick={onRetry}
          className="
            mt-6
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
          Try Again
        </button>
      </div>
    );
  }

  return null;
}
