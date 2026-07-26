import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import Container from "../ui/Container";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export default function AuthLayout({
  title,
  subtitle,
  children,
}: AuthLayoutProps) {
  return (
    <section className="min-h-[calc(100vh-160px)] bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900 py-16">
      <Container>

        <div className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl bg-white shadow-2xl lg:grid-cols-2">

          {/* Left Side */}

          <div className="flex flex-col justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-12 text-white">

            <Link
              to="/"
              className="text-3xl font-black tracking-tight"
            >
              Ultimate Kits
            </Link>

            <span className="mt-3 inline-block w-fit rounded-full bg-amber-500 px-4 py-1 text-xs font-bold uppercase tracking-[0.2em] text-slate-900">
              Official Jerseys
            </span>

            <h2 className="mt-10 text-5xl font-black leading-tight">
              Wear Your
              <br />
              Passion.
            </h2>

            <p className="mt-6 max-w-md text-lg leading-8 text-slate-300">
              Shop authentic football, basketball, national team
              and retro jerseys from the world's biggest clubs.
            </p>

            <div className="mt-12 grid grid-cols-2 gap-8">

              <div>
                <h3 className="text-3xl font-bold">
                  15K+
                </h3>

                <p className="mt-1 text-slate-300">
                  Happy Fans
                </p>
              </div>

              <div>
                <h3 className="text-3xl font-bold">
                  500+
                </h3>

                <p className="mt-1 text-slate-300">
                  Jerseys
                </p>
              </div>

              <div>
                <h3 className="text-3xl font-bold">
                  120+
                </h3>

                <p className="mt-1 text-slate-300">
                  Teams
                </p>
              </div>

              <div>
                <h3 className="text-3xl font-bold">
                  30+
                </h3>

                <p className="mt-1 text-slate-300">
                  Countries
                </p>
              </div>

            </div>

          </div>

          {/* Right Side */}

          <div className="flex items-center justify-center bg-white p-10">

            <div className="w-full max-w-md">

              <h1 className="text-4xl font-black text-slate-900">
                {title}
              </h1>

              <p className="mt-3 text-slate-500">
                {subtitle}
              </p>

              <div className="mt-10">
                {children}
              </div>

            </div>

          </div>

        </div>

      </Container>
    </section>
  );
}