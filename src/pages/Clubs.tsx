import { useMemo } from "react";

import CatalogPage from "../components/catalog/CatalogPage";

import { useProducts } from "../context/ProductsContext";
import { isClubJersey } from "../utils/catalog";

export default function Clubs() {
  const { products, loading, error, reload } =
    useProducts();

  const clubProducts = useMemo(
    () => products.filter(isClubJersey),
    [products]
  );

  return (
    <CatalogPage
      title="Club Collections"
      subtitle="Discover official jerseys from the world's biggest football clubs."
      products={clubProducts}
      loading={loading}
      error={error}
      onRetry={reload}
      searchPlaceholder="Search clubs, players, leagues..."
    />
  );
}
