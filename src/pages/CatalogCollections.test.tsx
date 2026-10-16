import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useProducts } from "../context/ProductsContext";
import type { Product } from "../types/product";
import NationalTeams from "./NationalTeams";
import Retro from "./Retro";
import Basketball from "./Basketball";
import Products from "./Products";

vi.mock("../context/ProductsContext", () => ({
  useProducts: vi.fn(),
}));
vi.mock("../components/products/ProductCard", () => ({
  default: ({ product }: { product: Product }) => (
    <article>{product.name}</article>
  ),
}));

const club: Product = {
  id: 1, name: "Club Home", sport: "Football", category: "Jerseys",
  league: "Premier League", price: 25000, rating: 0, inStock: true,
};
const national: Product = {
  ...club, id: 2, name: "Country Home", league: " National Team ",
};
const retro: Product = {
  ...national, id: 3, name: "Country Classic", category: " retro ",
};
const basketball: Product = {
  ...club, id: 4, name: "Basketball No. 23", sport: "Basketball", league: "NBA",
};
const reload = vi.fn();

beforeEach(() => {
  vi.mocked(useProducts).mockReturnValue({
    products: [club, national, retro, basketball],
    loading: false, error: null, reload,
  });
  reload.mockReset();
});

describe("catalog collection rendering", () => {
  it("includes national retro once and excludes clubs/basketball from National Teams", () => {
    render(<MemoryRouter><NationalTeams /></MemoryRouter>);
    expect(screen.getByText("Country Home")).toBeInTheDocument();
    expect(screen.getAllByText("Country Classic")).toHaveLength(1);
    expect(screen.queryByText("Club Home")).not.toBeInTheDocument();
    expect(screen.queryByText("Basketball No. 23")).not.toBeInTheDocument();
  });

  it("renders Retro by category without duplicating national products", () => {
    render(<MemoryRouter><Retro /></MemoryRouter>);
    expect(screen.getAllByText("Country Classic")).toHaveLength(1);
    expect(screen.queryByText("Country Home")).not.toBeInTheDocument();
  });

  it("shows only Basketball designs on its collection page", () => {
    render(<MemoryRouter><Basketball /></MemoryRouter>);
    expect(screen.getByText("Basketball No. 23")).toBeInTheDocument();
    expect(screen.queryByText("Club Home")).not.toBeInTheDocument();
  });

  it("keeps the full product listing and search behavior", () => {
    render(<MemoryRouter><Products /></MemoryRouter>);
    expect(screen.getAllByRole("article")).toHaveLength(4);
    fireEvent.change(screen.getByRole("searchbox"), {
      target: { value: "classic" },
    });
    expect(screen.getAllByRole("article")).toHaveLength(1);
    expect(screen.getByText("Country Classic")).toBeInTheDocument();
  });

  it("distinguishes an empty collection from an API error and supports retry", () => {
    vi.mocked(useProducts).mockReturnValue({
      products: [], loading: false, error: null, reload,
    });
    const view = render(<MemoryRouter><NationalTeams /></MemoryRouter>);
    expect(screen.getByText("No national team jerseys yet")).toBeInTheDocument();
    vi.mocked(useProducts).mockReturnValue({
      products: [], loading: false, error: "Catalog API unavailable", reload,
    });
    view.rerender(<MemoryRouter><NationalTeams /></MemoryRouter>);
    expect(screen.getByText("Catalog API unavailable")).toBeInTheDocument();
    expect(screen.queryByText("No national team jerseys yet")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Try Again" }));
    expect(reload).toHaveBeenCalledOnce();
  });
});
