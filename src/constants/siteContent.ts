/**
 * ===========================================
 * Site Content
 * ===========================================
 *
 * The wording behind Help, About Ultimate Kits and
 * Shipping & Returns.
 *
 * Two kinds of statement live here, and the
 * difference matters:
 *
 *   - How the store works. Every sentence of this
 *     describes behaviour that exists in this
 *     codebase -- prices in naira, Paystack, when
 *     the cart is emptied, what an account can do.
 *     If the behaviour changes, the wording here has
 *     to change with it.
 *
 *   - What the business has committed to. Delivery
 *     areas and timescales, charges, return windows,
 *     refund terms, company details, a support
 *     address. None of that exists anywhere in this
 *     system, and none of it is invented here. It is
 *     held in the null constants below, and until
 *     somebody fills them in the pages say plainly
 *     that it has not been published rather than
 *     printing a figure nobody has agreed to.
 *
 * Filling one in is the whole of the work: set the
 * constant, and the page stops saying the terms are
 * unpublished and starts showing them.
 */

export interface InfoLink {
  label: string;

  /** An in-site route. */
  to: string;
}

export interface InfoSection {
  id: string;

  heading: string;

  paragraphs?: string[];

  bullets?: string[];

  links?: InfoLink[];

  /**
   * Set where the section is describing something
   * the store has not published yet. Rendered as a
   * notice, so that an unanswered question reads as
   * unanswered rather than as an answer.
   */
  awaiting?: string;
}

/**
 * ===========================================
 * Operator-Supplied Details
 * ===========================================
 *
 * All null until Ultimate Kits provides them.
 * Nothing in the UI invents a value when one of
 * these is missing.
 */

/** e.g. "support@ultimatekits.com" */
export const SUPPORT_EMAIL: string | null = null;

/** e.g. "+234 ..." */
export const SUPPORT_PHONE: string | null = null;

/**
 * Delivery areas, timescales and charges, one
 * statement per line.
 */
export const DELIVERY_TERMS: string[] | null = null;

/**
 * Return eligibility, the window, condition
 * requirements, who pays return postage, and how
 * refunds are issued.
 */
export const RETURNS_TERMS: string[] | null = null;

/**
 * Who Ultimate Kits is: registration details,
 * trading address, how long it has traded, and
 * anything else the business wants stated.
 */
export const COMPANY_PROFILE: string[] | null =
  null;

export const hasSupportContact =
  SUPPORT_EMAIL !== null || SUPPORT_PHONE !== null;

/**
 * The one sentence every unpublished section ends
 * with. Kept in one place so the pages cannot drift
 * into promising different things.
 */
const NOT_PUBLISHED =
  "Ultimate Kits has not published this yet. " +
  "It will appear here once confirmed, and nothing " +
  "on this site should be read as a commitment " +
  "until it does.";

/**
 * ===========================================
 * Shipping & Returns
 * ===========================================
 */

export const SHIPPING_RETURNS_SECTIONS: InfoSection[] =
  [
    {
      id: "ordering",
      heading: "How an order is placed",
      paragraphs: [
        "Everything below describes what the store actually does when you order.",
      ],
      bullets: [
        "Prices are shown and charged in Nigerian Naira (₦).",
        "When you reach checkout, the store re-prices your cart from its own product records, so the total you approve is the total that is charged.",
        "Your order total is the price of the items in it. No delivery charge, handling fee or tax is added at checkout.",
        "Payment is taken through Paystack. You are sent to Paystack to pay and returned to Ultimate Kits afterwards.",
        "Your cart is emptied only once a payment has been confirmed. If a payment fails or you abandon it, the cart is left as it was so you can try again.",
      ],
      links: [
        {
          label: "View your cart",
          to: "/cart",
        },
      ],
    },
    {
      id: "delivery",
      heading: "Delivery",
      paragraphs: DELIVERY_TERMS ?? undefined,
      awaiting: DELIVERY_TERMS
        ? undefined
        : "Delivery areas, timescales and charges. " +
          NOT_PUBLISHED,
    },
    {
      id: "returns",
      heading: "Returns and refunds",
      paragraphs: RETURNS_TERMS ?? undefined,
      awaiting: RETURNS_TERMS
        ? undefined
        : "Return eligibility, any return window, the condition items must be in, who pays return postage, and how refunds are issued. " +
          NOT_PUBLISHED,
    },
    {
      id: "cancelling",
      heading: "Changing or cancelling an order",
      paragraphs: [
        "There is no self-service cancellation on the site. An order that has not yet shipped can be cancelled by Ultimate Kits; once it has shipped it cannot.",
        "Cancelling an order does not itself move any money. Where a refund has been agreed it is issued separately by the store.",
      ],
    },
    {
      id: "tracking",
      heading: "Following an order",
      paragraphs: [
        "Every order you place is listed in your account with its current status, from payment through to delivery.",
      ],
      links: [
        {
          label: "My orders",
          to: "/orders",
        },
      ],
    },
  ];

/**
 * ===========================================
 * Help
 * ===========================================
 */

