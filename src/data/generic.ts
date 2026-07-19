import type { Product } from "../types/product";

// Generic Sports Jerseys
import dallasWhite from "../assets/images/products/generic/dallas-white.jpg";
import spursBlue from "../assets/images/products/generic/spurs-blue.jpg";
import gen2 from "../assets/images/products/generic/gen-2.jpg";
import gen3 from "../assets/images/products/generic/gen-3.jpg";
import gen4 from "../assets/images/products/generic/gen-4.jpg";
import heatWhite from "../assets/images/products/generic/heat-white.jpg";
import rocketsWhite from "../assets/images/products/generic/rockets-white.jpg";

export const genericProducts: Product[] = [
  {
    id: 401,
    name: "Performance Jersey",
    team: "Spurs Blue and White Jersey",
    sport: "Basketball",
    category: "Generic",
    league: "NBA",
    brand: "Jordan",

    price: 69,
    oldPrice: 89,
    rating: 4.7,

    image: spursBlue,

    isFeatured: true,
    isNew: true,
    inStock: true,
  },

  {
    id: 402,
    name: "Performance Jersey",
    team: "Ultimate Kits",
    sport: "Multi-Sport",
    category: "Training",
    league: "Generic",
    brand: "Ultimate Kits",

    price: 72,
    oldPrice: 92,
    rating: 4.8,

    image: gen2,

    inStock: true,
  },

  {
    id: 403,
    name: "Elite Sports Jersey",
    team: "Ultimate Kits",
    sport: "Multi-Sport",
    category: "Elite",
    league: "Generic",
    brand: "Ultimate Kits",

    price: 75,
    oldPrice: 95,
    rating: 4.9,

    image: gen3,

    isFeatured: true,
    inStock: true,
  },

  {
    id: 404,
    name: "Pro Training Jersey",
    team: "Ultimate Kits",
    sport: "Multi-Sport",
    category: "Training",
    league: "Generic",
    brand: "Ultimate Kits",

    price: 74,
    oldPrice: 94,
    rating: 4.8,

    image: gen4,

    inStock: true,
  },

  {
    id: 405,
    name: "Dallas White Jersey",
    team: "Dallas",
    sport: "Basketball",
    category: "Away",
    league: "NBA",
    brand: "Nike",

    price: 90,
    oldPrice: 110,
    rating: 4.8,

    image: dallasWhite,

    inStock: true,
  },

  {
    id: 406,
    name: "Miami Heat Jersey",
    team: "Miami Heat",
    sport: "Basketball",
    category: "Away",
    league: "NBA",
    brand: "Nike",

    price: 91,
    oldPrice: 111,
    rating: 4.8,

    image: heatWhite,

    inStock: true,
  },

  {
    id: 407,
    name: "Houston Rockets Jersey",
    team: "Houston Rockets",
    sport: "Basketball",
    category: "Away",
    league: "NBA",
    brand: "Nike",

    price: 91,
    oldPrice: 111,
    rating: 4.8,

    image: rocketsWhite,

    inStock: true,
  },
];