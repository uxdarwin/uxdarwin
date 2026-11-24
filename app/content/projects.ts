// Projects feed (center column). Source: Figma "Darwin Designer Brand", frame 34:1934.
// Copy is drafted from the evidence doc and waits for Darwin's approval.

import type { Brand } from "./profile";

export type Project = {
  slug: string;
  year: number;
  /** Employer or engagement shown after the year. A brand gets its logo; otherwise text only. */
  employer: { label: string; brand?: Brand };
  /** Client, brand or product name shown last in the meta line. */
  client: string;
  description: string;
  /** The blue label that pops on hover: what story the case study will tell. */
  teaser: string;
  image: { src: string; alt: string; width: number; height: number };
};

export const projects: Project[] = [
  {
    slug: "neon-wood",
    year: 2026,
    employer: { label: "Freelance" },
    client: "Neon Wood",
    description: "A website for furnished apartments and community spaces in four German cities.",
    teaser: "One floating card for location, apartment type and all-inclusive rent, right in the hero",
    image: {
      src: "/images/projects/neon-wood.webp",
      alt: "Neon Wood home page: a full-bleed apartment photo with a floating card to pick a location and apartment type",
      width: 1000,
      height: 564,
    },
  },
  {
    slug: "abacus",
    year: 2026,
    employer: { label: "Freelance" },
    client: "Abacus Tierpark Hotel",
    description: "A website redesign for a Berlin hotel next to Tierpark, with booking up front.",
    teaser: "Before and after: a home page that leads with the park and a one-line booking bar",
    image: {
      src: "/images/projects/abacus.webp",
      alt: "Abacus Tierpark Hotel home page: an aerial park view behind the headline and a compact booking bar",
      width: 1000,
      height: 556,
    },
  },
  {
    slug: "spice-org",
    year: 2025,
    employer: { label: "Spice AI" },
    client: "Spice.org",
    description: "A developer site for Spice, an open-source SQL runtime for data and AI apps.",
    teaser: "A live query explorer in the hero, so developers see the product before they install it",
    image: {
      src: "/images/projects/spice-org.webp",
      alt: "Spice.org home page: the headline, install and docs buttons, and a SQL query explorer",
      width: 1000,
      height: 694,
    },
  },
  {
    slug: "statements",
    year: 2024,
    employer: { label: "Mercado Libre", brand: "mercadolibre" },
    client: "Statements",
    description: "One place for vendors selling to Mercado Libre to track every payment and invoice.",
    teaser: "Making payment dates honest: states, differences and late payments a vendor can trust",
    image: {
      src: "/images/projects/statements.webp",
      alt: "Statements: a paid payment with its two invoices, each with reception date, status, payment date and amount",
      width: 1000,
      height: 504,
    },
  },
  {
    slug: "cocuy",
    year: 2024,
    employer: { label: "Mercado Libre", brand: "mercadolibre" },
    client: "Cocuy",
    description: "The B2B component library I started for Mercado Libre's First Party tools.",
    teaser: "From launch in June to 62,000+ component insertions and a squad of its own",
    image: {
      src: "/images/projects/cocuy.webp",
      alt: "Cover of Cocuy, the 1P Main Library, over a photo of the Púlpito del Diablo in El Cocuy",
      width: 1000,
      height: 562,
    },
  },
];
