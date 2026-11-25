import type { Brand } from "./profile";

// Photo tiles between the project rows (Figma 79:13196): Darwin at work and with his teams.
// Real photos and footage only. "wide" tiles take two thirds of a row, "narrow" ones a third.

export type MediaTile = {
  key: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  kind: "wide" | "narrow";
  /** Where the crop keeps its focus (CSS object-position). */
  focus?: string;
  /** A muted looping clip; `src` is its poster. */
  video?: string;
  /** Shown over the tile on hover. */
  caption?: string;
  /** The company the photo belongs to. Filtered feeds leave these out (the panel has the photo). */
  brand?: Brand;
};

export const media: MediaTile[] = [
  {
    key: "setup",
    src: "/media/darwin-setup.webp",
    video: "/media/darwin-setup.mp4",
    alt: "Darwin sitting down at his desk in the evening and working through a product interface on a large monitor",
    width: 1280,
    height: 720,
    kind: "wide",
    focus: "50% 40%",
    caption: "Where magic happens",
  },
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
