import Container from "../ui/Container";
import Button from "../ui/Button";
import HeroJerseys from "./HeroJerseys";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900 text-white">

      {/* Background Glow */}
      <div className="absolute -left-32 top-32 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="absolute -right-32 bottom-20 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />

      <Container>
        <div className="relative grid min-h-[75vh] items-center gap-16 py-8 lg:grid-cols-2">

          {/* Left Content */}
          <div>

            {/* Badge */}
            <span className="inline-block rounded-full bg-amber-500 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-900 shadow-lg">
              NEW ARRIVALS
            </span>

            {/* Heading */}
            <h1 className="mt-5 text-4xl font-black leading-[1.05] tracking-tight drop-shadow-xl sm:text-5xl lg:text-6xl">
              Official Jerseys
              <br />
              <span className="text-blue-400">
                for Every Fan
              </span>
            </h1>

            {/* Description */}
            <p className="mt-6 max-w-lg text-base leading-8 text-slate-300">
              Discover authentic jerseys from the world's biggest clubs,
              national teams, and sporting leagues. Whether you're supporting
              your favourite club or your national team, Ultimate Kits has
              something for every fan.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-wrap gap-4">
              <Button size="lg">
                Shop Now
              </Button>

              <Button variant="outline" size="lg">
                Browse Collections
              </Button>
            </div>

            {/* Trust Metrics */}
            <div className="mt-10 grid grid-cols-2 gap-8 sm:grid-cols-4">

              <div>
                <h3 className="text-2xl font-bold text-white">
                  15K+
                </h3>
                <p className="mt-1 text-sm text-slate-300">
                  Happy Fans
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white">
                  500+
                </h3>
                <p className="mt-1 text-sm text-slate-300">
                  Jerseys
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white">
                  120+
                </h3>
                <p className="mt-1 text-sm text-slate-300">
                  Teams
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white">
                  30+
                </h3>
                <p className="mt-1 text-sm text-slate-300">
                  Countries
                </p>
              </div>

            </div>

          </div>

          {/* Right Content */}
          <div className="flex justify-center">
            <HeroJerseys />
          </div>

        </div>
      </Container>
    </section>
  );
}