import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search as SearchIcon, X } from "lucide-react";

import Container from "../components/ui/Container";
import SectionTitle from "../components/ui/SectionTitle";
import ProductCard from "../components/products/ProductCard";

import { footballProducts } from "../data/football";

export default function Search() {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const search = query.trim().toLowerCase();

    if (!search) return [];

    return footballProducts.filter((product) => {
      return (
        product.team.toLowerCase().includes(search) ||
        product.name.toLowerCase().includes(search) ||
        product.sport.toLowerCase().includes(search) ||
        product.category.toLowerCase().includes(search) ||
        product.brand?.toLowerCase().includes(search) ||
        product.league?.toLowerCase().includes(search)
      );
    });
  }, [query]);

  const suggestions = results.slice(0, 5);

  return (
    <section className="min-h-screen bg-slate-50 py-14">
      <Container>

        <SectionTitle
          title="Search Jerseys"
          subtitle="Search by club, player, league, brand or competition."
          align="left"
        />

        {/* Search */}

        <div className="relative mt-10">

          <SearchIcon
            size={20}
            className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Manchester United, Chelsea, Haaland..."
            className="
              w-full
              rounded-2xl
              border
              border-slate-300
              bg-white
              py-4
              pl-14
              pr-14
              text-lg
              outline-none
              transition
              focus:border-blue-600
              focus:ring-4
              focus:ring-blue-100
            "
          />

          {query && (
            <button
              onClick={() => setQuery("")}
              className="
                absolute
                right-5
                top-1/2
                -translate-y-1/2
                rounded-full
                p-1
                text-slate-400
                transition
                hover:bg-slate-100
                hover:text-slate-700
              "
            >
              <X size={18} />
            </button>
          )}

          {/* Suggestions */}

          {query && suggestions.length > 0 && (
            <div
              className="
                absolute
                left-0
                right-0
                top-full
                z-20
                mt-2
                overflow-hidden
                rounded-2xl
                border
                border-slate-200
                bg-white
                shadow-xl
              "
            >
              {suggestions.map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  className="
                    flex
                    items-center
                    gap-4
                    px-5
                    py-3
                    transition
                    hover:bg-slate-50
                  "
                >
                  <img
                    src={product.image}
                    alt={product.team}
                    className="h-12 w-12 rounded-lg object-contain"
                  />

                  <div>
                    <p className="font-semibold">
                      {product.team}
                    </p>

                    <p className="text-sm text-slate-500">
                      {product.name}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}

        </div>

        {/* States */}

        {!query ? (
          <div className="mt-20 text-center">

            <h3 className="text-2xl font-bold text-slate-700">
              Start typing to search
            </h3>

            <p className="mt-3 text-slate-500">
              Search clubs, players, leagues or jersey names.
            </p>

          </div>
        ) : results.length === 0 ? (
          <div className="mt-20 text-center">

            <h3 className="text-2xl font-bold text-slate-700">
              No results found
            </h3>

            <p className="mt-3 text-slate-500">
              Try another search term.
            </p>

          </div>
        ) : (
          <>
            <p className="mt-10 text-slate-600">
              Showing{" "}
              <span className="font-semibold">
                {results.length}
              </span>{" "}
              result{results.length > 1 ? "s" : ""} for{" "}
              <span className="font-semibold text-slate-900">
                "{query}"
              </span>
            </p>

            <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-4">
              {results.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          </>
        )}

      </Container>
    </section>
  );
}