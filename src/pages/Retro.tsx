import { useMemo } from "react";

import CatalogPage from "../components/catalog/CatalogPage";
import EmptyCollection from "../components/catalog/EmptyCollection";

import { useProducts } from "../context/ProductsContext";

import {
  isRetroJersey,
  RETRO_CATEGORY,
} from "../utils/catalog";

export default function Retro() {
  const { products, loading, error, reload } =
    useProducts();

  const retroProducts = useMemo(
    () => products.filter(isRetroJersey),
    [products]
  );

  return (
    <CatalogPage
      title="Retro Kits"
      subtitle="Relive football's greatest moments with iconic retro jerseys."
      products={retroProducts}
      loading={loading}
      error={error}
      onRetry={reload}
      searchPlaceholder="Search clubs, seasons, brands..."
      emptyCollection={
        <EmptyCollection
          collection="retro kits"
          field="category"
          value={RETRO_CATEGORY}
        />
      }
    />
  );
}
