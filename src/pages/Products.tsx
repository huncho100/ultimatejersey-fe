import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react";

import Container from "../components/ui/Container";
import SectionTitle from "../components/ui/SectionTitle";
import ProductCard from "../components/products/ProductCard";
import ProductFilters from "../components/products/ProductFilters";

import { catalogProducts } from "../data/catalog";

export default function Products() {
  const [searchParams] = useSearchParams();

  const isNewFilter =
    searchParams.get("filter") === "new";

  const [filtersOpen, setFiltersOpen] = useState(true);

  // Filter State
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLeagues, setSelectedLeagues] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(250);

  // Sort State
  const [sortBy, setSortBy] = useState(
    isNewFilter ? "newest" : "featured"
  );

  // Category Toggle
  function toggleCategory(category: string) {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category]
    );
  }

  // League Toggle
  function toggleLeague(league: string) {
    setSelectedLeagues((prev) =>
      prev.includes(league)
        ? prev.filter((item) => item !== league)
        : [...prev, league]
    );
  }

  // Brand Toggle
  function toggleBrand(brand: string) {
    setSelectedBrands((prev) =>
      prev.includes(brand)
        ? prev.filter((item) => item !== brand)
        : [...prev, brand]
    );
  }

  // Reset Filters
  function resetFilters() {
    setSelectedCategories([]);
    setSelectedLeagues([]);
    setSelectedBrands([]);
    setMaxPrice(250);

    setSortBy(
      isNewFilter ? "newest" : "featured"
    );
  }

  // Filter + Sort Products
  const filteredProducts = useMemo(() => {
    const filtered = catalogProducts.filter((product) => {
      const categoryMatch =
        selectedCategories.length === 0 ||
        selectedCategories.includes(product.category);

      const leagueMatch =
        selectedLeagues.length === 0 ||
        selectedLeagues.includes(product.league ?? "");

      const brandMatch =
        selectedBrands.length === 0 ||
        selectedBrands.includes(product.brand ?? "");

      const priceMatch = product.price <= maxPrice;

      return (
        categoryMatch &&
        leagueMatch &&
        brandMatch &&
        priceMatch
      );
    });

    switch (sortBy) {
      case "price-low":
        return [...filtered].sort((a, b) => a.price - b.price);

      case "price-high":
        return [...filtered].sort((a, b) => b.price - a.price);

      case "rating":
        return [...filtered].sort((a, b) => b.rating - a.rating);

      case "newest":
        return [...filtered].sort(
          (a, b) => Number(b.isNew) - Number(a.isNew)
        );

      default:
        return filtered;
    }
  }, [
    selectedCategories,
    selectedLeagues,
    selectedBrands,
    maxPrice,
    sortBy,
  ]);

  return (
    <section className="min-h-screen bg-slate-50 py-16">
      <Container>
        <SectionTitle
          title="Our Products"
          subtitle="Browse our collection of official football, basketball, national team, and retro jerseys."
          align="left"
        />

        {/* Top Bar */}

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="
              flex
              items-center
              gap-2
              rounded-xl
              border
              border-slate-300
              bg-white
              px-5
              py-3
              font-semibold
              shadow-sm
              transition-all
              duration-300
              hover:border-blue-500
              hover:text-blue-600
            "
          >
            <SlidersHorizontal size={18} />

            Filters

            {filtersOpen ? (
              <ChevronLeft size={18} />
            ) : (
              <ChevronRight size={18} />
            )}
          </button>

          <div className="flex items-center gap-6">
            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-900">
                {filteredProducts.length}
              </span>{" "}
              products
            </p>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="
                rounded-xl
                border
                border-slate-300
                bg-white
                px-4
                py-2
                text-sm
                font-medium
                shadow-sm
                focus:border-blue-500
                focus:outline-none
              "
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="rating">Highest Rated</option>
              <option value="price-low">Price: Low → High</option>
              <option value="price-high">Price: High → Low</option>
            </select>
          </div>
        </div>

        {/* Layout */}

        <div className="mt-8 flex gap-8">
          <ProductFilters
            open={filtersOpen}
            selectedCategories={selectedCategories}
            onCategoryChange={toggleCategory}
            selectedLeagues={selectedLeagues}
            onLeagueChange={toggleLeague}
            selectedBrands={selectedBrands}
            onBrandChange={toggleBrand}
            maxPrice={maxPrice}
            onPriceChange={setMaxPrice}
            onReset={resetFilters}
          />

          <div
            className={`
              transition-all
              duration-300
              ${filtersOpen ? "flex-1" : "w-full"}
            `}
          >
            <div
              className={`
                grid
                grid-cols-1
                gap-8
                sm:grid-cols-2
                ${
                  filtersOpen
                    ? "xl:grid-cols-3"
                    : "xl:grid-cols-4"
                }
              `}
            >
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}