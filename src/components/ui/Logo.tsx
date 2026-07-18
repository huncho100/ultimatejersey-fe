import { NavLink } from "react-router-dom";

interface LogoProps {
  size?: "sm" | "md" | "lg";
}

export default function Logo({ size = "md" }: LogoProps) {
  const sizes = {
    sm: {
      icon: 36,
      title: "text-xl",
      subtitle: "text-[9px]",
    },
    md: {
      icon: 44,
      title: "text-2xl",
      subtitle: "text-[10px]",
    },
    lg: {
      icon: 54,
      title: "text-3xl",
      subtitle: "text-xs",
    },
  };

  const current = sizes[size];

  return (
    <NavLink
      to="/"
      className="group flex items-center gap-3 transition-transform duration-300 hover:scale-105"
    >
      {/* Logo Icon */}
      <svg
        width={current.icon}
        height={current.icon}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-all duration-300 group-hover:rotate-2"
      >
        {/* Jersey Outline */}
        <path
          d="M18 12
             L26 8
             L32 14
             L38 8
             L46 12
             L54 22
             L48 28
             L48 56
             L16 56
             L16 28
             L10 22
             Z"
          stroke="white"
          strokeWidth="3"
          strokeLinejoin="round"
          fill="none"
        />

        {/* UK */}
        <text
          x="18"
          y="40"
          fontSize="18"
          fontWeight="700"
          fill="#3B82F6"
        >
          UK
        </text>
      </svg>

      {/* Brand */}
      <div className="leading-none">
        <h1
          className={`${current.title} font-extrabold tracking-wide text-white transition-colors duration-300 group-hover:text-blue-400`}
        >
          Ultimate
        </h1>

        <p
          className={`${current.subtitle} mt-0.5 font-semibold uppercase tracking-[0.35em] text-amber-400`}
        >
          KITS
        </p>
      </div>
    </NavLink>
  );
}