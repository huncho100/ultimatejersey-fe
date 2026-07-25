import Hero from "../components/home/Hero";
import FeaturedProducts from "../components/home/FeaturedProducts";

import { featuredProducts } from "../data/products";
import { footballProducts } from "../data/football";
import { nationalTeamProducts } from "../data/nationalTeams";
import { retroProducts } from "../data/retro";

const heroProducts = [
  ...featuredProducts,
  ...footballProducts,
  ...nationalTeamProducts,
  ...retroProducts,
];

export default function Home() {
  return (
    <>
      <Hero products={heroProducts} />
      <FeaturedProducts />
    </>
  );
}