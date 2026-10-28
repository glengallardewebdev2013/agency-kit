export interface NavItem {
  label: string;
  href: string;
}

export const nav: NavItem[] = [
  { label: 'Services', href: '/services/' },
  { label: 'Industries', href: '/industries/' },
  { label: 'Pricing', href: '/pricing/' },
  { label: 'For agencies', href: '/agencies/' },
  { label: 'About', href: '/about/' },
  { label: 'Blog', href: '/blog/' },
];
