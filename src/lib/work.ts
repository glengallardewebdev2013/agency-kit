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
