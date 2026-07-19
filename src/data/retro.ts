import type { Product } from "../types/product";

// Retro Jerseys
import barcaRetro from "../assets/images/products/retro/barca-retro.jpg";
import englandRetro from "../assets/images/products/retro/england-retro.jpg";
import interRetro from "../assets/images/products/retro/inter-retro.jpg";
import liverpoolRetro from "../assets/images/products/retro/liverpool-retro.jpg";
import nigeriaRetro from "../assets/images/products/retro/nigeria-retro.jpg";
import nigeriaRetroGreen from "../assets/images/products/retro/nigeria-retro-green.jpg";
import nigeriaWhite from "../assets/images/products/retro/nigeria-white.jpg";

export const retroProducts: Product[] = [
  {
    id: 401,
    name: "Retro Jersey",
    team: "Nigeria",
    sport: "Football",
    category: "Retro",
    league: "National Team",
    brand: "Nike",

    price: 89,
    oldPrice: 109,
    rating: 4.9,

    image: nigeriaRetro,

    isFeatured: true,
    isNew: true,
    isBestSeller: true,
    inStock: true,
  },

  {
    id: 402,
    name: "Retro Jersey",
    team: "Nigeria",
    sport: "Football",
    category: "Retro",
    league: "National Team",
    brand: "Nike",

    price: 90,
    oldPrice: 110,
    rating: 4.8,

    image: nigeriaRetroGreen,

    isFeatured: true,
    inStock: true,
  },

  {
    id: 403,
    name: "Retro Jersey",
    team: "Barcelona",
    sport: "Football",
    category: "Retro",
    league: "La Liga",
    brand: "Nike",

    price: 88,
    oldPrice: 105,
    rating: 4.8,

    image: barcaRetro,

    inStock: true,
  },

  {
    id: 404,
    name: "Retro Jersey",
    team: "Inter Milan",
    sport: "Football",
    category: "Retro",
    league: "Serie A",
    brand: "Umbro",

    price: 87,
    oldPrice: 104,
    rating: 4.7,

    image: interRetro,

    inStock: true,
  },

  {
    id: 405,
    name: "Retro Jersey",
    team: "England",
    sport: "Football",
    category: "Retro",
    league: "National Team",
    brand: "Umbro",

    price: 89,
    oldPrice: 109,
    rating: 4.8,

    image: englandRetro,

    isNew: true,
    inStock: true,
  },

  {
    id: 406,
    name: "Retro Jersey",
    team: "Liverpool",
    sport: "Football",
    category: "Retro",
    league: "Premier League",
    brand: "Adidas",

    price: 89,
    oldPrice: 109,
    rating: 4.8,

    image: liverpoolRetro,

    inStock: true,
  },
  {
    id: 406,
    name: "Away Jersey",
    team: "Nigeria",
    sport: "Football",
    category: "away",
    league: "National Team",
    brand: "Nike",

    price: 89,
    oldPrice: 109,
    rating: 4.8,

    image: nigeriaWhite,

    inStock: true,
  },
];