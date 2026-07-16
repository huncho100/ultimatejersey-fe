export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-gray-900 text-white">
      <h1 className="text-2xl font-bold">SportShop</h1>
      <ul className="flex space-x-6 list-none">
        <li><a href="/" className="hover:text-blue-400">Home</a></li>
        <li><a href="/products" className="hover:text-blue-400">Products</a></li>
        <li><a href="/cart" className="hover:text-blue-400">Cart</a></li>
      </ul>
    </nav>
  );
}