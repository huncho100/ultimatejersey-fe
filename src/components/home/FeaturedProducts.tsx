import Container from "../ui/Container";
import SectionTitle from "../ui/SectionTitle";
import ProductCard from "../products/ProductCard";

import { catalogProducts } from "../../data/catalog";

export default function FeaturedProducts() {
  const featuredProducts = catalogProducts
    .filter((product) => product.isFeatured)
    .slice(0, 8);

  return (
    <section className="bg-slate-50 py-20">
      <Container>

        <SectionTitle
          title="Featured Jerseys"
          subtitle="Discover some of our most popular jerseys from clubs, national teams, basketball, and retro collections."
        />

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>

      </Container>
    </section>
  );
}