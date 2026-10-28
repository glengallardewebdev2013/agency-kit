// Recent client websites by Glen. Shown first, as real work.
export interface ClientSite {
  name: string;
  url: string;
  kind: string;
  where: string;
  note: string;
}

export const clientSites: ClientSite[] = [
  { name: 'Exit Advisory Group', url: 'https://exitadvisory.com.au/', kind: 'M&A advisory and business brokerage', where: 'Sydney, Melbourne and Perth', note: 'Valuations, sales and exit planning, with case studies, testimonials, articles and a newsletter.' },
  { name: 'Pre-Filters', url: 'https://prefilters.com.au/', kind: 'Online store for water filters', where: 'Australia', note: 'A store that sorts filters by water source, with a water quiz, bundles and subscribe-and-save refills.' },
  { name: 'RecovAdapt', url: 'https://recovadapt.com.au/', kind: 'Online supplement store', where: 'Australia', note: 'Naturopath-formulated supplements, with a health quiz, goal-based bundles and customer reviews.' },
  { name: 'Ridgeline Roofers', url: 'https://www.ridgelineroofers.com/', kind: 'Roofing, siding and gutters', where: 'Ashburn, Virginia, USA', note: 'A family roofing company, with Google reviews, a page per service, service areas and a project map.' },
  { name: 'Brandon Insurance', url: 'https://brandoninsuranceinc.com/', kind: 'Independent insurance agency', where: 'Brandon, Florida, USA', note: 'A family-owned agency since 1960, with a page per insurance type, carrier partners, testimonials, a blog and quote requests.' },
  { name: 'GAT Foundation', url: 'https://gatfoundation.org.au/', kind: 'Volunteer-run charity', where: 'Melbourne, serving the Philippines', note: 'Collects books in Australia and rehomes them in Philippine schools, with impact numbers and ways to get involved.' },
];

// Concept sites: made-up businesses designed to show the range of work.
// They are not client work, and every page that shows them says so.
// Photos come from Wikimedia Commons; credits are listed on the home page.

export interface Concept {
  slug: string;
  name: string;
  kind: string;
  alt: string;
}

export const concepts: Concept[] = [
  { slug: 'spa', name: 'Maison Elle', kind: 'Med spa', alt: 'A med spa home page with a serif headline beside a photo of a calm lobby' },
  { slug: 'paint', name: 'truecoat.', kind: 'House painter', alt: 'A painting contractor home page with a bold headline and a freshly painted wall' },
  { slug: 'remodel', name: 'Oak & Plane', kind: 'Remodeler', alt: 'A remodeling company home page with marble and timber photos beside the offer' },
  { slug: 'land', name: 'Wildfield', kind: 'Landscaper', alt: 'A landscaping company home page over a photo of a wildflower field' },
];

export const photoCredits = [
  { by: 'Basile Morin', license: 'CC BY-SA 4.0', href: 'https://commons.wikimedia.org/wiki/File:Lobby_lounge_of_Amantaka_Suite_Amantaka_luxury_Resort_%26_Hotel_Luang_Prabang_Laos.jpg' },
  { by: 'Basotxerri', license: 'CC BY-SA 4.0', href: 'https://commons.wikimedia.org/wiki/File:Vitoria_-_Adurza_-_Iturritxu_-BT-_03.jpg' },
  { by: 'Ambadyanands', license: 'CC0', href: 'https://commons.wikimedia.org/wiki/File:Marble_Top.jpg' },
  { by: 'Elke Wetzig (elya)', license: 'CC BY-SA 3.0', href: 'https://commons.wikimedia.org/wiki/File:Fichte_Dreischichtplatte_2009.jpg' },
  { by: 'Dietmar Rabich', license: 'CC BY-SA 4.0', href: 'https://commons.wikimedia.org/wiki/File:D%C3%BClmen,_Brachliegendes_Feld_mit_Wildblumen_--_2021_--_9756.jpg' },
];
