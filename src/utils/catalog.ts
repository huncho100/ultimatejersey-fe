import type { SyntheticEvent } from "react";

import type { Product } from "../types/product";

/**
 * ===========================================
 * Placeholder Image
 * ===========================================
 *
 * Product.image is nullable on the API, and a
 * stored path can also stop resolving. Both cases
 * end up here rather than as a broken-image icon.
 *
 * Inlined as a data URI so it cannot itself 404.
 */

const PLACEHOLDER_SVG = `
  <svg xmlns="http://www.w3.org/2000/svg" width="400" height="400">
    <rect width="400" height="400" fill="#f1f5f9"/>
    <text
      x="200"
      y="208"
      text-anchor="middle"
      font-family="system-ui, sans-serif"
      font-size="20"
      fill="#94a3b8"
    >No image</text>
  </svg>
`;

export const PLACEHOLDER_IMAGE =
  `data:image/svg+xml;charset=UTF-8,${
    encodeURIComponent(PLACEHOLDER_SVG.trim())
  }`;

/**
 * The image to render for a product.
 */
export function productImage(
  product: Product
): string {
  return product.image || PLACEHOLDER_IMAGE;
}

/**
 * Fall back to the placeholder when a stored image
 * path fails to load.
 */
export function handleImageError(
  event: SyntheticEvent<HTMLImageElement>
): void {
  const image = event.currentTarget;

  if (image.src !== PLACEHOLDER_IMAGE) {
    image.src = PLACEHOLDER_IMAGE;
  }
}

/**
 * What to show where the UI wants a heading. Most
 * products are titled by team, but team is
 * nullable, so fall back to the product name.
 */
export function productHeading(
  product: Product
): string {
  return product.team || product.name;
}

/**
 * ===========================================
 * Collections
 * ===========================================
 *
 * The storefront has a page per collection --
 * clubs, national teams, retro. The catalog used
 * to be four hand-curated TypeScript files, so a
 * jersey belonged to a collection because of which
 * file it was typed into.
 *
 * The products table has no equivalent column, so
 * membership is derived below from league, sport
 * and category, which are real product fields an
 * administrator already sets.
 *
 * Two consequences worth knowing about, because
 * they are genuine changes rather than bugs:
 *
 *   - Collections now overlap. A retro Liverpool
 *     jersey is both a club jersey and a retro
 *     jersey, and appears on both pages. The old
 *     files kept it on one.
 *
 *   - A product filed under retro but categorised
 *     as something else is no longer retro. In the
 *     old data exactly one jersey was in that
 *     position.
 *
 * If the business wants collections curated rather
 * than derived, products needs an explicit
 * collection column and these three predicates go
 * away. That is an open decision, not something to
 * settle here.
 */

const NATIONAL_TEAM_LEAGUE = "National Team";

const FOOTBALL = "Football";

const BASKETBALL = "Basketball";

const RETRO_CATEGORY = "Retro";

export function isNationalTeamJersey(
  product: Product
): boolean {
  return product.league === NATIONAL_TEAM_LEAGUE;
}

export function isClubJersey(
  product: Product
): boolean {
  return (
    product.sport === FOOTBALL &&
    product.league !== NATIONAL_TEAM_LEAGUE
  );
}

export function isRetroJersey(
  product: Product
): boolean {
  return product.category === RETRO_CATEGORY;
}

export function isBasketballJersey(
  product: Product
): boolean {
  return product.sport === BASKETBALL;
}