export const HELP_SECTIONS: InfoSection[] = [
  {
    id: "account",
    heading: "Your account",
    bullets: [
      "You can browse, search and build a cart without an account.",
      "An account is required to place an order, because an order has to belong to somebody.",
      "If you have forgotten your password you can set a new one by email.",
    ],
    links: [
      { label: "Sign in", to: "/login" },
      {
        label: "Create an account",
        to: "/register",
      },
      {
        label: "Reset your password",
        to: "/forgot-password",
      },
    ],
  },
  {
    id: "finding",
    heading: "Finding a kit",
    bullets: [
      "Kits are grouped into clubs, national teams and retro, and you can also see everything at once.",
      "Search matches a product's name, team, brand, league, category and sport.",
      "Results can be filtered and sorted, and any filter you apply can be cleared again from the same place.",
    ],
    links: [
      { label: "All products", to: "/products" },
      { label: "Clubs", to: "/clubs" },
      {
        label: "National teams",
        to: "/national-teams",
      },
      { label: "Retro kits", to: "/retro-kits" },
      { label: "Search", to: "/search" },
    ],
  },
  {
    id: "cart",
    heading: "Your cart",
    bullets: [
      "You can hold up to 99 of any one product. Where a product has a counted stock level, that level is the limit instead.",
      "Signed in, your cart is saved to your account and is there again on your next visit or on another device.",
      "Signed out, your cart is kept in the browser you built it in. Signing in afterwards keeps what you had.",
      "You are told when something goes into your cart, and told why when it cannot.",
    ],
    links: [{ label: "View your cart", to: "/cart" }],
  },
  {
    id: "wishlist",
    heading: "Your wishlist",
    bullets: [
      "The wishlist holds products you want to come back to during this visit.",
      "It is not saved to your account yet, so refreshing the page or returning later starts it empty.",
    ],
    links: [
      { label: "Your wishlist", to: "/wishlist" },
    ],
  },
  {
    id: "paying",
    heading: "Paying",
    bullets: [
      "Payment is in Nigerian Naira (₦), taken through Paystack.",
      "Placing the order sends you to Paystack, and Paystack returns you to Ultimate Kits when it is done.",
      "If a payment does not complete, your cart is still there to try again with.",
      "Card details are entered on Paystack's own pages. They are never handled by this site.",
    ],
    links: [
      {
        label: "Shipping & returns",
        to: "/shipping-returns",
      },
    ],
  },
  {
    id: "orders",
    heading: "After you have paid",
    bullets: [
      "Your orders are listed in your account, each with the quantity, the price paid, and its current status.",
    ],
    links: [
      { label: "My orders", to: "/orders" },
      { label: "My account", to: "/account" },
    ],
  },
  {
    id: "reviews",
    heading: "Reviews",
    paragraphs: [
      "Customer reviews are not open on Ultimate Kits yet. Where a product shows a rating, that rating is set by the store on the product itself and is not an average of customer reviews.",
    ],
  },
  {
    id: "contact",
    heading: "Still stuck?",
    paragraphs: hasSupportContact
      ? [
          "Get in touch and we will help.",
          ...(SUPPORT_EMAIL ? [SUPPORT_EMAIL] : []),
          ...(SUPPORT_PHONE ? [SUPPORT_PHONE] : []),
        ]
      : undefined,
    awaiting: hasSupportContact
      ? undefined
      : "A support email address and phone number. " +
        NOT_PUBLISHED,
  },
];

/**
 * ===========================================
 * About Ultimate Kits
 * ===========================================
 */

export const ABOUT_SECTIONS: InfoSection[] = [
  {
    id: "what-we-sell",
    heading: "What we sell",
    paragraphs: [
      "Ultimate Kits is an online store for football and basketball kits: club jerseys, national team shirts, and retro kits from seasons that have been and gone.",
      "Each kit is listed with the team, league and brand it belongs to, so you can find a shirt by any of the things you might remember about it.",
    ],
    links: [
      { label: "Browse all kits", to: "/products" },
      { label: "Clubs", to: "/clubs" },
      {
        label: "National teams",
        to: "/national-teams",
      },
      { label: "Retro kits", to: "/retro-kits" },
    ],
  },
  {
    id: "how-we-work",
    heading: "How the store works",
    bullets: [
      "We sell in Nigerian Naira, and the price you approve at checkout is the price we charge.",
      "Payments are handled by Paystack. Card details go to Paystack, not to us.",
      "Your cart follows your account, so a kit you left in it is still there next time you sign in.",
      "Every order is kept in your account with its status, from payment through to delivery.",
    ],
  },
  {
    id: "company",
    heading: "Who we are",
    paragraphs: COMPANY_PROFILE ?? undefined,
    awaiting: COMPANY_PROFILE
      ? undefined
      : "Ultimate Kits' company details -- who runs the store, where it trades from, and how it is registered. " +
        NOT_PUBLISHED,
  },
  {
    id: "help",
    heading: "Questions",
    paragraphs: [
      "How ordering, delivery and returns work is set out on the help and policy pages.",
    ],
    links: [
      { label: "Help", to: "/help" },
      {
        label: "Shipping & returns",
        to: "/shipping-returns",
      },
    ],
  },
];
