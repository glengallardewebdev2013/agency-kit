// GallarDesign's prices, in one place so every page shows the same numbers.
// Decided 2026-10-28 from the competitor research.

export interface Plan {
  name: string;
  monthly: number;
  upfront: number;
  care: string;
  buyout: number;
  summary: string;
  includes: string[];
}

export const plans: Plan[] = [
  {
    name: 'Starter',
    monthly: 149,
    upfront: 1500,
    care: '$79 a month',
    buyout: 70,
    summary: 'A clear, fast site for a business that needs to look right online.',
    includes: ['Up to 5 pages', 'Hosting and SSL', 'Contact form', '1 hour of edits a month'],
  },
  {
    name: 'Business',
    monthly: 299,
    upfront: 3000,
    care: '$129 a month',
    buyout: 170,
    summary: 'For a business that wants its site to bring in bookings and quotes.',
    includes: [
      'Up to 12 pages',
      'A blog you edit yourself',
      'Google Business Profile setup',
      'Booking or quote form',
      '3 hours of edits a month',
    ],
  },
  {
    name: 'Growth',
    monthly: 549,
    upfront: 5000,
    care: 'Stays $549 as an SEO plan, or moves to Business care',
    buyout: 300,
    summary: 'Business, plus local SEO every month so you climb in your area.',
    includes: [
      'Everything in Business',
      '2 blog posts a month',
      'Google Business Profile posts',
      'Review requests',
      'A monthly report',
    ],
  },
];

export const featuredPlan = 'Business';

export const wholesale = {
  builds: [
    { name: 'Landing page', price: 950 },
    { name: 'Five-page site', price: 2400 },
    { name: 'Twelve-page site', price: 4500 },
  ],
  monthly: [
    { name: 'Starter', price: 99 },
    { name: 'Business', price: 199 },
    { name: 'Growth', price: 349 },
  ],
  care: '$49 to $199 a month',
};

export const foundingSpots = 6;

export function money(n: number): string {
  return `$${n.toLocaleString('en-US')}`;
}
