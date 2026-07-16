export default function Products() {
  const items = [
    { name: "Football Jersey", price: "$49" },
    { name: "Basketball Shoes", price: "$89" },
    { name: "Tennis Racket", price: "$120" },
  ];

  return (
    <section className="min-h-screen p-10 bg-gray-50">
      <h1 className="text-3xl font-bold mb-8">Our Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {items.map((item, idx) => (
          <div key={idx} className="border rounded-lg shadow hover:shadow-lg p-6 text-center bg-white">
            <h2 className="text-xl font-bold mb-2">{item.name}</h2>
            <p className="text-gray-600 mb-4">{item.price}</p>
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
