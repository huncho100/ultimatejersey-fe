import { Outlet } from "react-router-dom";

import Navbar from "./Navbar";
import Footer from "./Footer";
import { useProducts } from "../../context/ProductsContext";

export default function MainLayout() {
  const { products } = useProducts();
  const hasDevelopmentPrices = products.some(
    (product) => product.developmentPlaceholder
  );
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      {hasDevelopmentPrices && (
        <p role="note" className="bg-amber-100 px-4 py-3 text-center text-sm font-semibold text-amber-950">
          Development storefront: marked NGN prices are temporary placeholders,
          not confirmed production prices.
        </p>
      )}

      <main className="mx-auto w-full max-w-7xl flex-1 px-4">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}