import Container from "../components/ui/Container";
import SectionTitle from "../components/ui/SectionTitle";

import EmptyWishlist from "../components/wishlist/EmptyWishlist";
import WishlistItem from "../components/wishlist/WishlistItem";

import { useWishlist } from "../context/WishlistContext";
import { useProductActions } from "../hooks/useProductActions";

export default function Wishlist() {
  const { wishlistItems } = useWishlist();

  const {
    moveProductToCart,
    toggleProductInWishlist,
  } = useProductActions();

  if (wishlistItems.length === 0) {
    return (
      <section className="min-h-screen bg-slate-50 py-12">
        <Container>

          <SectionTitle
            title="My Wishlist"
            subtitle="Save your favourite jerseys."
            align="left"
          />

          <div className="mt-10">
            <EmptyWishlist />
          </div>

        </Container>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-slate-50 py-12">
      <Container>

        <SectionTitle
          title="My Wishlist"
          subtitle="Save your favourite jerseys."
          align="left"
        />

        <div className="mt-8 space-y-4">

          {wishlistItems.map((item) => (

            <WishlistItem
              key={item.id}
              item={item}
              onMoveToCart={() => {
                // The wishlist entry is given up by
                // moveProductToCart, and only once
                // the product is actually in the
                // cart.
                void moveProductToCart(item);
              }}
              onRemove={() =>
                toggleProductInWishlist(item)
              }
            />

          ))}

        </div>

      </Container>
    </section>
  );
}