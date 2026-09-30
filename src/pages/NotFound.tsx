import { Link } from "react-router-dom";

import Container from "../components/ui/Container";
import Button from "../components/ui/Button";

/**
 * ===========================================
 * Not Found
 * ===========================================
 *
 * Any address that matches no route. Without this,
 * an old link or a typed URL rendered the header and
 * footer around nothing at all, which reads as a
 * broken site rather than a wrong address.
 */

export default function NotFound() {
  return (
    <section className="min-h-screen bg-slate-50 py-20">
      <Container>

        <div className="mx-auto max-w-xl text-center">

          <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
            404
          </p>

          <h1 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl">
            We can't find that page
          </h1>

          <p className="mt-4 text-slate-600">
            The link may be out of date, or the
            address may have been mistyped.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">

            <Link to="/">
              <Button>Go Home</Button>
            </Link>

            <Link to="/products">
              <Button variant="outline">
                Browse Kits
              </Button>
            </Link>

            <Link to="/help">
              <Button variant="outline">
                Help
              </Button>
            </Link>

          </div>

        </div>

      </Container>
    </section>
  );
}
