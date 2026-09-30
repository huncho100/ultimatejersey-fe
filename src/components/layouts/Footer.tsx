import { Link } from "react-router-dom";

import Container from "../ui/Container";

import { footerNavigation } from "../../constants/navigation";

/**
 * ===========================================
 * Footer
 * ===========================================
 *
 * The footer was one line of copyright, under
 * somebody else's name -- "SportShop" -- and with no
 * way out of it. It now carries the informational
 * pages, which are otherwise unreachable, and the
 * store's own name.
 *
 * Link groups come from constants/navigation.ts,
 * where every path is a declared route.
 */

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-10 border-t border-slate-800 bg-slate-900 text-slate-300">
      <Container>

        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}

          <div>

            <p className="text-lg font-extrabold text-white">
              Ultimate Kits
            </p>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              Football and basketball kits, priced
              and paid for in Nigerian Naira.
            </p>

          </div>

          {/* Link Groups */}

          {footerNavigation.map((group) => (

            <nav
              key={group.title}
              aria-label={group.title}
            >

              <h2 className="text-sm font-bold uppercase tracking-wide text-white">
                {group.title}
              </h2>

              <ul className="mt-4 space-y-3">

                {group.items.map((item) => (

                  <li key={item.path}>

                    <Link
                      to={item.path}
                      className="
                        text-sm
                        transition-colors
                        hover:text-blue-400
                      "
                    >
                      {item.label}
                    </Link>

                  </li>

                ))}

              </ul>

            </nav>

          ))}

        </div>

        <div className="border-t border-slate-800 py-6">

          <p className="text-center text-sm text-slate-400">
            © {year} Ultimate Kits. All rights
            reserved.
          </p>

        </div>

      </Container>
    </footer>
  );
}
