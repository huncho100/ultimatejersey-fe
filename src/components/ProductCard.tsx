type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
};

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="border rounded-lg shadow hover:shadow-lg p-4">
      <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded" />
      <h2 className="text-lg font-semibold mt-2">{product.name}</h2>
      <p className="text-blue-600 font-bold">${product.price}</p>
      <button className="bg-blue-600 text-white px-4 py-2 mt-2 rounded hover:bg-blue-700">
        Add to Cart
      </button>
    </div>
  );
}
