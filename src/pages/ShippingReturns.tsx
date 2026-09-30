import InfoPage from "../components/info/InfoPage";

import { SHIPPING_RETURNS_SECTIONS } from "../constants/siteContent";

export default function ShippingReturns() {
  return (
    <InfoPage
      title="Shipping & Returns"
      subtitle="How an order reaches you, and what happens if you need to send it back."
      sections={SHIPPING_RETURNS_SECTIONS}
    />
  );
}
