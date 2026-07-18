import type { Product } from "../types/product";

// Premier League
import arsenalHome from "../assets/images/products/football/arsenal-home.jpg";

import chelseaHome from "../assets/images/products/football/chelsea-home.webp";
import chelseaHome1 from "../assets/images/products/football/chelsea-home1.webp";
import chelseaHome2 from "../assets/images/products/football/chelsea-home2.webp";

import manCityHome from "../assets/images/products/football/manchester-city-home.jpg";
import manUnitedHome from "../assets/images/products/football/manchester-united-home.jpg";

// La Liga
import barcelonaHome from "../assets/images/products/football/barcelona-home.jpg";
import realMadridHome from "../assets/images/products/football/real-madrid-home.jpg";

// Player Jerseys
import haalandBlue from "../assets/images/products/football/haaland-blue.jpg";
import reeceJamesBlue from "../assets/images/products/football/james-blue.webp";

export const footballProducts: Product[] = [
  {
    id: 101,
    name: "Home Jersey",
    team: "Manchester United",
    sport: "Football",
    category: "Home",
    league: "Premier League",
    brand: "Adidas",

    price: 89,
    oldPrice: 109,
    rating: 4.9,

    image: manUnitedHome,

    isFeatured: true,
    isNew: true,
    isBestSeller: true,
    inStock: true,
  },

  {
    id: 102,
    name: "Home Jersey",
    team: "Manchester City",
    sport: "Football",
    category: "Home",
    league: "Premier League",
    brand: "Puma",

    price: 90,
    oldPrice: 110,
    rating: 4.8,

    image: manCityHome,

    isFeatured: true,
    inStock: true,
  },

  {
    id: 103,
    name: "Home Jersey",
    team: "Arsenal",
    sport: "Football",
    category: "Home",
    league: "Premier League",
    brand: "Adidas",

    price: 88,
    oldPrice: 105,
    rating: 4.8,

    image: arsenalHome,

    inStock: true,
  },

  {
    id: 104,
    name: "Home Jersey",
    team: "Chelsea",
    sport: "Football",
    category: "Home",
    league: "Premier League",
    brand: "Nike",

    price: 87,
    oldPrice: 104,
    rating: 4.7,

    image: chelseaHome,

    inStock: true,
  },

  {
    id: 105,
    name: "Home Jersey",
    team: "Chelsea",
    sport: "Football",
    category: "Alternate",
    league: "Premier League",
    brand: "Nike",

    price: 89,
    oldPrice: 109,
    rating: 4.8,

    image: chelseaHome1,

    isNew: true,
    inStock: true,
  },

  {
    id: 106,
    name: "Home Jersey",
    team: "Chelsea",
    sport: "Football",
    category: "Third Kit",
    league: "Premier League",
    brand: "Nike",

    price: 89,
    oldPrice: 109,
    rating: 4.8,

    image: chelseaHome2,

    inStock: true,
  },

  {
    id: 107,
    name: "Home Jersey",
    team: "Real Madrid",
    sport: "Football",
    category: "Home",
    league: "La Liga",
    brand: "Adidas",

    price: 94,
    oldPrice: 114,
    rating: 5,

    image: realMadridHome,

    isFeatured: true,
    isBestSeller: true,
    inStock: true,
  },

  {
    id: 108,
    name: "Home Jersey",
    team: "Barcelona",
    sport: "Football",
    category: "Home",
    league: "La Liga",
    brand: "Nike",

    price: 92,
    oldPrice: 110,
    rating: 4.8,

    image: barcelonaHome,

    isFeatured: true,
    inStock: true,
  },

  {
    id: 109,
    name: "Erling Haaland Jersey",
    team: "Manchester City",
    sport: "Football",
    category: "Player Edition",
    league: "Premier League",
    brand: "Puma",

    price: 110,
    oldPrice: 135,
    rating: 5,

    image: haalandBlue,

    isNew: true,
    isBestSeller: true,
    inStock: true,
  },

  {
    id: 110,
    name: "Reece James Jersey",
    team: "Chelsea",
    sport: "Football",
    category: "Player Edition",
    league: "Premier League",
    brand: "Nike",

    price: 99,
    oldPrice: 120,
    rating: 4.7,

    image: reeceJamesBlue,

    inStock: true,
  },
];