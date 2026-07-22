import { useState } from "react";
import { NavLink } from "react-router-dom";

import {
  Heart,
  Menu,
  Search,
  ShoppingCart,
  User,
  X,
} from "lucide-react";

import { navigation } from "../../constants/navigation";

import Container from "../ui/Container";
import Logo from "../ui/Logo";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900/95 text-white shadow-lg backdrop-blur-md">
      <Container>
        <nav className="flex h-20 items-center justify-between">

          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <ul className="hidden items-center gap-8 lg:flex">
            {navigation.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `font-medium transition-colors duration-300 hover:text-blue-400 ${
                      isActive ? "text-blue-400" : "text-slate-200"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Desktop Icons */}
          <div className="hidden items-center gap-4 lg:flex">

            <NavLink
              to="/search"
              className="rounded-full p-2 transition-all duration-300 hover:bg-slate-800 hover:text-blue-400"
              aria-label="Search"
            >
              <Search size={20} />
            </NavLink>

            <button
              className="rounded-full p-2 transition-all duration-300 hover:bg-slate-800 hover:text-blue-400"
              aria-label="Wishlist"
            >
              <Heart size={20} />
            </button>

            <button
              className="rounded-full p-2 transition-all duration-300 hover:bg-slate-800 hover:text-blue-400"
              aria-label="Shopping Cart"
            >
              <ShoppingCart size={20} />
            </button>

            <button
              className="rounded-full p-2 transition-all duration-300 hover:bg-slate-800 hover:text-blue-400"
              aria-label="User Account"
            >
              <User size={20} />
            </button>

          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 transition-colors duration-300 hover:bg-slate-800 lg:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

        </nav>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="border-t border-slate-800 bg-slate-900 py-5 lg:hidden">

            <ul className="flex flex-col gap-5">
              {navigation.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `block text-lg transition-colors duration-300 hover:text-blue-400 ${
                        isActive ? "text-blue-400" : "text-slate-200"
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>

            {/* Mobile Icons */}
            <div className="mt-8 flex gap-4">

              <NavLink
                to="/search"
                onClick={() => setMobileOpen(false)}
                className="rounded-full bg-slate-800 p-3 transition-all duration-300 hover:bg-blue-600"
                aria-label="Search"
              >
                <Search size={20} />
              </NavLink>

              <button
                className="rounded-full bg-slate-800 p-3 transition-all duration-300 hover:bg-blue-600"
                aria-label="Wishlist"
              >
                <Heart size={20} />
              </button>

              <button
                className="rounded-full bg-slate-800 p-3 transition-all duration-300 hover:bg-blue-600"
                aria-label="Shopping Cart"
              >
                <ShoppingCart size={20} />
              </button>

              <button
                className="rounded-full bg-slate-800 p-3 transition-all duration-300 hover:bg-blue-600"
                aria-label="User Account"
              >
                <User size={20} />
              </button>

            </div>

          </div>
        )}
      </Container>
    </header>
  );
}