import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import ProductCard from "./ProductCard";
import ProductGallery from "./ProductGallery";
import { PLACEHOLDER_IMAGE, productImage } from "../../utils/catalog";
import type { Product } from "../../types/product";

vi.mock("../../context/WishlistContext", () => ({
  useWishlist: () => ({ wishlistItems: [] }),
}));
vi.mock("../../hooks/useProductActions", () => ({
  useProductActions: () => ({
    addProductToCart: vi.fn(),
    toggleProductInWishlist: vi.fn(),
  }),
}));

const product: Product = {
  id: 9,
  name: "Chelsea Home Jersey",
  sport: "Football",
  category: "Jerseys",
  price: 25000,
  rating: 4.6,
  inStock: true,
};

describe("product photographs", () => {
  it.each([
    ["Chelsea Home Jersey", "/images/products/football/chelsea-home.webp"],
    [
      "Manchester United Red Jersey - Black Shoulder Stripes",
      "/images/products/football/manchester-united-home22.jpg",
    ],
  ])("uses the API image on the card and gallery for %s", (name, image) => {
    render(
      <MemoryRouter>
        <ProductCard product={{ ...product, name, image }} />
        <ProductGallery name={name} image={image} />
      </MemoryRouter>
    );
    const images = screen.getAllByRole("img");
    expect(images).toHaveLength(2);
    for (const img of images) {
      expect(img).toHaveAttribute("src", image);
    }
  });

  it("uses a self-contained placeholder for missing images", () => {
    expect(productImage(product)).toBe(PLACEHOLDER_IMAGE);
    expect(productImage({ ...product, image: null })).toBe(PLACEHOLDER_IMAGE);
    render(<ProductGallery name={product.name} image={null} />);
    expect(screen.getByRole("img")).toHaveAttribute("src", PLACEHOLDER_IMAGE);
  });

  it("falls back after a failed request without retrying a broken URL", () => {
    render(
      <MemoryRouter>
        <ProductCard product={{ ...product, image: "/missing.jpg" }} />
        <ProductGallery name={product.name} image="/missing.jpg" />
      </MemoryRouter>
    );
    for (const img of screen.getAllByRole("img")) {
      fireEvent.error(img);
      expect(img).toHaveAttribute("src", PLACEHOLDER_IMAGE);
      fireEvent.error(img);
      expect(img).toHaveAttribute("src", PLACEHOLDER_IMAGE);
    }
  });

  it("switches gallery photographs and resets when the product changes", () => {
    const front = "/images/products/football/chelsea-home.webp";
    const back = "/images/products/football/chelsea-home-back.webp";
    const { rerender } = render(
      <ProductGallery name={product.name} image={front} gallery={[front, back]} />
    );
    fireEvent.click(screen.getAllByRole("button")[1]);
    expect(screen.getAllByRole("img")[0]).toHaveAttribute("src", back);
    rerender(
      <ProductGallery
        name="Manchester United"
        image="/images/products/football/manchester-united-home22.jpg"
      />
    );
    expect(screen.getByRole("img")).toHaveAttribute(
      "src", "/images/products/football/manchester-united-home22.jpg"
    );
  });
});
