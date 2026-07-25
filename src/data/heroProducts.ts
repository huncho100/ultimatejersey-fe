import type { Product } from "../types/product";

import { featuredProducts } from "./products";
import { footballProducts } from "./football";
import { basketballProducts } from "./basketball";
import { nationalTeamProducts } from "./nationalTeams";
import { retroProducts } from "./retro";

/**
 * Products eligible to appear in the Hero section.
 * Duplicates are removed by product id.
 */

const allProducts: Product[] = [
  ...featuredProducts,
  ...footballProducts,
  ...basketballProducts,
  ...nationalTeamProducts,
  ...retroProducts,
];

export const heroProducts: Product[] = Array.from(
  new Map(allProducts.map((product) => [product.id, product])).values()
);