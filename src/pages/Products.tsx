import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react";

import Container from "../components/ui/Container";
import SectionTitle from "../components/ui/SectionTitle";
import ProductCard from "../components/products/ProductCard";
import ProductFilters from "../components/products/ProductFilters";

import { products } from "../data/products";

export default function Products() {
  const [filtersOpen, setFiltersOpen] = useState(true);

  return (
    <section className="min-h-screen bg-slate-50 py-16">
      <Container>

        <SectionTitle
          title="Our Products"
          subtitle="Browse our collection of official football, basketball, national team, and retro jerseys."
          align="left"
        />

        {/* Top Bar */}

        <div className="mt-10 flex items-center justify-between">

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

          <p className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-900">
              {products.length}
            </span>{" "}
            products
          </p>

        </div>

        {/* Layout */}

        <div className="mt-8 flex gap-8">

          {/* Sidebar */}

          <ProductFilters open={filtersOpen} />

          {/* Products */}

          <div
            className={`
              transition-all
              duration-300

              ${
                filtersOpen
                  ? "flex-1"
                  : "w-full"
              }
            `}
          >
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-4">

              {products.map((product) => (
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