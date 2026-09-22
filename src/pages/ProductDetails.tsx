import { useCallback, useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";

import Container from "../components/ui/Container";
import CatalogState from "../components/catalog/CatalogState";

import ProductGallery from "../components/products/ProductGallery";
import ProductInfo from "../components/products/ProductInfo";
import ProductDescription from "../components/products/ProductDescription";
import RelatedProducts from "../components/products/RelatedProducts";

import { useProducts } from "../context/ProductsContext";
import { productService } from "../services/productServices";
import { ApiRequestError } from "../services/api";
import { productHeading } from "../utils/catalog";

import type { Product } from "../types/product";

export default function ProductDetails() {
  const { id } = useParams();

  const productId = Number(id);

  // Related products come from the catalog already
  // in memory. They are a nicety, so this page does
  // not wait on them or report their failures.
  const { products } = useProducts();

  const [product, setProduct] = useState<Product | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  /**
   * Set when the API says the product does not
   * exist, which is different from the request
   * having failed. Only this sends the customer
   * back to the listing.
   */
  const [missing, setMissing] = useState(false);

  const load = useCallback(async () => {
    if (!Number.isInteger(productId) || productId <= 0) {
      setMissing(true);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setMissing(false);

    try {
      setProduct(
        await productService.getProduct(productId)
      );
    } catch (caught) {
      setProduct(null);

      if (
        caught instanceof ApiRequestError &&
        caught.status === 404
      ) {
        setMissing(true);
      } else {
        setError(
          caught instanceof Error
            ? caught.message
            : "Unable to load this product."
        );
      }
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    void load();
  }, [load]);

  if (missing) {
    return <Navigate to="/products" replace />;
  }

  if (loading || error || product === null) {
    return (
      <section className="bg-slate-50 py-8">
        <Container>
          <CatalogState
            loading={loading}
            error={error}
            onRetry={() => void load()}
          />
        </Container>
      </section>
    );
  }

  const relatedProducts = products
    .filter((item) => {
      if (item.id === product.id) return false;

      return (
        (!!item.team && item.team === product.team) ||
        (!!item.league &&
          item.league === product.league) ||
        item.category === product.category
      );
    })
    .slice(0, 4);

  return (
    <section className="bg-slate-50 py-8">
      <Container>

        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">

          {/* Left Column */}

          <div>
            <ProductGallery
              image={product.image}
              gallery={product.gallery}
              name={productHeading(product)}
            />
          </div>

          {/* Sticky Right Column */}

          <div className="self-start lg:sticky lg:top-24">

            <ProductInfo
              product={product}
            />

          </div>

        </div>

        <ProductDescription
          description={product.description}
        />

        <RelatedProducts
          products={relatedProducts}
        />

      </Container>
    </section>
  );
}
