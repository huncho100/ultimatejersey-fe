import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/layouts/Navbar";
import Footer from "./components/layouts/Footer";

import Home from "./pages/Home";
import Products from "./pages/Products";
import Clubs from "./pages/Clubs";
import ProductDetails from "./pages/ProductDetails";
import Search from "./pages/Search";
import Cart from "./pages/Cart";

export default function App() {
  return (
    <Router>
      <div className="flex min-h-screen flex-col">

        <Navbar />

        <main className="mx-auto w-full max-w-7xl flex-1 px-4">
          <Routes>

            <Route
              path="/"
              element={<Home />}
            />

            <Route
              path="/products"
              element={<Products />}
            />

            <Route
              path="/products/:id"
              element={<ProductDetails />}
            />

            <Route
              path="/cart"
              element={<Cart />}
            />

            <Route
              path="/clubs"
              element={<Clubs />}
            />

            <Route
              path="/search"
              element={<Search />}
            />

          </Routes>
        </main>

        <Footer />

      </div>
    </Router>
  );
}