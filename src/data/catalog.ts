import type { Product } from "../types/product";

import { footballProducts } from "./football";
import { basketballProducts } from "./basketball";
import { nationalTeamProducts } from "./nationalTeams";
import { retroProducts } from "./retro";

/**
 * Master product catalog.
 * Combines every product from every collection.
 * Duplicate IDs are removed automatically.
 */

const allProducts: Product[] = [
  ...footballProducts,
  ...basketballProducts,
  ...nationalTeamProducts,
  ...retroProducts,
];

export const catalogProducts: Product[] = Array.from(
  new Map(
    allProducts.map((product) => [product.id, product])
  ).values()
);