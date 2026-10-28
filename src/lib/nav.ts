export interface NavItem {
  label: string;
  href: string;
}

export const nav: NavItem[] = [
  { label: 'Services', href: '/services/' },
  { label: 'Areas', href: '/locations/' },
  { label: 'About', href: '/about/' },
  { label: 'Blog', href: '/blog/' },
  { label: 'Contact', href: '/contact/' },
];
