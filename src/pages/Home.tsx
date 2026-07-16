export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center text-center py-20 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
      <h1 className="text-5xl font-extrabold mb-4">Welcome to the Kit Kings</h1>
      <p className="text-lg mb-6">Home of all jerseys, sportswear, and equipment</p>
      <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition">
        Shop Now
      </button>
    </section>
  );
}
