import { Link } from "react-router-dom";

import InfoSections from "../info/InfoSections";

import { SHIPPING_RETURNS_SECTIONS } from "../../constants/siteContent";

/**
 * ===========================================
 * Product Policies
 * ===========================================
 *
 * The delivery and returns part of the shipping
 * policy, shown on the product page where a customer
 * asks the question, with a link to the whole thing.
 *
 * The sections are the same objects the Shipping &
 * Returns page renders, so the two cannot come to
 * say different things. The panel previously carried
 * its own wording -- "delivered worldwide", "easy
 * 30-day returns" -- which matched no policy the
 * store has published.
 */

const PANEL_SECTIONS = ["delivery", "returns"];

const sections = SHIPPING_RETURNS_SECTIONS.filter(
  (section) => PANEL_SECTIONS.includes(section.id)
);

export default function ProductPolicies() {
  return (
    <div>

      <h3 className="text-2xl font-bold text-slate-900">
        Shipping & Returns
      </h3>

      <div className="mt-6">
        <InfoSections sections={sections} />
      </div>

      <Link
        to="/shipping-returns"
        className="
          mt-6
          inline-block
          font-semibold
          text-blue-600
          underline-offset-4
          transition-colors
          hover:text-blue-700
          hover:underline
        "
      >
        Read the full shipping and returns policy
      </Link>

    </div>
  );
}
