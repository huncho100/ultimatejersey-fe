import { useSearchParams } from "react-router-dom";

import CatalogPage from "../components/catalog/CatalogPage";

import { useProducts } from "../context/ProductsContext";

export default function Products() {
  const [searchParams] = useSearchParams();

  const { products, loading, error, reload } =
    useProducts();

  /**
   * ?filter=new has always meant "sort newest first"
   * rather than "hide everything else", so it picks
   * the starting sort and nothing more.
   */
  const isNewFilter =
    searchParams.get("filter") === "new";

  return (
    <CatalogPage
      title="Our Products"
      subtitle="Browse our collection of official football, basketball, national team, and retro jerseys."
      products={products}
      loading={loading}
      error={error}
      onRetry={reload}
      searchPlaceholder="Search jerseys, teams, brands..."
      defaultSort={isNewFilter ? "newest" : "featured"}
    />
  );
}
