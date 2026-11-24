// Projects feed and project pages. Layout from Figma "Darwin Designer Brand": feed 34:1934,
// project page 43:9981. Copy is drafted from the evidence doc (every claim has a source there)
// and waits for Darwin's approval. Years marked "estimate" below still need his confirmation.

import type { Brand } from "./profile";

export type ProjectImage = { src: string; alt: string; width: number; height: number };

export type Block =
  | { type: "p"; text: string }
  | { type: "h"; text: string }
  | { type: "images"; items: ProjectImage[] }
  | { type: "motion" }
  /** A looping, muted screen recording. Portrait clips render as a phone-width column. */
  | { type: "video"; src: string; poster: string; alt: string; width: number; height: number };

/** A Lottie animation served from public/motion. */
export type MotionClip = { src: string; label: string; width: number; height: number };

export type Project = {
  slug: string;
  year: number;
  /** Employer or engagement shown after the year. A brand gets its logo; otherwise text only. */
  employer: { label: string; brand?: Brand };
  /** Client, brand or product name shown last in the meta line. */
  client: string;
  /** Live site, shown at the end of the meta line on the project page. */
  url?: string;
  description: string;
  /** The blue label that pops on hover: what story the project page tells. */
  teaser: string;
  /** Feed image. Projects without one get a typographic cover until assets are gathered. */
  image?: ProjectImage;
  /** Full-width Tunnel Strip carousel in the feed: needs at least 5 images, else the card shows. */
  carousel?: string[];
  /** Lottie animations: played in the card instead of an image, and by a "motion" block. */
  motion?: MotionClip[];
  story: Block[];
};

const img = (src: string, alt: string, width: number, height: number): ProjectImage => ({
  src: `/images/projects/${src}`,
  alt,
  width,
  height,
});

const STATEMENTS = img(
  "statements.webp",
  "Statements: a paid payment with its two invoices, each with reception date, status, payment date and amount",
  1000,
  504,
);
const COCUY = img(
  "cocuy.webp",
  "Cover of Cocuy, the 1P Main Library, over a photo of the Púlpito del Diablo in El Cocuy",
  1000,
  562,
);
const SPICE = img(
  "spice-org.webp",
  "Spice.org home page: the headline, install and docs buttons, and a SQL query explorer",
  1000,
  694,
);
const SPICE_CAPS = img(
  "spice-org-capabilities.webp",
  "Spice.org capability cards: federated data access, data acceleration, self-hostable and open source, secure AI/ML gateway",
  1000,
  743,
);
const SPICE_INSTALL = img(
  "spice-org-install.webp",
  "Spice.org install section: CLI commands per operating system above a code-editor demo",
  1000,
  1007,
);
const NEON = img(
  "neon-wood.webp",
  "Neon Wood home page: a full-bleed apartment photo with a floating card to pick a location and apartment type",
  1000,
  564,
);
const ABACUS = img(
  "abacus.webp",
  "Abacus Tierpark Hotel home page: an aerial park view behind the headline and a compact booking bar",
  1000,
  556,
);

