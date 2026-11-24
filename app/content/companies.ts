import type { Brand } from "./profile";

// Short context for the side panel that opens when a company is picked in Experience.
// Every line comes from the CV (public/cv/Darwin-Alvarez-CV.pdf) or from Darwin directly (Coverbase customers).
export type CompanyContext = {
  where: string;
  about: string;
  roles: { title: string; dates: string }[];
  facts: { value: string; label: string }[];
  points: string[];
};

export const companies: Partial<Record<Brand, CompanyContext>> = {
  coverbase: {
    where: "San Francisco · Remote",
    about: "AI procurement and vendor-risk platform. $20M Series A, with customers like CVS Health, Cencora and BlackRock.",
    roles: [
      { title: "Founding Designer, full-time", dates: "Feb 2026 – Now" },
      { title: "Founding Designer, contractor", dates: "Nov 2024 – Jan 2026" },
    ],
    facts: [
      { value: "1st", label: "designer hired" },
      { value: "40+", label: "customers" },
    ],
    points: [
      "Joined before the Series A to design the product foundations, brand and marketing site.",
      "Own product design end to end, from research and design sprints to decisions with the founders.",
      "Built the design system that product and marketing share.",
      "Prototype with Claude and ship small front-end features.",
    ],
  },
  mercadolibre: {
    where: "Medellín · Remote",
    about:
      "First Party, the business unit behind vendor and internal-team tools, within the 200+ person Seller Experience org.",
    roles: [
      { title: "UX Technical Lead", dates: "Mar 2024 – Feb 2026" },
      { title: "UX Lead", dates: "Oct 2022 – Mar 2024" },
    ],
    facts: [
      { value: "12", label: "designers and writers led" },
      { value: "6", label: "countries" },
    ],
    points: [
      "Built and led First Party’s design system library.",
      "Led the vendor invoices and payments experience, through to engineering handoff.",
      "Wrote guidelines and ways of working for Seller Experience, and gave technical talks.",
      "Hired and mentored designers, and set quality processes based on metrics.",
    ],
  },
  toptal: {
    where: "Remote",
    about: "Product and UX consultant for AI startups and global companies, through Toptal’s network.",
    roles: [{ title: "Staff Product Designer, consultant", dates: "2022 – 2026" }],
    facts: [
      { value: "2,200+", label: "hours" },
      { value: "8", label: "clients" },
    ],
    points: [
      "Partnered with Madrona Venture Labs and Spice AI, plus other AI startups.",
      "Worked across B2B, game design tools, ITSM, developer tools, fintech and data.",
      "Won Toptal’s global hackathon (Q1 2024) with a donor app for Cool Earth.",
      "Contributed to Toptal’s article on AI prompt usability.",
    ],
  },
  redvalley: {
    where: "Medellín",
    about: "RV Dev, a software agency, where I built the design team from scratch.",
    roles: [{ title: "Head UX Designer", dates: "2021 – 2022" }],
    facts: [
      { value: "0 → 8", label: "design team" },
    ],
    points: [
      "Set up the agency’s UX process and research practice.",
      "Ran each project’s UX process and presented design decisions to stakeholders.",
      "Mentored designers and recruited new team members.",
    ],
  },
};
