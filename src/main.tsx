import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import "./index.css";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { ProductsProvider } from "./context/ProductsContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>

    <AuthProvider>

      <ProductsProvider>

        <WishlistProvider>

          <CartProvider>

            <App />

          </CartProvider>

        </WishlistProvider>

      </ProductsProvider>

    </AuthProvider>

  </React.StrictMode>
);