const CONTRACTS_COVER = img("contracts-cover.webp", "Coverbase Contracts: a renewal timeline of contracts with notice deadlines, framed by a contract detail and a reviews view", 1600, 1000);
const VENDOR_REGISTRY_COVER = img("vendor-registry-cover.webp", "Charles River Vendor Registry Portal: a search for a meeting-transcription tool with approved, conditional and in-review results", 1600, 1000);
const INSPECT_ZERO_TOUCH_COVER = img("inspect-zero-touch-cover.webp", "Coverbase Inspect: discovered SaaS apps, posture score and a list of inspections with their status", 1600, 1000);
const CENCORA_AUDIT_COVER = img("cencora-audit-cover.webp", "Cencora workflow audit: the new-vendor form with fields used by workflows, beside vendor and overview screens", 1600, 1000);
const COVERBASE_DESIGN_SYSTEM_COVER = img("coverbase-design-system-cover.webp", "Coverbase UI Library 2026: the library cover beside color ramps and the button documentation", 1600, 1000);
const CAB_SITE_COVER = img("cab-site-cover.webp", "Customer Advisory Board landing page: meeting title and date beside a four-digit code entry over a vineyard photo", 1600, 1000);
const RAINFOREST_KIDS_COVER = img("rainforest-kids-cover.webp", "Rainforest Foundation kids course: a sloth guide asks a fill-in-the-blank question about greenhouse gases", 1600, 1000);
const ASSESSMENTS_COVER = img("assessments-cover.webp", "Coverbase assessment results: score, controls evaluated and an analysis summary with strengths, weaknesses and actions", 1600, 1000);
const APPRAISER_COVER = img("appraiser-cover.webp", "Coverbase Appraiser: review and submit a pre-filled vendor questionnaire", 1600, 1000);
const ALLTHENTICATE_COVER = img("allthenticate-cover.webp", "Allthenticate app: Touch ID sign-in and a list of doors and devices to unlock, with brand iconography and patterns", 1600, 1000);
const BFF_COVER = img("bff-cover.webp", "BFF app: talent lists, service menus and booking flows on a grid of phones", 1600, 1000);
const CHECK_MIG_COVER = img("check-mig-cover.webp", "Check Mig: migration registration flow screens, a travel record and the design system", 1600, 1000);
const COVERBASE_WEBSITE_COVER = img("coverbase-website-cover.webp", "Coverbase website: a customer video hero with the headline Agentic third-party risk and security", 1600, 1000);
const SPICE_AI_WEBSITE_COVER = img("spice-ai-website-cover.webp", "Spice AI website: the hero, The Data and AI Stack in One Engine, beside a SQL playground", 1600, 1000);
const SWIPPR_COVER = img("swippr-cover.webp", "Swippr website: Find your next job for free, with the free plan's features", 1600, 1000);
const NOMICOL_COVER = img("nomicol-cover.webp", "Nomicol payroll web app: period summary with payroll status and the employee list, plus the mobile sign-up", 1600, 1000);
const DOCUCOL_COVER = img("docucol-cover.webp", "Docucol: the assigned documents list beside an illustration of a person signing", 1600, 1000);
const SWEAT_440_COVER = img("sweat-440-cover.webp", "Sweat 440: station screens for group classes and the trainer video console", 1600, 1000);
const CHARMED_COVER = img("charmed-cover.webp", "Charmed HUB: the texture generator on a 3D potion bottle, between the folder and geometry views", 1600, 1000);
const ATLAS_COVER = img("atlas-cover.webp", "Atlas leads capture: Explore our 3D navigator tools, with a 3D capture of a garage", 1600, 1000);
const AUGMEND_COVER = img("augmend-cover.webp", "Augmend workspace: an incident summary with its hypothesis beside shared windows and a CloudWatch log", 1600, 1000);
const COOL_EARTH_COVER = img("cool-earth-cover.webp", "Cool Club by Cool Earth: badges and certificates on the home, beside the Learn section and the leaderboard", 1600, 1000);
const SWIPPR_B2B_CLIENTS = img("swippr-b2b-clients.webp", "Swippr B2B admin: the clients list, each client with open positions and buttons to view it or add a position", 1600, 978);
const SWIPPR_B2B_LOGIN = img("swippr-b2b-login.webp", "Swippr B2B admin sign-in: Welcome to Swippr, with Continue with Google", 1600, 978);
const ML = { label: "Mercado Libre", brand: "mercadolibre" } as const;
const CB = { label: "Coverbase", brand: "coverbase" } as const;
const TT = { label: "Toptal", brand: "toptal" } as const;
const RV = { label: "Red Valley", brand: "redvalley" } as const;

const CB_NOTE =
  "Coverbase is an AI procurement and vendor-risk platform from San Francisco. I joined as its first designer in November 2024, part-time at first and full-time from February 2026, and I own product design end to end.";
const PC_COVER = img(
  "parque-caudal-cover.webp",
  "Parque Caudal hero: the PARQUE caudal wordmark over a deep blue sky, the brick building rising behind it and foliage framing the edges",
  1440,
  900,
);
const PC_CARD = img(
  "parque-caudal-card.webp",
  "Parque Caudal hero: the PARQUE caudal wordmark over a deep blue sky, with the brick building and foliage below",
  1120,
  800,
);
const PC_PROJECT = img(
  "parque-caudal-project.webp",
  "El proyecto section: Un proyecto pensado a otra escala, with the figures 15 apartments, 5 floors and 3 typologies beside a render of planted terraces",
  1440,
  900,
);
const PC_GALLERY = img(
  "parque-caudal-gallery.webp",
  "Gallery section: Conoce Parque Caudal, with the facade render large and four thumbnails for facade, terraces, access and roof",
  1440,
  1296,
);
const PC_PALETTE = img(
  "parque-caudal-palette.webp",
  "Visual system: the Tierra, Arena, Cielo, Hoja and Café color primitives taken from the hero",
  1400,
  1160,
);
const PC_TYPE = img(
  "parque-caudal-type.webp",
  "Visual system: the Geist type scale from Display to Navegación, at mobile and desktop sizes",
  1400,
  1568,
);

const TT_NOTE =
  "I worked as a Staff Product Designer consultant through Toptal, logging more than 2,200 hours across eight clients, and led and executed each project end to end.";
const RV_NOTE =
  "I was Head UX Designer at Red Valley, a Medellín agency, from 2021 to 2022, and led and executed each project end to end.";

