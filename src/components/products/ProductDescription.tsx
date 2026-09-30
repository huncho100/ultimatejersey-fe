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
 * The products table has no description column
 * either, so in practice nothing reaches the
 * `description` prop today and every product shows
 * the empty state below. Adding descriptions is an
 * administrator and backend task, noted in
 * docs/product-content.md.
 */

export default function ProductDescription({
  description,
}: {
  description?: string;
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
    <p className="text-lg leading-8 text-slate-600">
      {text}
    </p>
  );
}
