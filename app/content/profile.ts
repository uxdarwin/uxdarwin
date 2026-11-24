// Left panel content. Source of truth: Figma "Darwin Designer Brand", frame 34:1934.

export type Brand = "coverbase" | "mercadolibre" | "toptal" | "redvalley" | "figma" | "rainforest";

export type Tenure =
  | { kind: "ongoing"; start: { year: number; month: number } } // month is 1-12, counted inclusively like LinkedIn
  | { kind: "fixed"; months: number };

export type ExperienceItem = {
  company: string;
  role: string;
  brand: Brand;
  tenure: Tenure;
};

export type HighlightItem = {
  title: string;
  subtitle: string;
  date: string;
  brand: Brand;
  preview: {
    src: string;
    alt: string;
    width: number;
    height: number;
    /** Position of the floating preview, relative to the highlights card (from the Figma hover frames). */
    left: number;
    top: number;
  };
};

export const profile = {
  name: "Darwin Álvarez",
  headline: "Founding Product Designer",
  company: { name: "Coverbase", url: "https://coverbase.ai" },
  summary:
    "Staff Product Designer with 11+ years in product design and 8 years leading teams. Prototyping and shipping with AI tools.",
  email: "darwin@uxdarwin.com",
  linkedin: "https://www.linkedin.com/in/darwinalvarezsanchez",
  location: {
    label: "Located in Medellín, Colombia",
    timeZone: "America/Bogota",
    lat: 6.2442,
    lng: -75.5812,
  },
  cv: {
    pdf: "/cv/Darwin-Alvarez-CV.pdf",
    downloadName: "Darwin-Alvarez-CV.pdf",
    pages: [
      { src: "/cv/page-1.webp", width: 1653, height: 2339 },
      { src: "/cv/page-2.webp", width: 1653, height: 2339 },
    ],
  },
};

export const experience: ExperienceItem[] = [
  {
    company: "Coverbase",
    role: "Founding designer",
    brand: "coverbase",
    // Matches "1 yr 11 mos" in Figma as of Nov 2026.
    tenure: { kind: "ongoing", start: { year: 2025, month: 1 } },
  },
  { company: "Mercado Libre", role: "UX Technical Lead", brand: "mercadolibre", tenure: { kind: "fixed", months: 41 } },
  { company: "Toptal", role: "Staff Product Designer", brand: "toptal", tenure: { kind: "fixed", months: 40 } },
  { company: "Red Valley", role: "Head UX Designer", brand: "redvalley", tenure: { kind: "fixed", months: 19 } },
];

export const highlights: HighlightItem[] = [
  {
    title: "Speaker",
    subtitle: "Friends of Figma Community",
    date: "2026",
    brand: "figma",
    preview: {
      src: "/images/highlights/speaker.webp",
      alt: "Darwin speaking on stage at a Friends of Figma event, in front of a slide about designing tables for invoices",
      width: 628,
      height: 389,
      left: 291,
      top: -157,
    },
  },
  {
    title: "Global Hackathon Winner",
    subtitle: "Sponsored by Toptal",
    date: "2024",
    brand: "toptal",
    preview: {
      src: "/images/highlights/hackathon.webp",
      alt: "Toptal Hackathon Q1 2024 cover, the winning Cool Earth donor app and the Toptal congratulations email",
      width: 600,
      height: 443,
      left: 271,
      top: -134,
    },
  },
  {
    title: "Volunteer",
    subtitle: "Rainforest Foundation US",
    date: "2024-2025",
    brand: "rainforest",
    preview: {
      src: "/images/highlights/volunteer.webp",
      alt: "Rainforest Foundation US website home page",
      width: 628,
      height: 380,
      left: 296,
      top: -52,
    },
  },
  {
    title: "Toptal Blog Contribution",
    subtitle: "Designing the Future of AI Prompting",
    date: "2023",
    brand: "toptal",
    preview: {
      src: "/images/highlights/blog.webp",
      alt: "Toptal article “Beyond Text: Designing the Future of AI Prompting”, with Darwin among the featured experts",
      width: 633,
      height: 422,
      left: 281,
      top: -94,
    },
  },
];
