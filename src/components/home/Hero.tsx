import Container from "../ui/Container";
import Button from "../ui/Button";

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white">
      <Container>
        <div className="grid min-h-[80vh] items-center gap-12 py-16 lg:grid-cols-2">
          {/* Left Content */}
          <div>
            <span className="inline-block rounded-full bg-amber-500 px-4 py-1 text-sm font-semibold uppercase tracking-wider text-slate-900">
              New Arrivals
            </span>

            <h1 className="mt-6 text-5xl font-extrabold leading-tight lg:text-6xl">
              Official Jerseys
              <br />
              <span className="text-blue-400">for Every Fan</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
              "Discover authentic jerseys from the world's biggest clubs,
              national teams, and sporting leagues.
              Whether you're supporting your favorite club or your National team, Ultimate Kits has something for you".
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Button size="lg">
                Shop Now
              </Button>

              <Button variant="outline" size="lg">
                Browse Collections
              </Button>
            </div>
          </div>

          {/* Right Content */}
          <div className="flex justify-center">
            <div className="flex h-[500px] w-full max-w-md items-center justify-center rounded-3xl border border-slate-700 bg-slate-800/50 shadow-2xl">
              <span className="text-center text-slate-400">
                Hero Image
                <br />
                (Coming Soon)
              </span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}