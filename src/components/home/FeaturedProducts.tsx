import Container from "../ui/Container";
import SectionTitle from "../ui/SectionTitle";
import ProductCard from "../products/ProductCard";

import { featuredProducts } from "../../data/products";

export default function FeaturedProducts() {
  return (
    <section className="bg-slate-50 py-20">
      <Container>
        <SectionTitle
          title="Featured Jerseys"
          subtitle="Discover some of our most popular jerseys from clubs and national teams around the world."
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