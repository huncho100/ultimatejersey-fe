import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import ProductGallery from "./ProductGallery";
import { PLACEHOLDER_IMAGE } from "../../utils/catalog";

describe("ProductGallery", () => {
  it("renders the primary image and switches to a selected thumbnail", () => {
    render(
      <ProductGallery
        image="/images/products/football/arsenal-home.jpg"
        gallery={[
          "/images/products/football/arsenal-home.jpg",
          "/images/products/football/liverpool-home.jpg",
        ]}
        name="Test Jersey"
      />
    );

    const mainImage = screen.getByRole("img", {
      name: "Test Jersey",
    });
    expect(mainImage).toHaveAttribute(
      "src",
      "/images/products/football/arsenal-home.jpg"
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Show image 2 of Test Jersey",
      })
    );

    expect(mainImage).toHaveAttribute(
      "src",
      "/images/products/football/liverpool-home.jpg"
    );
  });

  it("uses the placeholder and reports a failed image path", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    render(
      <ProductGallery
        image="/images/products/football/missing.jpg"
        name="Missing Jersey"
      />
    );

    const mainImage = screen.getByRole("img", {
      name: "Missing Jersey",
    });
    fireEvent.error(mainImage);

    expect(mainImage).toHaveAttribute("src", PLACEHOLDER_IMAGE);
    expect(error).toHaveBeenCalledWith(
      "Product image failed to load:",
      "/images/products/football/missing.jpg"
    );
    error.mockRestore();
  });
});
