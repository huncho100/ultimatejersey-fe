import Container from '../components/ui/Container';
import Button from '../components/ui/Button';

export default function Home() {
  return (
    <section className="bg-gradient-to-r from-blue-500 to-indigo-600 py-20 text-white">
      <Container>
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="mb-4 text-5xl font-extrabold">
            Welcome to the Kit Kings
          </h1>

          <p className="mb-6 text-lg">
            Home of all jerseys, sportswear, and equipment
          </p>

          <Button variant="outline" size="lg">
            Shop Now
          </Button>
        </div>
      </Container>
    </section>
  );
}