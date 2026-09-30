import { PackageOpen } from "lucide-react";

interface EmptyCollectionProps {
  /** "Retro Kits", "National Teams". */
  collection: string;

  /** The product column that decides membership. */
  field: string;

  /** The value that column has to hold. */
  value: string;
}

/**
 * ===========================================
 * Empty Collection
 * ===========================================
 *
 * What a collection page shows when the catalog
 * contains no products for it at all.
 *
 * This is not the same as a search matching nothing,
 * and saying "no jerseys found -- try another search"
 * would be actively misleading: no search term will
 * help, because there is nothing to find. The page is
 * empty because nobody has added a product with the
 * right field value yet, so that is what it says,
 * naming the field and the value an administrator has
 * to set.
 */

export default function EmptyCollection({
  collection,
  field,
  value,
}: EmptyCollectionProps) {
  return (
    <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">

      <PackageOpen
        size={40}
        aria-hidden="true"
        className="mx-auto text-slate-400"
      />

      <h3 className="mt-5 text-2xl font-bold text-slate-700">
        No {collection} yet
      </h3>

      <p className="mx-auto mt-3 max-w-lg text-slate-500">
        This collection is empty because no product in
        the catalog belongs to it.
      </p>

      <p className="mx-auto mt-4 max-w-lg text-sm text-slate-500">
        A product appears here once its{" "}

        <span className="font-semibold text-slate-700">
          {field}
        </span>{" "}

        is set to{" "}

        <code className="rounded bg-slate-100 px-2 py-0.5 font-semibold text-slate-800">
          {value}
        </code>

        .
      </p>

    </div>
  );
}
