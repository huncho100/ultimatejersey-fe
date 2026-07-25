import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { featuredProducts } from "../../data/products";
import { footballProducts } from "../../data/football";
import { basketballProducts } from "../../data/basketball";
import { nationalTeamProducts } from "../../data/nationalTeams";
import { retroProducts } from "../../data/retro";

const allProducts = [
  ...featuredProducts,
  ...footballProducts,
  ...basketballProducts,
  ...nationalTeamProducts,
  ...retroProducts,
];

export default function HeroJerseys() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const jerseys = useMemo(() => {
    const shuffled = [...allProducts].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
  }, []);

  function handleMouseMove(
    e: React.MouseEvent<HTMLDivElement>
  ) {
    const rect = e.currentTarget.getBoundingClientRect();

    const x = (e.clientX - rect.left - rect.width / 2) / 25;
    const y = (e.clientY - rect.top - rect.height / 2) / 25;

    setPosition({ x, y });
  }

  function handleMouseLeave() {
    setPosition({ x: 0, y: 0 });
  }

  return (
    <div
      className="relative flex h-[480px] w-full items-center justify-center overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Ambient Glow */}

      <div className="absolute h-96 w-96 rounded-full bg-blue-500/20 blur-[120px]" />

      <div className="absolute right-20 top-24 h-40 w-40 rounded-full bg-cyan-400/20 blur-[90px]" />

      {/* Left Jersey */}

      <Link
        to={`/products/${jerseys[0].id}`}
        className="absolute left-4 top-24 z-10"
      >
        <img
          src={jerseys[0].image}
          alt={jerseys[0].team}
          style={{
            transform: `
              translate(${position.x * -1.2}px, ${position.y * -1.2}px)
              rotate(-12deg)
            `,
          }}
          className="
            float-medium
            w-56
            cursor-pointer
            rounded-2xl
            shadow-[0_20px_50px_rgba(0,0,0,.25),0_50px_100px_rgba(0,0,0,.35)]
            transition-all
            duration-300
            hover:scale-110
          "
        />
      </Link>

      {/* Center Jersey */}

      <Link
        to={`/products/${jerseys[1].id}`}
        className="absolute z-30"
      >
        <img
          src={jerseys[1].image}
          alt={jerseys[1].team}
          style={{
            transform: `
              translate(${position.x * .6}px, ${position.y * .6}px)
            `,
          }}
          className="
            float-slow
            w-72
            cursor-pointer
            rounded-2xl
            shadow-[0_25px_60px_rgba(0,0,0,.35),0_60px_120px_rgba(0,0,0,.45)]
            transition-all
            duration-300
            hover:scale-110
          "
        />
      </Link>

      {/* Right Jersey */}

      <Link
        to={`/products/${jerseys[2].id}`}
        className="absolute right-4 top-24 z-20"
      >
        <img
          src={jerseys[2].image}
          alt={jerseys[2].team}
          style={{
            transform: `
              translate(${position.x * 1.2}px, ${position.y * 1.2}px)
              rotate(12deg)
            `,
          }}
          className="
            float-fast
            w-56
            cursor-pointer
            rounded-2xl
            shadow-[0_20px_50px_rgba(0,0,0,.25),0_50px_100px_rgba(0,0,0,.35)]
            transition-all
            duration-300
            hover:scale-110
          "
        />
      </Link>

      {/* Glass Card */}

      <div
        className="
          absolute
          bottom-4
          rounded-3xl
          border
          border-white/10
          bg-white/5
          px-8
          py-5
          text-center
          backdrop-blur-xl
        "
      >
        <p className="text-xl tracking-[6px] text-yellow-400">
          ★★★★★
        </p>

        <h3 className="mt-2 text-lg font-semibold text-white">
          Official Licensed Jerseys
        </h3>

        <p className="mt-1 text-sm text-slate-300">
          Click any jersey to explore →
        </p>
      </div>
    </div>
  );
}