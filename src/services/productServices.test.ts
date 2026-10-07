/**
 * ===========================================
 * Product Service -- Description Mapping
 * ===========================================
 *
 * The API sends `description` as a nullable string.
 * toProduct passes it through untouched: no fallback
 * paragraph is assembled here, because text on a
 * product page has to come from someone in the
 * business rather than from the frontend.
 */

import { describe, expect, it } from "vitest";

import { toProduct } from "./productServices";

import type { ApiProduct } from "./productServices";

// A product exactly as GET /products returns it, with
// no description published.
const API_PRODUCT: ApiProduct = {
  id: 1,

  name: "Manchester United Home Jersey",
  sport: "Football",
  category: "Jerseys",

  team: "Manchester United",
  league: "Premier League",
  brand: "Adidas",

  description: null,

  price: "89.99",
  old_price: "109.99",

  rating: 4.5,

  image: "/images/manchester-united-home.jpg",

  is_featured: true,
  is_new: true,
  is_best_seller: false,
  in_stock: true,

  stock_quantity: null,

  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
};

describe("toProduct description mapping", () => {
  it("maps a published description through unchanged", () => {
    const product = toProduct({
      ...API_PRODUCT,
      description: "Official home shirt.",
    });

    expect(product.description).toBe(
      "Official home shirt."
    );
  });

  it("keeps null when no description is published", () => {
    const product = toProduct(API_PRODUCT);

    expect(product.description).toBeNull();
  });

  it("invents nothing when description is null", () => {
    const product = toProduct(API_PRODUCT);

    // The old build assembled a paragraph from team and
    // category -- "Show your support with this official
    // Manchester United jersey...". Nothing may
    // reintroduce that.
    expect(product.description).toBeNull();
  });

  it("preserves paragraph breaks", () => {
    const text = "First paragraph.\n\nSecond paragraph.";

    const product = toProduct({
      ...API_PRODUCT,
      description: text,
    });

    expect(product.description).toBe(text);
  });

  it("leaves every other field untouched", () => {
    const product = toProduct({
      ...API_PRODUCT,
      description: "Official home shirt.",
    });

    expect(product.id).toBe(1);
    expect(product.name).toBe(
      "Manchester United Home Jersey"
    );
    expect(product.price).toBe(89.99);
    expect(product.oldPrice).toBe(109.99);
    expect(product.rating).toBe(4.5);
    expect(product.category).toBe("Jerseys");
    expect(product.image).toBe(
      "/images/manchester-united-home.jpg"
    );
    expect(product.inStock).toBe(true);
    expect(product.stockQuantity).toBeNull();
  });
});
