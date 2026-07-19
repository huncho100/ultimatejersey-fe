import { footballProducts } from "./football";
import { basketballProducts } from "./basketball";
import { nationalTeamProducts } from "./nationalTeams";
import { retroProducts } from "./retro";
import { genericProducts } from "./generic";

/**
 * ============================================================
 * MASTER PRODUCT CATALOGUE
 * ============================================================
 * Every product in the application lives here.
 * New categories only need to be imported and added below.
 */

export const products = [
  ...footballProducts,
  ...basketballProducts,
  ...nationalTeamProducts,
  ...retroProducts,
  ...genericProducts,
];

/**
 * Homepage Featured Products
 */
export const featuredProducts = products.filter(
  (product) => product.isFeatured
);

/**
 * New Arrivals
 */
export const newArrivals = products.filter(
  (product) => product.isNew
);

/**
 * Best Sellers
 */
export const bestSellers = products.filter(
  (product) => product.isBestSeller
);

/**
 * Products Currently Available
 */
export const inStockProducts = products.filter(
  (product) => product.inStock
);