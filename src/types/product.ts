export interface Product {
  id: number;
  name: string;
  team: string;
  sport: string;

  price: number;
  rating: number;

  image: string;

  isNew?: boolean;
  isFeatured?: boolean;
}