export const projects: Project[] = [
  // ---------- 2026 ----------
  {
    slug: "neon-wood",
    year: 2026,
    employer: { label: "Freelance" },
    client: "Neon Wood",
    url: "https://neonwood.com/",
    description: "A website for furnished apartments and community spaces in four German cities.",
    teaser: "One floating card for location, apartment type and all-inclusive rent, right in the hero",
    image: NEON,
    story: [
      { type: "images", items: [NEON] },
      {
        type: "p",
        text: "Neon Wood rents furnished apartments and community spaces in Berlin, Cologne, Frankfurt and Tübingen. I designed the website through Cresco, a Berlin studio, and led and executed it end to end. It is live at neonwood.com.",
      },
      { type: "h", text: "The decision on top of the photo" },
      {
        type: "p",
        text: "The home hero puts the decision on a full-bleed photo. A floating card switches between apartments and community spaces, picks a location and an apartment type with its all-inclusive monthly rent, and offers two actions: book a visit or rent an apartment.",
      },
      { type: "h", text: "A whole site, not a home page" },
      {
        type: "p",
        text: "The site maps out location and building pages, a city overview, room categories and types, promotions, pricing, partners, events, sustainable living, an app page, a page for parents, a blog, about, contact and legal pages, with mobile layouts at 430 px for the key pages. Each review got its own dated design round, from March to July 2026, next to a logo, a style guide, illustrations and a sitemap.",
      },
    ],
  },
  {
    slug: "parque-caudal",
    year: 2026,
    employer: { label: "Freelance" },
    client: "Parque Caudal",
    description: "A pre-launch landing page for a 15-apartment building in Villavicencio, Colombia.",
    teaser: "WhatsApp first: a one-page launch that lets buyers start the conversation",
    image: PC_CARD,
    story: [
      { type: "images", items: [PC_COVER] },
      {
        type: "p",
        text: "Parque Caudal is a five-floor residential building with 15 apartments in three typologies, in Villavicencio, Colombia. The client needed a simple, credible one-page site to launch it and test early interest before investing in more sales tooling. I directed the design in November 2026, with Claude as an AI collaborator connected to Figma. The project is in its design phase and has not launched yet.",
      },
      { type: "h", text: "Answering a buyer’s questions in order" },
      {
        type: "p",
        text: "The page follows the questions a buyer asks: what it is, what the apartments are like, where it is and how to get more information. Location and size surface early, and nothing useful sits behind a form. The client supplied one exterior render and a floor plan, so every image is a crop of that render, and every fact the client has not confirmed carries a visible pending tag instead of invented copy.",
      },
      { type: "images", items: [PC_PROJECT, PC_GALLERY] },
      { type: "h", text: "WhatsApp first, the form second" },
      {
        type: "p",
        text: "I made WhatsApp the primary action across the page, in the hero, on each apartment card, after the FAQs and in the contact section, with the lead form as a second, passive option. People prefer to send a message and stay in control rather than wait for a callback. The FAQs come from a quick benchmark of what Colombian buyers ask about off-plan purchases: delivery date, how their money is protected, payment plans, financing, parking and visiting a sales room.",
      },
      { type: "h", text: "A visual system taken from the hero" },
      {
        type: "p",
        text: "I designed the hero and the first section, and the rest of the system was derived from them: earth, sand, sky and leaf color primitives, dark and light theme modes that alternate by section, and a Geist type scale for mobile and desktop. I also had the PARQUE wordmark vectorized letter by letter from a raster source, with equal stems and optical kerning.",
      },
      { type: "images", items: [PC_PALETTE, PC_TYPE] },
      { type: "h", text: "Motion from the design layers" },
      {
        type: "p",
        text: "The hero is built as layers: sky, building, foliage and interface. That made a parallax intro possible straight from the Figma layers, rendered frame by frame. My one rule was that no hard edge could ever show, so every frame was checked along the seams. The clip below runs the intro and a scroll into the project section on mobile.",
      },
      {
        type: "video",
        src: "/media/parque-caudal-hero.mp4",
        poster: "/media/parque-caudal-hero.webp",
        alt: "Mobile hero intro: the wordmark and building settle in with parallax, then the page scrolls to the project section with 15 apartments, 5 floors and 3 typologies",
        width: 590,
        height: 1276,
      },
    ],
  },
  {
    slug: "abacus",
    year: 2026,
    employer: { label: "Freelance" },
    client: "Abacus Tierpark Hotel",
    url: "https://www.abacus-hotel.de/en",
    description: "A website redesign for a Berlin hotel next to Tierpark, with booking up front.",
    teaser: "Before and after: a home page that leads with the park and a one-line booking bar",
    image: ABACUS,
    story: [
      { type: "images", items: [ABACUS] },
      {
        type: "p",
        text: "A website redesign for a hotel next to Tierpark Berlin, designed through Cresco. I led and executed it end to end, and the new site is live at abacus-hotel.de.",
      },
      { type: "h", text: "Where Berlin slows down" },
      {
        type: "p",
        text: "The hero sets an aerial park view behind the logo and a serif italic headline, with a compact booking bar for dates, guests and reserve, and a link to location and parking. The home page is shown as a before-and-after pair, with alternative headline treatments and a responsive version at 400 px.",
      },
      {
        type: "p",
        text: "The architecture covers the hotel (rooms, amenities, gastronomy, location and parking, benefits for families, special offers), event spaces, the restaurant, contact and a booking flow, supported by logo, style guide, components and assets pages.",
      },
    ],
  },
  {
    slug: "contracts",
    year: 2026,
    employer: CB,
    client: "Contracts",
    description: "Contract management inside Coverbase's vendor-risk platform.",
    teaser: "From a contracts area to clause-by-clause review with Contract Guardian",
    image: CONTRACTS_COVER,
    story: [
      { type: "images", items: [CONTRACTS_COVER] },
      { type: "p", text: CB_NOTE },
      {
        type: "p",
        text: "Two finished files cover contract work: Contracts, with a cover dated September 2026, and Clause Review, Contract Guardian v1, which reviews contracts clause by clause.",
      },
    ],
  },
  {
    slug: "vendor-registry",
    year: 2026,
    employer: CB,
    client: "Vendor Registry Portal",
    description: "The Vendor Registry Portal, one of Coverbase's finished product areas.",
    teaser: "A finished portal design, dated September 2026",
    image: VENDOR_REGISTRY_COVER,
    story: [
      { type: "images", items: [VENDOR_REGISTRY_COVER] },
      { type: "p", text: CB_NOTE },
      {
        type: "p",
        text: "The Vendor Registry Portal is one of the product areas I marked as finished design, with a cover dated September 2026.",
      },
    ],
  },
  {
    slug: "radar",
    year: 2026,
    employer: CB,
    client: "Radar",
    description: "Radar, a Coverbase product surface redesigned through three versions.",
    teaser: "Why Radar needed a v2 and then a v3 within a year",
    story: [
      { type: "p", text: CB_NOTE },
      {
        type: "p",
        text: "Radar went through v2 and v3, both marked finished, with the v3 cover dated October 2026. The version numbers show the surface was redesigned more than once as the product grew.",
      },
    ],
  },
  {
    slug: "cencora-audit",
    year: 2026,
    employer: CB,
    client: "Cencora workflow audit",
    description: "A design audit of a customer's workflow, with dashboard and configuration studies.",
    teaser: "A customer workflow audit, with dashboard and configuration architecture studies",
    image: CENCORA_AUDIT_COVER,
    story: [
      { type: "images", items: [CENCORA_AUDIT_COVER] },
      { type: "p", text: CB_NOTE },
      {
        type: "p",
        text: "The Cencora Workflow design audit sits in the Design Audit folder next to a dashboard architecture study and a configuration architecture board. The cover is dated June 2026.",
      },
    ],
  },
  {
    slug: "cab-site",
    year: 2026,
    employer: CB,
    client: "Customer Advisory Board",
    description: "A code-gated landing page for Coverbase's Customer Advisory Board meeting.",
    teaser: "A private entry screen: meeting title, date and a four-digit code over a full-bleed photo",
    image: CAB_SITE_COVER,
    story: [
      { type: "images", items: [CAB_SITE_COVER] },
      { type: "p", text: CB_NOTE },
      {
        type: "p",
        text: "A landing page for the Customer Advisory Board meeting in April 2026. The prototype opens on a code-gated entry screen over a full-bleed photo, with the meeting title and date beside a four-digit code input.",
      },
    ],
  },
  {
    slug: "spice-ai-website",
    year: 2026,
    employer: { label: "Spice AI" },
    client: "Website and design system",
    description: "The Spice AI website, its design system and media kit.",
    teaser: "One system behind the website, the design system and the media kit",
    image: SPICE_AI_WEBSITE_COVER,
    story: [
      { type: "images", items: [SPICE_AI_WEBSITE_COVER] },
      {
        type: "p",
        text: "Spice AI builds an open-source runtime that gives developers one SQL interface to query and accelerate data from databases, warehouses and lakes. I started working with them through Toptal and continued as a part-time client.",
      },
      {
        type: "p",
        text: "The Spice AI folder holds the website design from February 2026, the Spice AI design system and a media kit, with the old website kept for comparison.",
      },
    ],
  },

  // ---------- 2025 ----------
  {
    slug: "spice-org",
    year: 2025,
    employer: { label: "Spice AI" },
    client: "Spice.org",
    description: "A developer site for Spice, an open-source SQL runtime for data and AI apps.",
    teaser: "A live query explorer in the hero, so developers see the product before they install it",
    image: SPICE,
    story: [
      { type: "images", items: [SPICE, SPICE_CAPS, SPICE_INSTALL] },
      {
        type: "p",
        text: "Spice AI builds an open-source runtime with a unified SQL interface for querying and accelerating data from databases, warehouses and lakes. Spice.org is its developer-facing site. I started working with Spice AI through Toptal and continued with them as a part-time client.",
      },
      { type: "h", text: "Show the product in the hero" },
      {
        type: "p",
        text: "The hero states the product in one line and pairs Installation and Documentation buttons with a live query explorer: a sample SQL query on one side, a results panel on the other, and arrows to step through example queries.",
      },
      { type: "h", text: "From capabilities to the CLI" },
      {
        type: "p",
        text: "The page continues through customer logos, four capability cards, example use cases, a before-and-after architecture diagram, an install section with CLI commands for macOS, Linux and Windows, a code-editor demo and a closing call to action. The file holds three dated high-fidelity rounds, wireframes, a responsive set at 393 px, components, an icon library, and color, spacing and border tokens.",
      },
    ],
  },
  {
    slug: "cocuy",
    year: 2025,
    employer: ML,
    client: "Cocuy",
    description: "The B2B component library I started for Mercado Libre's First Party tools.",
    teaser: "From launch in June to 62,000+ component insertions and a squad of its own",
    image: COCUY,
    story: [
      { type: "images", items: [COCUY] },
      {
        type: "p",
        text: "Cocuy is a B2B sub-library of Andes, Mercado Libre's design system, and the component library behind First Party's vendor and internal tools. I started the initiative and did all of its design execution; other designers began contributing once it gained traction.",
      },
      { type: "h", text: "Results" },
      {
        type: "p",
        text: "From its launch on June 19, the library logged more than 62,000 component insertions in design files and grew past 20 components, patterns and guidelines. A Cocuy squad was formed to build its technical path. Navbar is its most used component, with 12,920 instances.",
      },
      { type: "h", text: "Fixing the frame every tool shares" },
      {
        type: "p",
        text: "The work standardized resolutions, grids, spacing and container widths, and produced a single Layout component with breadcrumbs, navbar, side menu, headers and toolbars built in. The navbar and side menu were unified and published as one component, with Andes-compliant iconography and rules for behavior, color, size, spacing and labels.",
      },
      {
        type: "p",
        text: "Next on the roadmap: make Cocuy an official satellite library of Andes, migrate reusable patterns to the Seller Experience library, and build it in code as 1P UI Core.",
      },
    ],
  },
  {
    slug: "appraiser",
    year: 2025, // estimate
    employer: CB,
    client: "Appraiser V2",
    description: "One Coverbase product surface, from low-fidelity rounds to high fidelity.",
    teaser: "Every round saved as a dated version: how Appraiser evolved",
    image: APPRAISER_COVER,
    story: [
      { type: "images", items: [APPRAISER_COVER] },
      { type: "p", text: CB_NOTE },
      {
        type: "p",
        text: "The Appraiser V2 file runs from low-fidelity rounds to high-fidelity rounds, each saved as a dated version, which makes it the clearest record of one Coverbase surface evolving over time.",
      },
    ],
  },
  {
    slug: "assessments",
    year: 2025, // estimate
    employer: CB,
    client: "Assessments",
    description: "Vendor assessments in Coverbase, designed through dated iterations.",
    teaser: "Dated iterations from April and May, through to a finished design",
    image: ASSESSMENTS_COVER,
    story: [
      { type: "images", items: [ASSESSMENTS_COVER] },
      { type: "p", text: CB_NOTE },
      { type: "p", text: "Assessments is marked finished, with dated iteration files from April and May." },
    ],
  },
  {
    slug: "inspect-zero-touch",
    year: 2025, // estimate
    employer: CB,
    client: "Inspect and Zero Touch",
    description: "Two Coverbase product areas, each redesigned into a v2.",
    teaser: "Inspect v2 and Zero Touch v2, both finished",
    image: INSPECT_ZERO_TOUCH_COVER,
    story: [
      { type: "images", items: [INSPECT_ZERO_TOUCH_COVER] },
      { type: "p", text: CB_NOTE },
      { type: "p", text: "Inspect v2 and Zero Touch v2 are both marked finished design work." },
    ],
  },
  {
    slug: "coverbase-design-system",
    year: 2025, // estimate
    employer: CB,
    client: "V2 Brand and UI Library",
    description: "The design system Coverbase's product and marketing share.",
    teaser: "One brand library and one UI library for product and marketing",
    image: COVERBASE_DESIGN_SYSTEM_COVER,
    story: [
      { type: "images", items: [COVERBASE_DESIGN_SYSTEM_COVER] },
      { type: "p", text: CB_NOTE },
      {
        type: "p",
        text: "I built the design system shared by product and marketing as two published libraries: Coverbase V2 Brand and Coverbase V2 UI Library.",
      },
    ],
  },
  {
    slug: "coverbase-website",
    year: 2025, // estimate
    employer: CB,
    client: "Marketing website",
    description: "Coverbase's marketing website, case studies, changelog and campaign assets.",
    teaser: "Website v3, case studies and a lead-magnet report on third-party risk in the age of AI",
    image: COVERBASE_WEBSITE_COVER,
    story: [
      { type: "images", items: [COVERBASE_WEBSITE_COVER] },
      { type: "p", text: CB_NOTE },
      {
        type: "p",
        text: "Marketing Website v3, a case-study template and its redesign, a changelog, and marketing assets for social posts, email templates, a one-pager, a sales deck, print material and a lead-magnet report on third-party risk management in the age of AI.",
      },
    ],
  },

  // ---------- 2024 ----------
  {
    // Employer and year are a guess from the files (yellow palette, bills, Spanish names): confirm with Darwin.
    slug: "motion",
    year: 2024,
    employer: ML,
    client: "Motion",
    description: "Lottie animations for product moments: a greeting, a team, a bill and a bill with a warning.",
    teaser: "Four looping animations, the largest under 125 KB",
    motion: [
      { src: "/motion/saludo.json", label: "Greeting", width: 320, height: 160 },
      { src: "/motion/team.json", label: "Team", width: 320, height: 160 },
      { src: "/motion/bill.json", label: "Bill", width: 100, height: 100 },
      { src: "/motion/bill-warning.json", label: "Bill warning", width: 100, height: 100 },
    ],
    story: [
      { type: "motion" },
      {
        type: "p",
        text: "Four Lottie animations: two spot illustrations, a greeting and a team, and two icons, a bill and a bill with a warning. Each one loops and is light enough to load like an image: the icons are 8 and 14 KB, the illustrations 109 and 123 KB.",
      },
    ],
  },
  {
    slug: "statements",
    year: 2024,
    employer: ML,
    client: "Statements",
    description: "One place for vendors selling to Mercado Libre to track every payment and invoice.",
    teaser: "Making payment dates honest: states, differences and late payments a vendor can trust",
    image: STATEMENTS,
    story: [
      { type: "images", items: [STATEMENTS] },
      {
        type: "p",
        text: "Vendors who sell to Mercado Libre had their financial documents spread across several systems, handled manually, and internal teams fielded a steady stream of questions about document status, payment dates and amounts. The goal: let vendors see and manage every financial movement from a single section, and cut those questions. As UX Technical Lead for First Party, I led the project and designed it myself.",
      },
      { type: "h", text: "A payment, then the documents inside it" },
      {
        type: "p",
        text: "The page leads with the payment itself: ID, date, status, document count and total received. Each invoice row below carries reception date, number, status, payment date and amount. A side panel tracks documents still to upload and offers a payment report, and the page can be scoped to one subsidiary.",
      },
      { type: "h", text: "Making payment dates honest" },
      {
        type: "p",
        text: "Rows move through in review, differences to resolve, approved, paid and cancelled. When amounts don't match, the row strikes the original amount, shows the new one, and prompts to upload a credit note or download the differences. Tooltips explain the estimated date and the late-payment rule.",
      },
      { type: "h", text: "Everything around the happy path" },
      {
        type: "p",
        text: "The file covers onboarding, empty states, a blocked account, single and multiple subsidiaries, pagination, access without permissions, the help form and entry points from purchase orders and shipments. Every screen starts with a stated screen objective, and the empty-state illustrations were rebuilt into animation-ready layers for After Effects.",
      },
    ],
  },
  {
    slug: "bulk-search",
    year: 2024,
    employer: ML,
    client: "Bulk search",
    description: "A search field that takes dozens of IDs at once, for First Party's internal tools.",
    teaser: "Covering a case Andes didn't: paste dozens of IDs, search once",
    story: [
      {
        type: "p",
        text: "Shown in Pandora's First Party offer-removal tool, the bulk search field takes dozens of IDs at once. It solves a use case Andes did not cover, as a complement to it, works with or without split view, and comes with its own guidelines, wordings and toolbar integration. It was implemented.",
      },
    ],
  },
  {
    slug: "technical-errors",
    year: 2024,
    employer: ML,
    client: "Technical errors",
    description: "One language for 403, 404, 500 and offline errors across First Party tools.",
    teaser: "From unstyled browser pages to one documented pattern every team adopted",
    story: [
      {
        type: "p",
        text: "Every First Party tool handled 403, 404, 500, offline and mobile errors differently, from unstyled browser pages to mismatched illustrations. The work documented the most frequent errors, wrote guidance for each type, and got First Party teams to adopt the standard illustrations and wordings, aligned with the front-end technical lead so it could ship as a pattern.",
      },
    ],
  },
  {
    slug: "screen-objectives",
    year: 2024,
    employer: ML,
    client: "Screen objectives",
    description: "A working method that ties every screen to a business and communication objective.",
    teaser: "Templates, guidelines and an AI prompt that checks whether an objective is well written",
    story: [
      {
        type: "p",
        text: "A method for the team rather than a screen: guidelines with do's and don'ts, a template that breaks business objectives down into experience, communication and screen objectives, and an AI prompt that checks whether an experience objective is well written. Figma components attach the objectives to every screen; Statements uses them throughout.",
      },
    ],
  },
  {
    slug: "cool-earth",
    year: 2024,
    employer: TT,
    client: "Cool Earth",
    description: "A gamified donor experience that won Toptal's global hackathon.",
    teaser: "Leading design for the winning team, from design sprint to UI library",
    image: COOL_EARTH_COVER,
    story: [
      { type: "images", items: [COOL_EARTH_COVER] },
      {
        type: "p",
        text: "I led design for Cool Earth's gamified donor experience in Toptal's global hackathon in Q1 2024, which our team won. The work runs from a design sprint board through explorations to a published Cool Earth UI library.",
      },
    ],
  },
  {
    slug: "rainforest-kids",
    year: 2024,
    employer: { label: "Volunteer", brand: "rainforest" },
    client: "Rainforest Foundation US",
    description: "A section of the Rainforest Foundation US website made for kids.",
    teaser: "From a sitemap and tree testing to a kids' section of the website",
    image: RAINFOREST_KIDS_COVER,
    story: [
      { type: "images", items: [RAINFOREST_KIDS_COVER] },
      {
        type: "p",
        text: "As a volunteer from 2022 to 2024, I designed the kids' section of the Rainforest Foundation US website, with wireframes, mockups and assets. Related work covers the main website library, a sitemap, tree-testing conclusions and insights, and the 2024 annual report.",
      },
    ],
  },

  // ---------- 2023 (estimates) ----------
  {
    slug: "charmed",
    year: 2023, // estimate
    employer: TT,
    client: "Charmed",
    description: "A suite of AI-assisted creation tools for game creators.",
    teaser: "Hub, texture generator, 3D designer and animator under one design system",
    image: CHARMED_COVER,
    story: [
      { type: "images", items: [CHARMED_COVER] },
      { type: "p", text: TT_NOTE },
      {
        type: "p",
        text: "Charmed's suite covers HUB 2.0, Texture generator 2.0, 3D Designer, 3D Animator MVP, Geometry generator MVP and a Unity plugin, plus a design system, branding, onboarding, marketing emails and the website.",
      },
    ],
  },
  {
    slug: "atlas",
    year: 2023, // estimate
    employer: TT,
    client: "Atlas",
    description: "One product organized around three roles: contractors, clients and admins.",
    teaser: "Designing one product for three kinds of users",
    image: ATLAS_COVER,
    story: [
      { type: "images", items: [ATLAS_COVER] },
      { type: "p", text: TT_NOTE },
      {
        type: "p",
        text: "The pilot handoff has passwordless and password sign-in, capture, profile and subscription, a contractor area for projects and clients, a client area for captures, and an admin area for projects, clients, team, lead capture and measurement requests, followed by an MVP handoff and a Scenarios AI file.",
      },
    ],
  },
  {
    slug: "augmend",
    year: 2023, // estimate
    employer: TT,
    client: "Augmend",
    description: "Product, design system and landing page for Augmend.",
    teaser: "From a demo prototype to brand, pitch and landing page",
    image: AUGMEND_COVER,
    story: [
      { type: "images", items: [AUGMEND_COVER] },
      { type: "p", text: TT_NOTE },
      {
        type: "p",
        text: "Seven files: the product with a demo prototype, the Augmend design system, a landing page with desktop mockups, plus brand, pitch, emails and flows.",
      },
    ],
  },
  {
    slug: "swippr",
    year: 2023, // estimate
    employer: { label: "Founder" },
    client: "Swippr",
    description: "A product I founded, took to production and sold.",
    teaser: "From MVP to a B2B line with its own admin, design system and sales deck",
    image: SWIPPR_COVER,
    carousel: ["pricing", "pitch", "social", "b2b-clients", "b2b-login"].map((n) => `/images/carousel/swippr/${n}.webp`),
    story: [
      { type: "images", items: [SWIPPR_COVER] },
      {
        type: "p",
        text: "Swippr is a product I founded. It went into production and made sales. The record spans an MVP, a second release, white-label websites, then a B2B line with an admin, a design system, landing pages, branding, a one-pager, a sales deck and a pitch, after strategy work on goals, prioritization, information architecture, customer journeys and benchmarks.",
      },
      { type: "h", text: "The B2B admin" },
      {
        type: "p",
        text: "The B2B line came with its own admin for the team placing talent: a sign-in, then a list of client companies with their open positions, where the team can open a client or add a position.",
      },
      { type: "images", items: [SWIPPR_B2B_CLIENTS, SWIPPR_B2B_LOGIN] },
    ],
  },

  // ---------- 2022 ----------
  {
    slug: "nomicol",
    year: 2022,
    employer: RV,
    client: "Nomicol",
    description: "A payroll platform that moves small businesses off spreadsheets.",
    teaser: "14 interviews, two sprints, and a payroll summary managers can read at a glance",
    image: NOMICOL_COVER,
    story: [
      { type: "images", items: [NOMICOL_COVER] },
      { type: "p", text: RV_NOTE },
      {
        type: "p",
        text: "Nomicol helps small businesses move payroll off spreadsheets. Businesses register employees and keep a history of payment periods; managers update each period with overtime, deductions and other payments, and employees see the status of their next payment in real time.",
      },
      {
        type: "p",
        text: "As UX lead I ran the process from start to finish: research over two sprints with 14 interviews, a benchmark and desk research, information architecture, interaction design, prototypes, the first release of the platform and the employee mobile app, and usability testing.",
      },
    ],
  },
  {
    slug: "docucol",
    year: 2022,
    employer: RV,
    client: "Docucol",
    description: "Contract lifecycle management: templates, digital signatures and reminders.",
    teaser: "From template to signed contract, with reviewers, reminders and expiration dates",
    image: DOCUCOL_COVER,
    story: [
      { type: "images", items: [DOCUCOL_COVER] },
      { type: "p", text: RV_NOTE },
      {
        type: "p",
        text: "Docucol lets people and companies create contracts from templates, invite others to review or sign digitally, add reminders and expiration dates, and organize documents in folders. I led the process from research and information architecture to user flows, wireframes and high-fidelity prototypes.",
      },
    ],
  },
  {
    slug: "sweat-440",
    year: 2022,
    employer: RV,
    client: "Sweat 440",
    description: "A TV interface redesign and admin portal for a HIIT gym chain.",
    teaser: "Four stations, 40 minutes: redesigning the screens that guide every class",
    image: SWEAT_440_COVER,
    story: [
      { type: "images", items: [SWEAT_440_COVER] },
      { type: "p", text: RV_NOTE },
      {
        type: "p",
        text: "Sweat 440 runs 40-minute sessions split into four 10-minute stations, each guided by TV screens. I redesigned the TV interface, with the exercise video, station count and countdown, and designed an admin portal to create and edit training sessions.",
      },
    ],
  },
  {
    slug: "allthenticate",
    year: 2022,
    employer: RV,
    client: "Allthenticate",
    description: "Dashboard, groups and permissions for an authentication startup.",
    teaser: "Dashboard, groups and permissions, on web and mobile",
    image: ALLTHENTICATE_COVER,
    story: [
      { type: "images", items: [ALLTHENTICATE_COVER] },
      { type: "p", text: RV_NOTE },
      {
        type: "p",
        text: "An authentication startup's dashboard, groups and permissions management, and mobile screens.",
      },
    ],
  },
  {
    slug: "bff",
    year: 2022,
    employer: RV,
    client: "BFF (Best Friend Famoso)",
    description: "An app that connects celebrities with their fans.",
    teaser: "A client web app and design system that connect celebrities and fans",
    image: BFF_COVER,
    story: [
      { type: "images", items: [BFF_COVER] },
      { type: "p", text: RV_NOTE },
      { type: "p", text: "An app connecting celebrities with their fans, with a client web app and a design system." },
    ],
  },
  {
    slug: "check-mig",
    year: 2022,
    employer: { label: "Personal" },
    client: "Check Mig",
    description: "A redesign of Colombia's migration form, to spend less time at the desk.",
    teaser: "Tree testing, task flows and usability tests for a form every traveler fills",
    image: CHECK_MIG_COVER,
    story: [
      { type: "images", items: [CHECK_MIG_COVER] },
      {
        type: "p",
        text: "A personal redesign concept, not the live government service: the form travelers fill out before entering or leaving Colombia, so they can preload trip details and spend less time at immigration.",
      },
      {
        type: "p",
        text: "Travelers complete the registration for themselves and their companions, choose how they travel, and download the resulting certificate. The goal was less time on task and a higher success rate. I ran research, personas, information architecture validated with tree testing, wireframes, a design system, motion and usability testing.",
      },
    ],
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
