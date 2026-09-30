import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import MainLayout from "./components/layouts/MainLayout";
import AuthPagesLayout from "./components/layouts/AuthPagesLayout";

// Store Pages
import Home from "./pages/Home";
import Products from "./pages/Products";
import Clubs from "./pages/Clubs";
import NationalTeams from "./pages/NationalTeams";
import Retro from "./pages/Retro";
import ProductDetails from "./pages/ProductDetails";
import Search from "./pages/Search";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Wishlist from "./pages/Wishlist";
import Account from "./pages/Account";
import Orders from "./pages/Orders";

// Informational Pages
import Help from "./pages/Help";
import About from "./pages/About";
import ShippingReturns from "./pages/ShippingReturns";
import NotFound from "./pages/NotFound";

// Authentication Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import PaymentCallback from "./pages/PaymentCallback";

export default function App() {
  return (
    <Router>
      <Routes>

        {/* ==========================
            STORE LAYOUT
        ========================== */}

        <Route element={<MainLayout />}>

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
            path="/clubs"
            element={<Clubs />}
          />

          <Route
            path="/national-teams"
            element={<NationalTeams />}
          />

          <Route
            path="/retro-kits"
            element={<Retro />}
          />

          <Route
            path="/search"
            element={<Search />}
          />

          <Route
            path="/cart"
            element={<Cart />}
          />

          <Route
            path="/checkout"
            element={<Checkout />}
          />

          <Route
            path="/wishlist"
            element={<Wishlist />}
          />

          <Route
            path="/account"
            element={<Account />}
          />

          <Route
            path="/orders"
            element={<Orders />}
          />

          <Route
            path="/payment/callback"
            element={<PaymentCallback />}
          />

          {/* ==========================
              INFORMATIONAL
          ========================== */}

          <Route
            path="/help"
            element={<Help />}
          />

          <Route
            path="/about"
            element={<About />}
          />

          <Route
            path="/shipping-returns"
            element={<ShippingReturns />}
          />

          {/* Anything else, inside the store
              layout so the customer keeps the
              header and footer to leave by. */}

          <Route
            path="*"
            element={<NotFound />}
          />

        </Route>

        {/* ==========================
            AUTH LAYOUT
        ========================== */}

        <Route element={<AuthPagesLayout />}>

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          <Route
            path="/forgot-password"
            element={<ForgotPassword />}
          />

          <Route
            path="/reset-password"
            element={<ResetPassword />}
          />

        </Route>

      </Routes>
    </Router>
  );
}