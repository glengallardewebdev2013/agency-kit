// GallarDesign's prices, in one place so every page shows the same numbers.
// Local clients in Cebu pay in pesos, once, after they have seen a free
// preview (decided 2026-10-28, Cebu plan). White label work for overseas
// agencies stays in US dollars.

export interface Plan {
  name: string;
  price: number;
  summary: string;
  bestFor: string;
  includes: string[];
}

export const plans: Plan[] = [
  {
    name: 'Starter',
    price: 18000,
    summary: 'A clear, fast first website that gets people to message or call you.',
    bestFor: 'Solo clinics, small shops, a first website',
    includes: [
      'Up to 3 pages, built for phones first',
      'Messenger, Viber, WhatsApp and call buttons',
      'Contact form',
      'Google Business Profile setup',
      '1 revision round',
    ],
  },
  {
    name: 'Business',
    price: 35000,
    summary: 'For a business that wants its site to bring in bookings and inquiries.',
    bestFor: 'Most clinics, resorts and tour operators',
    includes: [
      'Up to 7 pages',
      'Booking or inquiry form',
      'A blog you edit yourself',
      'On-page SEO and Google Analytics',
      '2 revision rounds',
    ],
  },
  {
    name: 'Growth',
    price: 65000,
    summary: 'Take bookings and payments online, in more than one language.',
    bestFor: 'Resorts, multi-branch clinics, schools',
    includes: [
      'Up to 12 pages',
      'Online booking, or GCash, Maya and card payments',
      'English plus Cebuano, Korean or Japanese',
      'Menu or rates catalog',
      '3 revision rounds',
    ],
  },
];

export const featuredPlan = 'Business';

export interface CarePlan {
  name: string;
  monthly: number;
  includes: string;
}

// Care is optional and month to month, cancel with 30 days' notice.
export const care: CarePlan[] = [
  { name: 'Basic Care', monthly: 990, includes: 'Hosting, SSL, backups, uptime watch, security updates and 30 minutes of edits a month.' },
  { name: 'Care Plus', monthly: 1990, includes: 'Basic Care, plus 1 hour of edits done within 1 working day by chat message, and a monthly one-page report.' },
  { name: 'Growth Care', monthly: 4990, includes: 'Care Plus, plus 2 blog posts a month, Google Business Profile posts and review replies, and local SEO tracking.' },
];

// Three ways in for a business with little or no budget.
export const lowBudget = [
  {
    name: 'Simple Page',
    price: '₱4,990 once',
    text: 'A one-page site with your services, photos, map, hours, and Messenger and call buttons. Hosted free in your name. You pay only for your domain, about ₱700 a year, or use a free address. 1 revision round.',
  },
  {
    name: 'Starter in 3 payments',
    price: '3 × ₱6,500',
    text: 'The Starter site, paid in three parts. It stays on our hosting until the last payment, then everything moves to you.',
  },
  {
    name: '₱0 down',
    price: '₱2,490 a month for 12 months',
    text: 'The Starter site plus Basic Care. After month 12 it drops to ₱990 Basic Care, or you leave with everything. To leave early, pay what is left of ₱18,000.',
  },
];

export const previewDays = 3;
export const liveDays = 2;
export const foundingSpots = 6;

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

/** Philippine pesos, for local clients. */
export function peso(n: number): string {
  return `₱${n.toLocaleString('en-PH')}`;
}

/** US dollars, for the white label prices only. */
export function money(n: number): string {
  return `$${n.toLocaleString('en-US')}`;
}
