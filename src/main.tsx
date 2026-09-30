import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import "./index.css";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { ProductsProvider } from "./context/ProductsContext";
import { ToastProvider } from "./components/ui/Toast";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>

    {/*
      Outermost, so that any part of the tree can
      raise a notification, and so the viewport is
      rendered above everything the routes draw.
    */}
    <ToastProvider>

      <AuthProvider>

        <ProductsProvider>

          <WishlistProvider>

            <CartProvider>

              <App />

            </CartProvider>

          </WishlistProvider>

        </ProductsProvider>

      </AuthProvider>

    </ToastProvider>

  </React.StrictMode>
);