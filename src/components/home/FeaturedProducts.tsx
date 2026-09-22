import Container from "../ui/Container";
import SectionTitle from "../ui/SectionTitle";
import ProductCard from "../products/ProductCard";
import CatalogState from "../catalog/CatalogState";

import { useProducts } from "../../context/ProductsContext";

export default function FeaturedProducts() {
  const { products, loading, error, reload } = useProducts();

  const featuredProducts = products
    .filter((product) => product.isFeatured)
    .slice(0, 8);

  // Nothing has been marked featured, so there is
  // no section to show.
  if (!loading && !error && featuredProducts.length === 0) {
    return null;
  }

  return (
    <section className="bg-slate-50 py-20">
      <Container>

        <SectionTitle
          title="Featured Jerseys"
          subtitle="Discover some of our most popular jerseys from clubs, national teams, basketball, and retro collections."
        />

        {loading || error ? (
          <div className="mt-12">
            <CatalogState
              loading={loading}
              error={error}
              onRetry={reload}
            />
          </div>
        ) : (
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        )}

      </Container>
    </section>
  );
}
