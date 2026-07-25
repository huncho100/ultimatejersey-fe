import { useMemo, useState } from "react";

import { retroProducts } from "../data/retro";

import type { ClubFiltersState } from "../types/filter";

import Container from "../components/ui/Container";
import SectionTitle from "../components/ui/SectionTitle";

import ClubSearch from "../components/clubs/ClubSearch";
import ClubFilters from "../components/clubs/ClubFilters";
import ClubGrid from "../components/clubs/ClubGrid";

import CatalogToolbar from "../components/catalog/CatalogToolbar";

const defaultFilters: ClubFiltersState = {
  leagues: [],
  brands: [],
  categories: [],
};

export default function Retro() {
  const [search, setSearch] = useState("");

  const [filters, setFilters] =
    useState<ClubFiltersState>(defaultFilters);

  const [sortBy, setSortBy] =
    useState("featured");

  const filteredProducts = useMemo(() => {
    const query = search.toLowerCase().trim();

    const results = retroProducts.filter((product) => {
      const matchesSearch =
        !query ||
        product.team.toLowerCase().includes(query) ||
        product.name.toLowerCase().includes(query) ||
        product.brand?.toLowerCase().includes(query) ||
        product.league?.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query);

      const matchesLeague =
        filters.leagues.length === 0 ||
        filters.leagues.includes(product.league ?? "");

      const matchesBrand =
        filters.brands.length === 0 ||
        filters.brands.includes(product.brand ?? "");

      const matchesCategory =
        filters.categories.length === 0 ||
        filters.categories.includes(product.category);

      return (
        matchesSearch &&
        matchesLeague &&
        matchesBrand &&
        matchesCategory
      );
    });

    switch (sortBy) {
      case "price-low":
        results.sort((a, b) => a.price - b.price);
        break;

      case "price-high":
        results.sort((a, b) => b.price - a.price);
        break;

      case "rating":
        results.sort((a, b) => b.rating - a.rating);
        break;

      case "newest":
        results.sort((a, b) => {
          if (a.isNew && !b.isNew) return -1;
          if (!a.isNew && b.isNew) return 1;
          return 0;
        });
        break;

      default:
        results.sort((a, b) => {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return 0;
        });
    }

    return results;
  }, [search, filters, sortBy]);

  return (
    <section className="min-h-screen bg-slate-50 py-16">
      <Container>
        <SectionTitle
          title="Retro Kits"
          subtitle="Relive football's greatest moments with iconic retro jerseys."
          align="left"
        />

        <div className="mt-8">
          <ClubSearch
            value={search}
            onChange={setSearch}
          />
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[280px_1fr]">
          <ClubFilters
            products={retroProducts}
            filters={filters}
            onChange={setFilters}
          />

          <div>
            <CatalogToolbar
              total={retroProducts.length}
              showing={filteredProducts.length}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />

            <ClubGrid
              products={filteredProducts}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}