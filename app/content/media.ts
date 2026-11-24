import type { Brand } from "./profile";

// Photo tiles between the project rows (Figma 79:13196): Darwin at work and with his teams.
// Real photos only. "wide" tiles take two thirds of a row, "narrow" ones a third.

export type MediaTile = {
  key: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  kind: "wide" | "narrow";
  /** Where the crop keeps its focus (CSS object-position). */
  focus?: string;
  /** The company the photo belongs to. Filtered feeds leave these out (the panel has the photo). */
  brand?: Brand;
};

export const media: MediaTile[] = [
  {
    key: "desk",
    src: "/images/media/desk.webp",
    alt: "Darwin at his desk, designing in Figma on a large monitor, with plants by the window",
    width: 2000,
    height: 1333,
    kind: "wide",
    focus: "50% 55%",
  },
  {
    key: "mercadolibre-talk",
    src: "/images/companies/mercadolibre.webp",
    alt: "Darwin giving a technical talk to the Mercado Libre team in Bogotá",
    width: 960,
    height: 720,
    kind: "narrow",
    focus: "100% 50%",
    brand: "mercadolibre",
  },
  {
    key: "coverbase-team",
    src: "/images/companies/coverbase.webp",
    alt: "The Coverbase team at their 2026 on-site in Mexico City",
    width: 960,
    height: 540,
    kind: "wide",
    brand: "coverbase",
  },
  {
    key: "redvalley-team",
    src: "/images/companies/redvalley.webp",
    alt: "The Red Valley team at an on-site in Medellín",
    width: 960,
    height: 794,
    kind: "narrow",
    brand: "redvalley",
  },
];
