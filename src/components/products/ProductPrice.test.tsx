import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import ProductPrice from "./ProductPrice";

describe("ProductPrice provenance", () => {
  it("labels temporary prices rather than presenting them as approved", () => {
    render(<ProductPrice price={25000} developmentPlaceholder />);
    expect(screen.getByText("Development price - not production approved")).toBeInTheDocument();
  });

  it("does not label an approved price as a placeholder", () => {
    render(<ProductPrice price={25000} />);
    expect(screen.queryByText("Development price - not production approved")).not.toBeInTheDocument();
  });
});
