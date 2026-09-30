/**
 * ===========================================
 * Currency
 * ===========================================
 *
 * The store sells in Nigerian Naira. The backend
 * already agrees: payments are recorded with
 * currency "NGN" and sent to Paystack in kobo. Only
 * the frontend disagreed, printing a dollar sign in
 * front of those same figures and describing every
 * price as something it has never been.
 *
 * Nothing here converts anything. The numbers
 * arriving from the API are already naira; this
 * module only decides how they are written.
 */

const NAIRA_SIGN = "₦";

/**
 * Grouped to Nigerian convention, with kobo always
 * shown so a total never silently rounds away part
 * of what will be charged.
 *
 * The sign is applied separately rather than through
 * `style: "currency"`, because a runtime whose ICU
 * data does not include en-NG falls back to writing
 * the currency code -- "NGN 89.99" -- instead of the
 * sign the customer expects.
 */
const nairaFormat = new Intl.NumberFormat("en-NG", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * Format an amount already denominated in naira.
 */
export function formatNaira(
  amount: number
): string {
  const value = Number.isFinite(amount)
    ? amount
    : 0;

  // The sign belongs outside the minus, the way a
  // refund is normally written.
  const sign = value < 0 ? "-" : "";

  return (
    sign +
    NAIRA_SIGN +
    nairaFormat.format(Math.abs(value))
  );
}

/**
 * ===========================================
 * Decimal Parsing
 * ===========================================
 *
 * Money is stored in Numeric columns and Pydantic
 * serialises those as JSON *strings* ("89.99"), not
 * numbers. Using one without parsing produces string
 * concatenation in every total on the site, so every
 * money field crossing the API boundary comes
 * through here.
 */

export function parseDecimal(
  value: string | number | null | undefined
): number {
  if (value === null || value === undefined) {
    return 0;
  }

  const parsed =
    typeof value === "number"
      ? value
      : Number.parseFloat(value);

  return Number.isFinite(parsed) ? parsed : 0;
}
