import ProductCard from "../components/ProductCard";

const mockProducts = [
  { id: 1, name: "Club Jersey", price: 50.99, image: "/images/jersey.jpg" },
  { id: 2, name: "Country Jersey", price: 50.99, image: "/images/jersey.jpg" },
  { id: 3, name: "Football Jersey", price: 49.99, image: "/images/jersey.jpg" },
  { id: 4, name: "Basketball Shoes", price: 89.99, image: "/images/shoes.jpg" },
  { id: 5, name: "Running Shoes", price: 120.00, image: "/images/shoes.jpg" },
];

export default function Products() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      {mockProducts.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
