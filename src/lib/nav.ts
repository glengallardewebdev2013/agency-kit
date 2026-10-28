export interface NavItem {
  label: string;
  href: string;
}

export const nav: NavItem[] = [
  { label: 'Services', href: '/services/' },
  { label: 'Industries', href: '/industries/' },
  { label: 'Pricing', href: '/pricing/' },
  { label: 'Giving', href: '/giving/' },
  { label: 'About', href: '/about/' },
  { label: 'Blog', href: '/blog/' },
];

// Secondary pages, linked from the footer only.
export const footerNav: NavItem[] = [
  { label: 'For agencies', href: '/agencies/' },
  { label: 'Contact', href: '/contact/' },
];
