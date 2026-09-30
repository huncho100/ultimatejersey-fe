import { useMemo } from "react";

import CatalogPage from "../components/catalog/CatalogPage";
import EmptyCollection from "../components/catalog/EmptyCollection";

import { useProducts } from "../context/ProductsContext";

import {
  isNationalTeamJersey,
  NATIONAL_TEAM_LEAGUE,
} from "../utils/catalog";

export default function NationalTeams() {
  const { products, loading, error, reload } =
    useProducts();

  const nationalTeamProducts = useMemo(
    () => products.filter(isNationalTeamJersey),
    [products]
  );

  return (
    <CatalogPage
      title="National Teams"
      subtitle="Official jerseys from the world's biggest international football teams."
      products={nationalTeamProducts}
      loading={loading}
      error={error}
      onRetry={reload}
      searchPlaceholder="Search countries, players, brands..."
      emptyCollection={
        <EmptyCollection
          collection="national team jerseys"
          field="league"
          value={NATIONAL_TEAM_LEAGUE}
        />
      }
    />
  );
}
