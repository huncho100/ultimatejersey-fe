export interface NavigationItem {
  label: string;
  path: string;
}

export const navigation: NavigationItem[] = [
  {
    label: 'Home',
    path: '/',
  },
  {
    label: 'Products',
    path: '/products',
  },
  {
    label: 'Clubs',
    path: '/clubs',
  },
  {
    label: 'National Teams',
    path: '/national-teams',
  },
  {
    label: 'Retro Kits',
    path: '/retro-kits',
  },
];

/**
 * ===========================================
 * Footer Navigation
 * ===========================================
 *
 * Every path below is a route declared in App.tsx
 * and rendered by a real page. Adding a link here
 * without adding the route gives the customer a
 * blank screen, so the two are changed together.
 */

export interface NavigationGroup {
  title: string;
  items: NavigationItem[];
}

export const footerNavigation: NavigationGroup[] = [
  {
    title: 'Shop',
    items: [
      { label: 'All Products', path: '/products' },
      { label: 'Clubs', path: '/clubs' },
      {
        label: 'National Teams',
        path: '/national-teams',
      },
      { label: 'Retro Kits', path: '/retro-kits' },
    ],
  },
  {
    title: 'Customer Service',
    items: [
      { label: 'Help', path: '/help' },
      {
        label: 'Shipping & Returns',
        path: '/shipping-returns',
      },
      { label: 'My Orders', path: '/orders' },
    ],
  },
  {
    title: 'Ultimate Kits',
    items: [
      {
        label: 'About Ultimate Kits',
        path: '/about',
      },
      { label: 'My Account', path: '/account' },
      { label: 'Wishlist', path: '/wishlist' },
    ],
  },
];