/**
 * ===========================================
 * Product Description Tab
 * ===========================================
 *
 * The empty state is the important case: most
 * products have no description, and the tab has to
 * say so rather than show invented copy.
 */

import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import ProductDescription from "./ProductDescription";

const EMPTY_STATE =
  "No description has been published for this product yet.";

describe("ProductDescription", () => {
  it("renders a published description", () => {
    render(
      <ProductDescription description="Official home shirt." />
    );

    expect(
      screen.getByText("Official home shirt.")
    ).toBeInTheDocument();

    expect(
      screen.queryByText(EMPTY_STATE)
    ).not.toBeInTheDocument();
  });

  it("shows the empty state when null", () => {
    render(<ProductDescription description={null} />);

    expect(
      screen.getByText(EMPTY_STATE)
    ).toBeInTheDocument();
  });

  it("shows the empty state when undefined", () => {
    render(<ProductDescription />);

    expect(
      screen.getByText(EMPTY_STATE)
    ).toBeInTheDocument();
  });

  it("shows the empty state for whitespace only", () => {
    render(
      <ProductDescription description={"   \n  "} />
    );

    expect(
      screen.getByText(EMPTY_STATE)
    ).toBeInTheDocument();
  });

  it("trims surrounding whitespace", () => {
    render(
      <ProductDescription description="  Official home shirt.  " />
    );

    expect(
      screen.getByText("Official home shirt.")
    ).toBeInTheDocument();
  });

  it("keeps paragraph breaks in the rendered text", () => {
    const text = "First paragraph.\n\nSecond paragraph.";

    render(<ProductDescription description={text} />);

    const paragraph = screen.getByText(
      (_, element) =>
        element?.textContent === text &&
        element.tagName === "P"
    );

    // whitespace-pre-line is what makes the breaks an
    // administrator typed survive to the page.
    expect(paragraph).toHaveClass("whitespace-pre-line");
  });

  it("does not invent features or claims", () => {
    render(<ProductDescription description={null} />);

    // The tab once listed "Official licensed product"
    // and "Breathable fabric technology" against every
    // product in the store. Those are seller claims and
    // no product record supports them.
    expect(
      screen.queryByText(/licensed/i)
    ).not.toBeInTheDocument();

    expect(
      screen.queryByText(/fabric/i)
    ).not.toBeInTheDocument();

    expect(
      screen.queryByText(/moisture/i)
    ).not.toBeInTheDocument();
  });
});
