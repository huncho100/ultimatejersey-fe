import CatalogPage from "../components/catalog/CatalogPage";
import { useProducts } from "../context/ProductsContext";
import { isBasketballJersey } from "../utils/catalog";

export default function Basketball() {
  const { products, loading, error, reload } = useProducts();
  return (
    <CatalogPage
      title="Basketball"
      subtitle="Browse basketball jersey designs and pre-printed shirts."
      products={products.filter(isBasketballJersey)}
      loading={loading}
      error={error}
      onRetry={reload}
      searchPlaceholder="Search basketball teams and jerseys..."
    />
  );
}
