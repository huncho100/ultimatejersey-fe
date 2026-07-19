import { useState } from "react";

import manUnited from "../../assets/images/products/football/manchester-united-home.jpg";
import lakers from "../../assets/images/products/basketball/lakers-white.jpg";
import nigeria from "../../assets/images/products/national-teams/nigeria-home.jpg";

export default function HeroJerseys() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

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

      {/* Nigeria */}
      <img
        src={nigeria}
        alt="Nigeria Jersey"
        style={{
          transform: `
            translate(${position.x * -1.2}px, ${position.y * -1.2}px)
            rotate(-12deg)
          `,
        }}
        className="
          float-medium
          absolute
          left-4
          top-24
          z-10
          w-56
          rounded-2xl
          shadow-[0_20px_50px_rgba(0,0,0,.25),0_50px_100px_rgba(0,0,0,.35)]
          transition-transform
          duration-300
          hover:scale-105
        "
      />

      {/* Manchester United */}
      <img
        src={manUnited}
        alt="Manchester United Jersey"
        style={{
          transform: `
            translate(${position.x * 0.6}px, ${position.y * 0.6}px)
          `,
        }}
        className="
          float-slow
          absolute
          z-30
          w-72
          rounded-2xl
          shadow-[0_25px_60px_rgba(0,0,0,.35),0_60px_120px_rgba(0,0,0,.45)]
          transition-transform
          duration-300
          hover:scale-110
        "
      />

      {/* Lakers */}
      <img
        src={lakers}
        alt="Lakers Jersey"
        style={{
          transform: `
            translate(${position.x * 1.2}px, ${position.y * 1.2}px)
            rotate(12deg)
          `,
        }}
        className="
          float-fast
          absolute
          right-4
          top-24
          z-20
          w-56
          rounded-2xl
          shadow-[0_20px_50px_rgba(0,0,0,.25),0_50px_100px_rgba(0,0,0,.35)]
          transition-transform
          duration-300
          hover:scale-105
        "
      />

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
          Nike • Adidas • Puma • Umbro
        </p>
      </div>
    </div>
  );
}