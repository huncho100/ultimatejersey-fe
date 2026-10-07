/**
 * ===========================================
 * Product Description
 * ===========================================
 *
 * The description panel of the product tabs.
 *
 * It prints the product's own description and
 * nothing else. It used to carry a fallback
 * paragraph and a fixed list of four features --
 * "official licensed merchandise", "moisture-wicking
 * technology" and so on -- shown against every
 * product in the catalogue, including the retro
 * shirts and the basketball kit. Those were claims
 * about goods, made by the website rather than by
 * the store, and no product record supports them.
 *
 * The products table has a nullable `description`
 * column. It is null for every product an
 * administrator has not written one for, and those
 * show the empty state below. Writing the
 * descriptions is an administrator task, noted in
 * docs/product-content.md.
 */

export default function ProductDescription({
  description,
}: {
  description?: string | null;
}) {
  const text = description?.trim();

  if (!text) {
    return (
      <p className="leading-8 text-slate-600">
        No description has been published for this
        product yet.
      </p>
    );
  }

  return (
    <p className="whitespace-pre-line text-lg leading-8 text-slate-600">
      {text}
    </p>
  );
}
