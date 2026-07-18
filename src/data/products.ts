import { footballProducts } from "./football";
import { basketballProducts } from "./basketball";
import { nationalTeamProducts } from "./nationalTeams";
import { retroProducts } from "./retro";

/**
 * Master Product Catalogue
 * Combines all product categories into one collection.
 */
export const products = [
  ...footballProducts,
  ...basketballProducts,
  ...nationalTeamProducts,
  ...retroProducts,
];

/**
 * Products displayed on the homepage.
 */
export const featuredProducts = products.filter(
  (product) => product.isFeatured
);