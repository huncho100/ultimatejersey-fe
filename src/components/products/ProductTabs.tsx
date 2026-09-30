import { useRef, useState } from "react";

import ProductDescription from "./ProductDescription";
import ProductReviews from "./ProductReviews";
import ProductPolicies from "./ProductPolicies";

import type { Product } from "../../types/product";

/**
 * ===========================================
 * Product Tabs
 * ===========================================
 *
 * Description, Reviews, and Shipping & Returns.
 *
 * These three were previously three buttons that did
 * nothing: the description was always on screen and
 * the other two tabs could be clicked for ever
 * without changing anything. They now select, and
 * each panel shows what the store actually holds.
 */

const TABS = [
  { id: "description", label: "Description" },
  { id: "reviews", label: "Reviews" },
  {
    id: "shipping",
    label: "Shipping & Returns",
  },
] as const;

type TabId = (typeof TABS)[number]["id"];

interface ProductTabsProps {
  product: Product;
}

export default function ProductTabs({
  product,
}: ProductTabsProps) {
  const [active, setActive] =
    useState<TabId>("description");

  const buttons = useRef<
    Array<HTMLButtonElement | null>
  >([]);

  /**
   * Arrow keys move between tabs, which is what a
   * keyboard user expects of a tablist and what a
   * row of plain buttons does not give them.
   */
  function handleKeyDown(
    event: React.KeyboardEvent,
    index: number
  ) {
    const last = TABS.length - 1;

    let next: number | null = null;

    if (event.key === "ArrowRight") {
      next = index === last ? 0 : index + 1;
    } else if (event.key === "ArrowLeft") {
      next = index === 0 ? last : index - 1;
    } else if (event.key === "Home") {
      next = 0;
    } else if (event.key === "End") {
      next = last;
    }

    if (next === null) return;

    event.preventDefault();

    setActive(TABS[next].id);
    buttons.current[next]?.focus();
  }

  return (
    <section className="mt-20">

      {/* Tabs */}

      <div className="border-b border-slate-200">

        <div
          role="tablist"
          aria-label="Product information"
          className="flex gap-6 overflow-x-auto sm:gap-10"
        >

          {TABS.map((tab, index) => {
            const selected = active === tab.id;

            return (
              <button
                key={tab.id}
                ref={(element) => {
                  buttons.current[index] = element;
                }}
                type="button"
                role="tab"
                id={`tab-${tab.id}`}
                aria-controls={`panel-${tab.id}`}
                aria-selected={selected}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(tab.id)}
                onKeyDown={(event) =>
                  handleKeyDown(event, index)
                }
                className={`
                  whitespace-nowrap
                  border-b-2
                  pb-4
                  transition

                  ${
                    selected
                      ? "border-blue-600 font-semibold text-blue-600"
                      : "border-transparent text-slate-500 hover:text-slate-900"
                  }
                `}
              >
                {tab.label}
              </button>
            );
          })}

        </div>

      </div>

      {/* Panel */}

      <div
        role="tabpanel"
        id={`panel-${active}`}
        aria-labelledby={`tab-${active}`}
        tabIndex={0}
        className="
          rounded-b-3xl
          border
          border-t-0
          border-slate-200
          bg-white
          p-6
          shadow-sm
          sm:p-10
        "
      >

        {active === "description" && (
          <ProductDescription
            description={product.description}
          />
        )}

        {active === "reviews" && (
          <ProductReviews product={product} />
        )}

        {active === "shipping" && (
          <ProductPolicies />
        )}

      </div>

    </section>
  );
}
