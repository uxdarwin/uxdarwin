// Projects feed and project pages. Layout from Figma "Darwin Designer Brand": feed 34:1934,
// project page 43:9981. Copy is drafted from the evidence doc (every claim has a source there)
// and waits for Darwin's approval. Years marked "estimate" below still need his confirmation.

import type { Brand } from "./profile";

export type ProjectImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** A muted looping clip shown instead of the image; src is then its poster. */
  video?: string;
};

export type Block =
  | { type: "p"; text: string }
  | { type: "h"; text: string }
  | { type: "images"; items: ProjectImage[]; layout?: { x: number; y: number; w: number; rot: number }[]; center?: boolean }
  | { type: "motion" }
  | { type: "mosaic" }
  /** A looping, muted screen recording. Portrait clips render as a phone-width column. */
  | { type: "video"; src: string; poster: string; alt: string; width: number; height: number }
  /** Two overlapping, tilted images with a portrait video between them. */
  | { type: "trio"; left: ProjectImage; video: PageVideoSrc; right: ProjectImage };

export type PageVideoSrc = { src: string; poster: string; alt: string; width: number; height: number };

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
  /** Feed cover video: replaces the image in the card, fitted whole (never cropped). */
  coverVideo?: { src: string; poster: string; width: number; height: number };
  /** A wide card: two thirds of a row, next to a tall photo when one is left. */
  wide?: boolean;
  /** Full-width Tunnel Strip carousel in the feed: needs at least 5 images, else the card shows. */
  carousel?: string[];
  /** Four screen animations shown as a mosaic in the card, and by a "mosaic" block. */
  mosaic?: PageVideoSrc[];
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
const st = (n: string, alt: string, w: number, h: number) => img(`statements-${n}.webp`, alt, w, h);
const ST_ONBOARDING = st("onboarding", "Statements onboarding: a welcome modal over Vendor Central, the first of two steps", 1366, 688);
const ST_EMPTY = st("empty", "Statements empty state: invoices still to upload, with a button to upload them", 1366, 688);
const ST_FILTERS = st("filters", "Statements filters: payment status, payment date, document status, document type and reception date", 884, 786);
const ST_STATES = st("states", "Statements list with every invoice state: in review, differences to resolve with a credit-note banner, approved with its credit note, paid and cancelled", 1366, 1480);
const ST_PARTIAL_DETAIL = st("partial-detail", "Invoice detail during a partial payment: the credit note still to upload, the estimated date and the amount pending", 1366, 696);
const ST_TWO_PAYMENTS = st("two-payments", "Two payments of one invoice, with a banner that sums up both partial payments", 1366, 796);
const ST_PAYMENT_DETAIL = st("payment-detail", "Payment detail: status, payment date, total received and the invoices it includes", 1366, 688);
const ST_BLOCKED = st("blocked", "Blocked payments: a red banner with a path to support, above the payment and documents still to upload", 1366, 851);
const ST_EMAIL = st("email", "Launch email to vendors: Statements is available, and how to give the billing team access", 720, 1088);
const ST_DIAGRAM = st("diagram", "Decision map of every invoice and credit-note state, from upload to paid, including partial payments", 2600, 1302);
const MOTION_MOSAIC: PageVideoSrc[] = [
  { src: "/media/statements/anim1.mp4", poster: "/media/statements/anim1.webp", alt: "Empty state animation: the bill icon draws itself above “You don’t have invoices yet”", width: 688, height: 688 },
  { src: "/media/statements/onb1.mp4", poster: "/media/statements/onb1.webp", alt: "Onboarding step 1 in context: the welcome illustration comes alive inside the modal", width: 1366, height: 688 },
  { src: "/media/statements/onb2.mp4", poster: "/media/statements/onb2.webp", alt: "Onboarding step 2 in context: two teammates animate inside the invite-your-team modal", width: 1366, height: 688 },
  { src: "/media/statements/anim2.mp4", poster: "/media/statements/anim2.webp", alt: "Empty state animation: the bill draws itself and a warning appears above “You have invoices to upload”", width: 688, height: 688 },
];
const MOTION_CLIPS: ProjectImage[] = MOTION_MOSAIC.map((v) => ({ src: v.poster, video: v.src, alt: v.alt, width: v.width, height: v.height }));
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
const PC_PROJECT = img(
  "parque-caudal-project.webp",
  "El proyecto section: Un proyecto pensado a otra escala, with 15 apartments, 5 floors and 3 typologies, common areas as tags and a corner render of the building",
  1440,
  1024,
);
const PC_TYPES = img(
  "parque-caudal-types.webp",
  "Tipologías section: Encuentra tu espacio, three apartment cards with floor plan, area, terrace, parking and a WhatsApp button",
  1440,
  1170,
);
const PC_CONTACT = img(
  "parque-caudal-contact.webp",
  "Contact section: WhatsApp button first, email link second and a callback form third, with the sales team's daily hours",
  1440,
  924,
);
const PC_GALLERY = img(
  "parque-caudal-gallery-full.webp",
  "Gallery section: Conoce Parque Caudal, with the facade render large and eight thumbnails from facade and corner to kitchen, lobby, pool and terrace",
  1440,
  1600,
);
const PC_SYSTEM = img(
  "parque-caudal-system.webp",
  "Visual system sheet: the PARQUE caudal wordmark on a dark panel above the palette and type scale title and the Tierra and Arena color primitives",
  1400,
  1200,
);
const PC_VIDEO = {
  src: "/media/parque-caudal-hero.mp4",
  poster: "/media/parque-caudal-hero.webp",
  alt: "Mobile hero intro: the wordmark and building settle in with parallax, then the page scrolls to the project section with 15 apartments, 5 floors and 3 typologies",
  width: 590,
  height: 1276,
};
const PC_LAYERS = img(
  "parque-caudal-layers.webp",
  "Three phone frames side by side: the client’s raw render, flat and washed out; the same render graded with a deep blue sky and foliage framing the building; and the layer breakdown used for the motion",
  1600,
  1110,
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
    description: "A brand and pre-launch landing page for a 15-apartment building in Villavicencio, Colombia.",
    teaser: "WhatsApp first: a one-page launch that lets buyers start the conversation",
    image: PC_GALLERY,
    coverVideo: { src: PC_VIDEO.src, poster: PC_VIDEO.poster, width: PC_VIDEO.width, height: PC_VIDEO.height },
    story: [
      { type: "trio", left: PC_GALLERY, video: PC_VIDEO, right: PC_SYSTEM },
      {
        type: "p",
        text: "Parque Caudal is a five-floor building with 15 apartments in three typologies, in Villavicencio, Colombia. The developer needed a simple, credible one-page site to launch it and test early interest before investing in more sales tooling. I designed the logo and the website, and I’m also building it for launch. The final design is approved.",
      },
      { type: "h", text: "Answering a buyer’s questions in order" },
      {
        type: "p",
        text: "The page follows the questions a buyer asks: what it is, what the apartments are like, where it is and how to get in touch. Size, the three typologies and the common areas show up early, and nothing useful sits behind a form. I also reworked the renders the client shared. The originals were raw and washed out, so I made them feel more alive while keeping the architecture consistent.",
      },
      { type: "h", text: "WhatsApp first, then email, then the form" },
      {
        type: "p",
        text: "The client asked for a form, plus a WhatsApp button for people who might prefer it. I flipped the order: WhatsApp is the primary action across the page, email comes second and the form third. People don’t want to wait for a callback, and WhatsApp is how most people in Colombia already talk to businesses. I also suggested showing the sales team’s working hours right in the contact section, so people know when to expect an answer.",
      },
      {
        type: "images",
        items: [PC_PROJECT, PC_TYPES, PC_CONTACT],
        // The contact section sits on top and larger than the preset, so the form reads at first glance.
        layout: [
          { x: -17, y: 40, w: 391, rot: 2 },
          { x: 660, y: 120, w: 300, rot: -2 },
          { x: 330, y: 0, w: 430, rot: 0 },
        ],
      },
      { type: "h", text: "A brand built from a single render" },
      {
        type: "p",
        text: "We started with a render of the building and nothing else: no logo, no colors, no type. So I built the visual system around the architecture: the PARQUE caudal logo, a palette taken from the brick, the sky and the foliage, dark and light sections that alternate down the page, and a Geist type scale. Nature is what sets this project apart, and every apartment faces outward with its own terrace and view, so I made it part of the brand, from the foliage framing the hero to the flowing lines behind each section.",
      },
      { type: "images", items: [PC_PALETTE, PC_TYPE] },
      { type: "h", text: "Bringing a flat render to life" },
      {
        type: "p",
        text: "A render is a flat image. I split it into layers (sky, building, foliage and interface) and animated them strategically, with a slow push-in and parallax at different depths, so the hero feels alive instead of static. The clip at the top shows the intro and the scroll into the project section on mobile. Below, from left to right: the raw render, the same render graded with foliage framing the building, and the layers I split it into for motion.",
      },
      { type: "images", items: [PC_LAYERS] },
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
    slug: "statements",
    year: 2025,
    employer: ML,
    client: "Statements",
    description: "One place for vendors selling to Mercado Libre to track every payment and invoice.",
    teaser: "When do I get paid? Why was I deducted? Designing the answers into every row",
    image: STATEMENTS,
    carousel: ["statements", "statements-states", "statements-two-payments", "statements-filters", "statements-blocked", "statements-email", "statements-diagram"].map((n) => `/images/projects/${n}.webp`),
    story: [
      { type: "images", items: [STATEMENTS] },
      {
        type: "p",
        text: "Mercado Libre is Latin America’s largest e-commerce and fintech company. In its First Party model, Mercado Libre buys products from vendors in high volume, with deals that benefit both sides, and sells them on the marketplace through its own seller account. Vendors run that relationship from Vendor Central, and Statements (Cuenta Corriente) is the section where they follow the money: every invoice, credit note and payment between them and Mercado Libre.",
      },
      { type: "h", text: "The problem" },
      {
        type: "p",
        text: "Vendors tracked their invoices by hand, mostly over email, across several teams and channels: Vendor Central, support tickets, and separate email threads for differences and cancellations. With no single view of their account, they couldn’t tell when they would be paid or why an amount was withheld. Price and quantity differences turned into disputes, vendors held back the credit notes that would settle them, invoices stayed blocked and accounts got locked. On Mercado Libre’s side, finance operations answered the same questions again and again and built custom reports vendor by vendor.",
      },
      { type: "h", text: "What research told us" },
      {
        type: "p",
        text: "In May 2025 we interviewed Mercado Libre commercial managers who had worked with Amazon Vendor Central, ran a focus group with the finance operations team, and benchmarked Amazon, Walmart and Falabella. The sample was small, so we treated the findings as hypotheses to validate, but they pointed the same way: vendors’ two most frequent questions were “When do I get paid?” and “Why was this amount withheld or deducted?” That set the priorities: a real-time status and committed payment date for every invoice, a clear explanation of every difference with the documents behind it, and one consolidated balance.",
      },
      { type: "h", text: "My role" },
      {
        type: "p",
        text: "As UX Technical Lead for First Party, I led the project and did all of the design execution, from the brief and research through the final screens and the handoff in October 2025, working with the product manager and the engineering lead.",
      },
      { type: "h", text: "Integrate, don’t replace" },
      {
        type: "p",
        text: "Each First Party product, from purchase orders and commercial agreements to penalties, Meli Pro and Ads, had its own section and its own level of maturity. Rebuilding them all wasn’t realistic, so Statements doesn’t replace them: it pulls the key financial data from each into one view and links back to the source. The MVP covers purchase-order invoices, credit notes and commercial agreements, on a structure built to take Ads, penalties and Meli Pro later.",
      },
      { type: "h", text: "Mapping every state first" },
      {
        type: "p",
        text: "Billing and payments leave no room for surprises, so before drawing a screen I mapped everything that can happen to an invoice from the moment a vendor uploads it: review, differences, credit notes that arrive early, late, for less or for more, cancelled requests, and payments split in two. I built the map in close collaboration with the product specialist and validated it again and again with the team members who handled billing and payments by hand. It ended with close to fifty numbered states, each with the invoice, credit-note and payment status side by side, and it surfaced cases even the product side hadn’t anticipated. Every screen in the flow is one of those states, so engineering and finance could check any case against the same source.",
      },
      { type: "images", items: [ST_DIAGRAM] },
      { type: "h", text: "First visit" },
      {
        type: "p",
        text: "A two-step onboarding introduces the section the first time a vendor opens it: invoices, credit notes and payments, now in one place. Empty states answer the question the vendor came with, even when there’s nothing to list yet. If invoices are still missing, the page says so and points to where to upload them, because those are what start the payment clock.",
      },
      { type: "images", items: [ST_ONBOARDING, ST_EMPTY] },
      { type: "h", text: "A payment, then the documents inside it" },
      {
        type: "p",
        text: "The answer to “when do I get paid?” is a payment, so the page leads with it: ID, date, status, document count and total received. Each invoice row below carries reception date, number, status, payment date and amount. A side panel tracks documents still to upload and offers a payment report, the page can be scoped to one subsidiary, and filters cut the list by late or on-time payment, payment date, document status, document type and reception date.",
      },
      { type: "images", items: [ST_FILTERS] },
      { type: "h", text: "Making payment dates honest" },
      {
        type: "p",
        text: "The answer to “why was I deducted?” has to sit on the row itself. Invoices move through in review, differences to resolve, approved, paid and cancelled. When amounts don’t match, the row strikes the original amount, shows the new one, and a banner right under it says exactly what’s missing: upload a credit note for $40,000 to resolve the differences, with the differences ready to download. An approved credit note sits under the invoice it settles. Tooltips explain how the estimated date is calculated, and a late payment keeps its original date with a “late” label next to it, so the date a vendor was promised never silently moves.",
      },
      { type: "images", items: [ST_STATES] },
      { type: "h", text: "When one invoice is paid twice" },
      {
        type: "p",
        text: "The hardest case to explain was a partial payment. Take a $100,000 invoice with a $40,000 difference: Mercado Libre pays the $60,000 it agrees with, and the rest waits on a credit note. The invoice detail shows that running balance, billed against received, with the credit note still to upload and what’s still pending. Once the second payment lands, the invoice row sums up both payments with their dates, and each payment has its own detail listing the invoices it covered.",
      },
      { type: "images", items: [ST_PARTIAL_DETAIL, ST_TWO_PAYMENTS] },
      { type: "images", items: [ST_PAYMENT_DETAIL] },
      { type: "h", text: "When payments are blocked" },
      {
        type: "p",
        text: "A blocked account was the outcome everyone wanted fewer of, and vendors used to learn about it late. Now it sits at the top of the page in red, with a direct path to the support form to unblock it and a link explaining why accounts get blocked. Right below, the side panel lists exactly which credit notes and invoices are still missing, so the vendor knows what to send.",
      },
      { type: "images", items: [ST_BLOCKED] },
      { type: "h", text: "Getting the right people in" },
      {
        type: "p",
        text: "The people who need Statements are usually a vendor’s billing team, not whoever owns the Vendor Central account. I designed the launch communications too, including an email for vendors that announces the section and walks the account owner through giving their billing team a finance permission in three steps. The design also covers what someone without that permission sees, one tax ID or many subsidiaries, pagination, the help form, and entry points from purchase orders and shipments. Every screen states its objective before its layout, and the empty-state illustrations were rebuilt into animation-ready layers for After Effects.",
      },
      { type: "images", items: [ST_EMAIL] },
      { type: "h", text: "Outcome" },
      {
        type: "p",
        text: "I left Mercado Libre after the handoff, before implementation, so I have no post-launch metrics. The team has since shipped it in stages on this structure: the invoice and credit-note list for every country first, then payments and disputes for Argentina, Chile, Colombia and Peru, and now commercial-agreement credit notes everywhere and payments in Mexico.",
      },
    ],
  },
  {
    slug: "motion",
    year: 2025,
    employer: ML,
    client: "Motion",
    description: "Bringing motion to Mercado Libre’s B2B products, starting with the illustrations.",
    teaser: "A quick win around a frontend bottleneck: animating the illustration system in Lottie",
    wide: true,
    mosaic: MOTION_MOSAIC,
    motion: [
      { src: "/motion/saludo.json", label: "Greeting", width: 320, height: 160 },
      { src: "/motion/team.json", label: "Team", width: 320, height: 160 },
      { src: "/motion/bill.json", label: "Bill", width: 100, height: 100 },
      { src: "/motion/bill-warning.json", label: "Bill warning", width: 100, height: 100 },
    ],
    story: [
      {
        type: "images",
        // Darwin's 2x2 layout: square and wide on top, wide and square below, centred.
        items: MOTION_CLIPS,
        layout: [
          { x: 0, y: 0, w: 360, rot: 0 },
          { x: 372, y: 0, w: 715, rot: 0 },
          { x: 0, y: 372, w: 715, rot: 0 },
          { x: 727, y: 372, w: 360, rot: 0 },
        ],
        center: true,
      },
      {
        type: "p",
        text: "Motion was a long-standing debt at Mercado Libre, especially in its B2B products. Interface animation had to go through frontend development, which was already a bottleneck, so it kept losing to everything else on the roadmap.",
      },
      { type: "h", text: "Start where the assets already exist" },
      {
        type: "p",
        text: "We already had an illustration system, so I led an initiative to animate those illustrations as Lottie files. Lottie plays from a small JSON file, so an animation ships like an image, with no extra frontend work and without weighing the page down. That made it a quick win: designers own the motion end to end, and engineering only places a file.",
      },
      { type: "h", text: "In context" },
      {
        type: "p",
        text: "The first animations went into Statements, the section where vendors follow their payments: the two onboarding steps that welcome a vendor and invite their team, and the empty states for a vendor with no invoices yet or with invoices still to upload. I rebuilt each illustration into separate layers for After Effects so heads, hands and icons could move on their own.",
      },
      { type: "motion" },
      {
        type: "p",
        text: "Four Lottie files came out of it: two spot illustrations, a greeting and a team, and two icons, a bill and a bill with a warning. Each one loops and loads like an image: the icons are 8 and 14 KB, the illustrations 109 and 123 KB.",
      },
      { type: "h", text: "Why it mattered" },
      {
        type: "p",
        text: "It was a small change, but it made the interface feel alive, and it was the first push that got the team adding functional motion to our B2B interfaces.",
      },
    ],
  },
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
