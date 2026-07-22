import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  RotateCcw,
} from "lucide-react";

interface ProductFiltersProps {
  open: boolean;
}

export default function ProductFilters({
  open,
}: ProductFiltersProps) {
  const [categoryOpen, setCategoryOpen] = useState(true);
  const [leagueOpen, setLeagueOpen] = useState(true);
  const [brandOpen, setBrandOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);

  return (
    <aside
      className={`
        overflow-hidden
        transition-all
        duration-300
        ${open ? "w-72 opacity-100" : "w-0 opacity-0"}
      `}
    >
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

        {/* Header */}

        <div className="mb-6 flex items-center justify-between">

          <h2 className="text-xl font-bold">
            Filters
          </h2>

          <button className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700">
            <RotateCcw size={16} />
            Reset
          </button>

        </div>

        {/* CATEGORY */}

        <section className="border-b py-4">

          <button
            onClick={() => setCategoryOpen(!categoryOpen)}
            className="flex w-full items-center justify-between font-semibold"
          >
            Category

            {categoryOpen ? (
              <ChevronUp size={18} />
            ) : (
              <ChevronDown size={18} />
            )}

          </button>

          {categoryOpen && (

            <div className="mt-4 space-y-3">

              {[
                "Home",
                "Away",
                "Third Kit",
                "Player Edition",
              ].map((item) => (
                <label
                  key={item}
                  className="flex items-center gap-3 text-sm"
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded"
                  />

                  {item}

                </label>
              ))}

            </div>

          )}

        </section>

        {/* LEAGUE */}

        <section className="border-b py-4">

          <button
            onClick={() => setLeagueOpen(!leagueOpen)}
            className="flex w-full items-center justify-between font-semibold"
          >
            League

            {leagueOpen ? (
              <ChevronUp size={18} />
            ) : (
              <ChevronDown size={18} />
            )}

          </button>

          {leagueOpen && (

            <div className="mt-4 space-y-3">

              {[
                "Premier League",
                "La Liga",
                "NBA",
              ].map((item) => (
                <label
                  key={item}
                  className="flex items-center gap-3 text-sm"
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded"
                  />

                  {item}

                </label>
              ))}

            </div>

          )}

        </section>

        {/* BRAND */}

        <section className="border-b py-4">

          <button
            onClick={() => setBrandOpen(!brandOpen)}
            className="flex w-full items-center justify-between font-semibold"
          >
            Brand

            {brandOpen ? (
              <ChevronUp size={18} />
            ) : (
              <ChevronDown size={18} />
            )}

          </button>

          {brandOpen && (

            <div className="mt-4 space-y-3">

              {[
                "Nike",
                "Adidas",
                "Puma",
              ].map((item) => (
                <label
                  key={item}
                  className="flex items-center gap-3 text-sm"
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded"
                  />

                  {item}

                </label>
              ))}

            </div>

          )}

        </section>

        {/* PRICE */}

        <section className="pt-4">

          <button
            onClick={() => setPriceOpen(!priceOpen)}
            className="mb-4 flex w-full items-center justify-between font-semibold"
          >
            Price

            {priceOpen ? (
              <ChevronUp size={18} />
            ) : (
              <ChevronDown size={18} />
            )}

          </button>

          {priceOpen && (
            <>
              <input
                type="range"
                min={50}
                max={250}
                defaultValue={250}
                className="w-full accent-blue-600"
              />

              <div className="mt-3 flex justify-between text-sm text-slate-500">
                <span>$50</span>
                <span>$250</span>
              </div>
            </>
          )}

        </section>

      </div>
    </aside>
  );
}