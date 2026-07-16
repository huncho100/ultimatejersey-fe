import Container from '../components/ui/Container';
import Button from '../components/ui/Button';

const items = [
  { name: 'Football Jersey', price: '$49' },
  { name: 'Basketball Shoes', price: '$89' },
  { name: 'Tennis Racket', price: '$120' },
];

export default function Products() {
  return (
    <section className="min-h-screen bg-gray-50 py-10">
      <Container>
        <h1 className="mb-8 text-3xl font-bold">Our Products</h1>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.name}
              className="rounded-lg border bg-white p-6 text-center shadow transition-shadow hover:shadow-lg"
            >
              <h2 className="mb-2 text-xl font-bold">{item.name}</h2>

              <p className="mb-4 text-gray-600">{item.price}</p>

              <Button size="sm">
                Add to Cart
              </Button>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}