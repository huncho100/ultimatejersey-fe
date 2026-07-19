import type { Product } from "../types/product";

// Basketball Jerseys
import bullsRed from "../assets/images/products/basketball/bulls-red.jpg";
import celticBlack from "../assets/images/products/basketball/celtic-black.jpg";
import celticBlack2 from "../assets/images/products/basketball/celtic-black2.jpg";
import celticGreen from "../assets/images/products/basketball/celtic-green.jpg";
import clevelandRed from "../assets/images/products/basketball/cleveland-red.jpg";
import dallasWhite from "../assets/images/products/basketball/dallas-white.jpg";
import goldenStateWhite from "../assets/images/products/basketball/goldenstate-white.jpg";
import heatWhite from "../assets/images/products/basketball/heat-white.jpg";
import lakersWhite from "../assets/images/products/basketball/lakers-white.jpg";
import lakersYellow from "../assets/images/products/basketball/lakers-yello.jpg";
import rocketsWhite from "../assets/images/products/basketball/rockets-white.jpg";

export const basketballProducts: Product[] = [
  {
    id: 201,
    name: "Home Jersey",
    team: "Los Angeles Lakers",
    sport: "Basketball",
    category: "Home",
    league: "NBA",
    brand: "Nike",

    price: 96,
    oldPrice: 120,
    rating: 5,

    image: lakersWhite,

    isFeatured: true,
    isNew: true,
    isBestSeller: true,
    inStock: true,
  },

  {
    id: 202,
    name: "City Edition Jersey",
    team: "Los Angeles Lakers",
    sport: "Basketball",
    category: "City Edition",
    league: "NBA",
    brand: "Nike",

    price: 98,
    oldPrice: 122,
    rating: 4.9,

    image: lakersYellow,

    isFeatured: true,
    inStock: true,
  },

  {
    id: 203,
    name: "Home Jersey",
    team: "Chicago Bulls",
    sport: "Basketball",
    category: "Home",
    league: "NBA",
    brand: "Nike",

    price: 94,
    oldPrice: 115,
    rating: 4.8,

    image: bullsRed,

    inStock: true,
  },

  {
    id: 204,
    name: "Home Jersey",
    team: "Boston Celtics",
    sport: "Basketball",
    category: "Home",
    league: "NBA",
    brand: "Nike",

    price: 94,
    oldPrice: 115,
    rating: 4.9,

    image: celticGreen,

    isFeatured: true,
    inStock: true,
  },

  {
    id: 205,
    name: "Alternate Jersey",
    team: "Boston Celtics",
    sport: "Basketball",
    category: "Alternate",
    league: "NBA",
    brand: "Nike",

    price: 93,
    oldPrice: 113,
    rating: 4.8,

    image: celticBlack,

    inStock: true,
  },

  {
    id: 206,
    name: "City Edition Jersey",
    team: "Boston Celtics",
    sport: "Basketball",
    category: "City Edition",
    league: "NBA",
    brand: "Nike",

    price: 95,
    oldPrice: 116,
    rating: 4.8,

    image: celticBlack2,

    inStock: true,
  },

  {
    id: 207,
    name: "Home Jersey",
    team: "Cleveland Cavaliers",
    sport: "Basketball",
    category: "Home",
    league: "NBA",
    brand: "Nike",

    price: 92,
    oldPrice: 112,
    rating: 4.7,

    image: clevelandRed,

    inStock: true,
  },

  {
    id: 208,
    name: "Away Jersey",
    team: "Dallas Mavericks",
    sport: "Basketball",
    category: "Away",
    league: "NBA",
    brand: "Nike",

    price: 94,
    oldPrice: 114,
    rating: 4.8,

    image: dallasWhite,

    inStock: true,
  },

  {
    id: 209,
    name: "Home Jersey",
    team: "Golden State Warriors",
    sport: "Basketball",
    category: "Home",
    league: "NBA",
    brand: "Nike",

    price: 95,
    oldPrice: 116,
    rating: 5,

    image: goldenStateWhite,

    isFeatured: true,
    inStock: true,
  },

  {
    id: 210,
    name: "Away Jersey",
    team: "Miami Heat",
    sport: "Basketball",
    category: "Away",
    league: "NBA",
    brand: "Nike",

    price: 92,
    oldPrice: 112,
    rating: 4.8,

    image: heatWhite,

    inStock: true,
  },

  {
    id: 211,
    name: "Away Jersey",
    team: "Houston Rockets",
    sport: "Basketball",
    category: "Away",
    league: "NBA",
    brand: "Nike",

    price: 91,
    oldPrice: 111,
    rating: 4.7,

    image: rocketsWhite,

    inStock: true,
  },
];