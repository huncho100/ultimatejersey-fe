import Container from "../components/ui/Container";
import SectionTitle from "../components/ui/SectionTitle";
import ProductCard from "../components/products/ProductCard";

import { products } from "../data/products";

export default function Products() {
  return (
    <section className="min-h-screen bg-slate-50 py-16">
      <Container>
        <SectionTitle
          title="Our Products"
          subtitle="Browse our collection of official football, basketball, national team, and retro jerseys."
          align="left"
        />

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-4">
          {products.map((product) => (
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