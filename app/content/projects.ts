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
  /** With wide: share the row with the next card instead of a photo. */
  pairNext?: boolean;
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
const WED_VIDEO = {
  src: "/media/wedding/invitation.mp4",
  poster: "/media/wedding/invitation.webp",
  alt: "Scroll through the wedding invitation on a phone: the glowing monogram under a starry sky, the invitation over a cherry blossom scene, the RSVP envelope with its wax seal, the story timeline, the venue, the dress code and the questions",
  width: 800,
  height: 1720,
};
const wed = (n: string, alt: string) => img(`wedding-${n}.webp`, alt, 800, 1732);
const WED_HERO = wed("hero", "The invitation’s opening: the monogram, “we invite you to our wedding” and a button to answer, over cherry blossoms");
const WED_RSVP = wed("rsvp", "The RSVP as an envelope with a wax seal: will you join us, with yes, no and not sure yet, and a thank-you once confirmed");
const WED_STORY = wed("story", "The story timeline: photo cards for each milestone, like where we met, with the place and the year");
const WED_VENUE = wed("venue", "The venue section: an illustrated estate by the water, with buttons for the map and a guide to get there");
const WED_DRESS = wed("dress-code", "The dress code: a fabric palette for guests, with white and similar tones reserved for the bride");
const WED_FAQ = wed("faq", "Other questions, grouped by topic: attendance and guests, schedule, venue and recommendations, and contact");
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
const AB = (n: string, alt: string, w: number, h: number) => img(`abacus-${n}.webp`, alt, w, h);
const AB_VARIATIONS = AB("logo-variations", "Abacus logo: three new white variations on deep green beside the previous blue and gold logo", 1600, 1797);
const AB_SHAPES = AB("shapes", "Six hotel photos with the curves of the rotunda, the lobby floor, the furniture and the spa traced in red", 1920, 1080);
const AB_BUILDING = AB("building-colors", "Colour swatches sampled from the hotel's entrance, lobby, banquet hall, rooms, winter garden and spa", 2000, 1121);
const AB_SURROUNDINGS = AB("surroundings", "The surroundings: Friedrichsfelde Palace and its gardens, giraffes, zebras and the Tierpark entrance", 2000, 1121);
const AB_PRIMARY = AB("primary-colors", "Primary colours: Green 800, Blue 500, Blue 300, Beige 200 and Coral 400", 1800, 991);
const AB_FONTS = AB("fonts", "Fonts: Brandon Grotesque for the logo, Geist Sans for the website", 1800, 991);
const AB_LOGO_PALETTE = AB("logo-palette", "The new logo in white on Green 800 beside blue, light blue, beige and coral panels", 1920, 1080);
const AB_LOGO_PHOTO = AB("logo-photo", "The logo in white on black, and as a translucent mark over a sunset with a giraffe in the circle", 1920, 1080);
const AB_GIRAFFE = AB("logo-giraffe", "The logo with a giraffe's head looking out through the circle", 1200, 1392);
const AB_OLD_HOME = AB("old-home", "The previous Abacus website: grey and blue panels, round photo crops and a blue and gold logo", 1200, 2329);
const AB_OLD_CONFERENCE = AB("old-conference", "The previous conference rooms page: a static floor plan image and a request by email or phone", 1600, 1550);
const AB_EVENT_SPACES = AB("event-spaces", "The new Event Spaces page: room cards with capacity and size, a guests and layout filter, and a floor-plan map", 1758, 1744);
const AB_VIDEO: ProjectImage = { src: "/media/abacus-cover.webp", video: "/media/abacus-cover.mp4", alt: "Scrolling the new Abacus home page: the park hero with the logo and booking bar, then the hotel at night", width: 1080, height: 1080 };
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
const CAB_SITE_COVER = img("cab-site-cover.webp", "Customer Advisory Board landing page: meeting title and date beside a four-digit code entry over a vineyard photo", 1600, 1000);
const RAINFOREST_KIDS_COVER = img("rainforest-kids-cover.webp", "Rainforest Foundation kids course: a sloth guide asks a fill-in-the-blank question about greenhouse gases", 1600, 1000);
const ASSESSMENTS_COVER = img("assessments-cover.webp", "Coverbase assessment results: score, controls evaluated and an analysis summary with strengths, weaknesses and actions", 1600, 1000);
const APPRAISER_COVER = img("appraiser-cover.webp", "Coverbase Appraiser: review and submit a pre-filled vendor questionnaire", 1600, 1000);
const BFF_COVER = img("bff-cover.webp", "BFF: two phones with the fan home page and the request menu (comment, like, follow, greeting, serenade) beside a person holding a BFF sign", 1920, 1320);
const BFF_MOCKUPS = img("bff-mockups.webp", "BFF fan app screens laid out on pink: talent search, featured talent, services, request details and a celebrity video", 1345, 896);
const BFF_CLIENT = img("bff-client-app.webp", "BFF fan app store screens: home with a celebrity video, a 10% first-request offer, services with prices, and occasions", 1566, 685);
const BFF_CELEBRITY = img("bff-celebrity-app.webp", "BFF celebrity app store screens: a cancelled song request, the request list with search and filters, and a pending greeting", 1507, 660);
const BFF_LANDING_HERO = img("bff-landing-hero.webp", "BFF landing page hero: Somos fans de nuestros fans, with two phones showing the app", 1443, 840);
const BFF_LANDING_STEPS = img("bff-landing-steps.webp", "BFF landing page step 3: the request checkout with delivery email, payment method and total", 1443, 840);
const BFF_DASHBOARD = img("bff-dashboard.webp", "BFF admin dashboard: a celebrity's monthly payout with billed total, manager, BFF and payment gateway fees", 1443, 840);
const BFF_DESIGN_SYSTEM = img("bff-design-system.webp", "BFF design system: colours, typography, buttons, inputs, service and request cards, icons and illustrations", 1372, 876);
const CHECK_MIG_COVER = img("check-mig-home.webp", "Check Mig home on the Migración Colombia site: two clear entry points, complete your registration or check and download it", 1463, 810);
const CHECK_MIG_FLOW = img("check-mig-flow.webp", "Check Mig screens: trip direction, means of transport, the lookup form and the downloadable certificate laid out like a ticket", 1472, 792);
const CHECK_MIG_DS = img("check-mig-design-system.webp", "Check Mig design system: colours, type scale, 12-column grid, spacing, buttons, inputs, icons and cards", 1568, 537);
const COVERBASE_WEBSITE_COVER = img("coverbase-website-cover.webp", "Coverbase website: a customer video hero with the headline Agentic third-party risk and security", 1600, 1000);
const SPICE_AI_WEBSITE_COVER = img("spice-ai-website-cover.webp", "Spice AI website: the hero, The Data and AI Stack in One Engine, beside a SQL playground", 1600, 1000);
const SWIPPR_COVER = img("swippr-cover.webp", "Swippr website: Find your next job for free, with the free plan's features", 1600, 1000);
const NOMICOL_DOCUCOL_COVER = img("nomicol-docucol-devices.webp", "Nomicol and Docucol on a laptop, a tablet and two phones, with the matching nc and dc marks", 1452, 833);
const NOMICOL_LANDING = img("nomicol-landing.webp", "Nomicol landing page: Nómina en minutos, no días, with the sign-up on a phone and a customer quote", 1510, 803);
const NOMICOL_BLOG = img("nomicol-blog.webp", "Nomicol landing page: articles on choosing an electronic payroll provider and payroll in the cloud", 1510, 803);
const NOMICOL_DS = img("nomicol-design-system.webp", "Nomicol design system: brand and semantic colours, Poppins type scale, buttons, inputs, icons, illustrations and empty states", 1568, 591);
const DOCUCOL_HERO = img("docucol-hero.webp", "Docucol: the documents you were invited to sign, beside an illustration of a person signing", 1554, 784);
const DOCUCOL_LOGIN = img("docucol-login.webp", "Docucol sign-in: Únete a la revolución legal tech en Colombia", 1497, 808);
const DOCUCOL_TEMPLATES = img("docucol-templates.webp", "Docucol onboarding: templates explained before the first document", 1497, 807);
const DOCUCOL_SIGNATURE = img("docucol-signature.webp", "Docucol onboarding: create your digital signature by drawing it or uploading a file", 1498, 809);
const DOCUCOL_WATERMARK = img("docucol-watermark.webp", "Docucol organization settings: add a watermark to your documents", 1497, 812);
const CHARMED_COVER = img("charmed-cover.webp", "Charmed HUB: the texture generator on a 3D potion bottle, between the folder and geometry views", 1600, 1000);
const ATLAS_3D_SCAN = img("atlas-3d-scan.webp", "Atlas: a 3D scan of a home, built from a client's phone capture, with the photos it came from", 1271, 952);
const ATLAS_ONBOARDING = img("atlas-onboarding.webp", "Atlas client app onboarding: let's get capturing, then steps on moving through the room, looping around it and keeping walls in frame", 2000, 1085);
const ATLAS_CAPTURE = img("atlas-capture.webp", "Atlas client app: capturing a garage by scan or photo, then a confirmation that the 3D model is on its way", 2000, 1418);
const ATLAS_DASHBOARD = img("atlas-dashboard.webp", "Atlas contractor dashboard: projects in progress, recent calls, completed projects, conversion by funnel stage and completed scans", 1456, 818);
const ATLAS_PROJECT = img("atlas-project-detail.webp", "Atlas project detail: the client, call history, and the property's climate trends, history, utility info and 3D scan", 1456, 819);
const ATLAS_LOGIN = img("atlas-login.webp", "Atlas sign-in over a line illustration of a city and its landscape", 1456, 818);
const ATLAS_CALLS_EMPTY = img("atlas-calls-empty.webp", "Atlas calls page empty state, with an illustration of a person on a call", 1456, 818);
const ATLAS_COVER = img("atlas-cover.webp", "Atlas: a garage capture where a contractor adds a Tesla Powerwall to the scene, beside the client onboarding video on keeping the right distance", 1600, 1000);
const AUGMEND_COVER = img("augmend-cover.webp", "Augmend workspace: an incident summary with its hypothesis beside shared windows and a CloudWatch log", 1600, 1000);
const COOL_EARTH_COVER = img("cool-earth-cover.webp", "Cool Club by Cool Earth: badges and certificates on the home, beside the Learn section and the leaderboard", 1600, 1000);
const SWIPPR_SWIPE_CARD = img("swippr-swipe-card.webp", "Swippr job card: location, salary and benefits in sight, a compatibility score, and swipe left, right or Super Swipp", 1512, 1048);
const SWIPPR_PITCH = img("swippr-pitch.webp", "Swippr pitch: talents read a job in under 30 seconds, match, book an interview and chat; companies see candidate profiles, set a budget and review matches", 1000, 1795);
const SWIPPR_SOCIAL = img("swippr-social.webp", "Swippr candidate app on two phones: a job card with its compatibility score, and Start applying to jobs, for free", 1000, 1000);
const SWIPPR_PRICING = img("swippr-pricing.webp", "Swippr pricing page: Find your next job for free, with the free plan for talent", 1000, 802);
const SWIPPR_POST_JOB = img("swippr-post-job.webp", "Swippr: post a job by role, seniority, English level, countries, work mode, skills and monthly salary range", 952, 1240);
const SWIPPR_B2B_HERO = img("swippr-b2b-hero.webp", "Swippr nearshoring landing page: Supercharge your growth with world-class tech talent", 1400, 856);
const SWIPPR_B2B_PROCESS = img("swippr-b2b-process.webp", "Swippr landing page: our proven process, from tailored recruitment to skills validation, interview guidance and candidate reports", 1339, 896);
const SWIPPR_ONE_PAGER = img("swippr-one-pager.webp", "Swippr sales one-pager: organize your candidate data to hire faster, with the platform's import, pipeline and match suggestions", 1003, 1204);
const SWIPPR_TALENT = img("swippr-talent-profile.webp", "Swippr B2B admin: a talent profile with bio, skills, contact, location, resume, English level and recruiter notes", 1400, 656);
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
    description: "A brand refresh and website redesign for a Berlin hotel next to Tierpark.",
    teaser: "A logo and palette drawn from the building and the park, and event spaces that are easy to book",
    image: ABACUS,
    coverVideo: { src: "/media/abacus-cover.mp4", poster: "/media/abacus-cover.webp", width: 1080, height: 1080 },
    story: [
      { type: "images", items: [ABACUS, AB_VIDEO] },
      {
        type: "p",
        text: "A brand refresh and website redesign for a hotel next to Tierpark Berlin, designed through Cresco. I led and executed it end to end, and the new site is live at abacus-hotel.de.",
      },
      { type: "h", text: "A logo taken from the building" },
      {
        type: "p",
        text: "I refreshed the logo too. The previous one was a blue and gold badge with a gradient, and its blue and grey site said nothing about the life around the hotel. I started from the building itself: the rotunda over the entrance, the curved lobby floor with the Abacus emblem set into it, the rounded furniture and the tiled curves of the spa. Those curves became the new mark, a rounded tag with a circle cut through it, drawn in a few variations.",
      },
      { type: "images", items: [AB_SHAPES, AB_VARIATIONS] },
      {
        type: "p",
        text: "The logo palette comes from the same place. I sampled colours from photos of the entrance, the lobby, the banquet hall, the rooms, the winter garden and the spa: teal and petrol, forest green, warm beige, mustard and a deep red.",
      },
      { type: "images", items: [AB_BUILDING] },
      { type: "h", text: "A brand that feels like the park" },
      {
        type: "p",
        text: "The hotel sits next to Tierpark Berlin, Europe's largest landscape zoo, with Friedrichsfelde Palace and its gardens inside it. I wanted the brand to carry that: deep greens, open sky, sand and the warmth of the animals. The style guide sets five primary colours (Green 800, Blue 500, Blue 300, Beige 200 and Coral 400), each with a full ramp, plus light and dark transparency scales. Brandon Grotesque sets the logo and Geist Sans the website, so every page uses the same two fonts.",
      },
      { type: "images", items: [AB_SURROUNDINGS, AB_PRIMARY] },
      { type: "images", items: [AB_LOGO_PALETTE, AB_FONTS] },
      {
        type: "p",
        text: "The circle in the mark leaves room for the place to show through, from a sunset over the savanna to a giraffe looking out.",
      },
      { type: "images", items: [AB_LOGO_PHOTO, AB_GIRAFFE] },
      { type: "h", text: "Where Berlin slows down" },
      {
        type: "p",
        text: "The hero sets an aerial park view behind the logo and a serif italic headline, with a compact booking bar for dates, guests and reserve, and a link to location and parking. The home page is shown as a before-and-after pair, with alternative headline treatments and a responsive version at 400 px.",
      },
      {
        type: "p",
        text: "The architecture covers the hotel (rooms, amenities, gastronomy, location and parking, benefits for families, special offers), event spaces, the restaurant, contact and a booking flow, supported by logo, style guide, components and assets pages.",
      },
      { type: "h", text: "Booking an event space" },
      {
        type: "p",
        text: "Events were the part of the old site that asked the most of visitors. The conference pages showed a static floor plan image, a long table of capacities for every layout, and an email address and phone number for requests.",
      },
      { type: "images", items: [AB_OLD_HOME, AB_OLD_CONFERENCE] },
      {
        type: "p",
        text: "The new Event Spaces page opens with what a planner needs first: 14 spaces for 10 to 280 people, from 27 to 400 m², and the kinds of events they host. Every room is a card with its capacity and size, a floor-plan map highlights the room you pick, and a filter for guests and layout (cinema, parliament, U shape, block, banquet or a circle of chairs) narrows the list. Getting a quote or booking a space is one click from there, and the technology included in each room sits on the same page.",
      },
      { type: "images", items: [AB_EVENT_SPACES] },
      {
        type: "p",
        text: "The room booking flow follows the same system, from room and rate selection to extras, guest details, payment and a confirmation page.",
      },
    ],
  },
  {
    slug: "wedding-invitation",
    year: 2026,
    employer: { label: "Personal" },
    client: "Wedding invitation",
    description: "A wedding invitation built with shader experiments, still in progress.",
    teaser: "Content first, then shaders: a monogram, a sky of stars and falling petals",
    image: WED_HERO,
    coverVideo: { src: WED_VIDEO.src, poster: WED_VIDEO.poster, width: WED_VIDEO.width, height: WED_VIDEO.height },
    story: [
      { type: "trio", left: WED_HERO, video: WED_VIDEO, right: WED_RSVP },
      {
        type: "p",
        text: "Our wedding invitation was a personal challenge. The clients were my fiancée and me, so putting myself in the guests’ shoes came easily. I designed everything, from the monogram and the visuals to the animations, and I’m building and shipping it myself. It isn’t the final version yet.",
      },
      { type: "h", text: "Content first" },
      {
        type: "p",
        text: "As with every landing page, I started with the content, not the visuals. I set UX goals around the questions guests would have, in what order they’d have them and how much detail each one needs. That shaped the page: the invitation and the RSVP first, then our story, the venue and how to get there, the dress code, and the rest of the questions grouped by topic so nobody has to message us to find an answer.",
      },
      { type: "images", items: [WED_STORY, WED_FAQ] },
      { type: "h", text: "Experimenting with shaders" },
      {
        type: "p",
        text: "The second challenge was the visual direction. I wanted to experiment a lot with shaders from Vercel’s vgpu.sh, and I used them for the glowing monogram, the starry sky, and the particles of cherry blossom petals floating off the tree. The stars are interactive: tap the sky and you trigger a shooting star.",
      },
      { type: "h", text: "Rooms with their own mood" },
      {
        type: "p",
        text: "I wanted many references to our relationship, and at the same time a look that holds together. I treated it like interior design: not every room needs the same mood. Each section tells its own story, so the hardest part was the transitions between them, making each change of scene feel smooth rather than abrupt.",
      },
      { type: "images", items: [WED_VENUE, WED_DRESS] },
      { type: "h", text: "What I’d push next" },
      {
        type: "p",
        text: "If I critique my own work, visual consistency is the weakest part of this version, and it’s what I want to work on most in the next iteration. The next big goal is the RSVP system, connected to WhatsApp, which almost all of our guests use, so they get a great experience before and during the wedding.",
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
    slug: "coverbase-brand-marketing",
    year: 2026,
    employer: CB,
    client: "Brand and marketing website",
    description: "Coverbase's marketing website, campaign assets and a private page for its Customer Advisory Board.",
    teaser: "Website v3, case studies, a lead-magnet report and a code-gated advisory board page",
    image: COVERBASE_WEBSITE_COVER,
    wide: true,
    pairNext: true,
    story: [
      { type: "images", items: [COVERBASE_WEBSITE_COVER, CAB_SITE_COVER] },
      { type: "p", text: CB_NOTE },
      {
        type: "p",
        text: "I designed Coverbase's brand and marketing updates on top of the Coverbase V2 Brand library: Marketing Website v3, a case-study template and its redesign, a changelog, and marketing assets for social posts, email templates, a one-pager, a sales deck, print material and a lead-magnet report on third-party risk management in the age of AI.",
      },
      {
        type: "p",
        text: "For the Customer Advisory Board meeting in April 2026, I designed a private landing page. The prototype opens on a code-gated entry screen over a full-bleed photo, with the meeting title and date beside a four-digit code input.",
      },
    ],
  },
  {
    slug: "neon-wood",
    year: 2026,
    employer: { label: "Freelance" },
    client: "Neon Wood",
    url: "https://neonwood.com/",
    description: "A website for furnished apartments and community spaces in four German cities.",
    teaser: "One floating card for location, apartment type and all-inclusive rent, right in the hero",
    image: NEON,
    coverVideo: { src: "/media/neonwood-cover.mp4", poster: "/media/neonwood-cover.webp", width: 1080, height: 1080 },
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
    slug: "statements",
    year: 2026,
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
        text: "As UX Technical Lead for First Party, I led the project and did all of the design execution, from the brief and research through the final screens and the handoff, which started in October 2025 and ran into January 2026, working with the product manager and the engineering lead.",
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

  {
    slug: "atlas",
    year: 2024,
    employer: TT,
    client: "Atlas",
    description: "Tools for home service businesses to scope and quote jobs remotely, from a phone scan to a 3D model.",
    teaser: "Scope a job from a phone scan, not a site visit",
    image: ATLAS_COVER,
    story: [
      { type: "images", items: [ATLAS_COVER, ATLAS_3D_SCAN] },
      { type: "p", text: TT_NOTE },
      {
        type: "p",
        text: "Atlas built tools for home service businesses to scope and quote projects remotely. Instead of driving out to measure a room, a contractor asks the client to scan it with their phone, and Atlas turns the scan into a 3D model the team can quote from. I was its founding designer: I designed the first and second versions, the design system behind them, the prototypes and the product's visual assets.",
      },
      { type: "h", text: "A scan anyone can get right" },
      {
        type: "p",
        text: "The whole product depends on a good capture from someone who has never done one. So the client app teaches before it asks: a short, playful tutorial covers how to move through the room, loop around it and keep the walls in frame, then the camera takes over. Clients can send a full scan or single photos, and they hear back when the 3D model is ready. I also helped film the onboarding videos, and appear in them.",
      },
      { type: "images", items: [ATLAS_ONBOARDING] },
      { type: "images", items: [ATLAS_CAPTURE] },
      { type: "h", text: "One workspace for the contractor" },
      {
        type: "p",
        text: "On the other side, contractors work from a dashboard of projects in progress, recent calls, completed scans and conversion through each stage of the funnel. Each project brings the client, the call history and everything known about the property into one place: climate trends, property history, utility info and the 3D scan.",
      },
      { type: "images", items: [ATLAS_DASHBOARD, ATLAS_PROJECT] },
      {
        type: "p",
        text: "A line-illustration style carries the brand through the product, from sign-in to empty states.",
      },
      { type: "images", items: [ATLAS_LOGIN, ATLAS_CALLS_EMPTY] },
      { type: "h", text: "A system the frontend could read" },
      {
        type: "p",
        text: "I built the design system in the same language as our frontend developer's components, so a handoff mapped straight to code. That kept implementation fast and simple through both versions.",
      },
      { type: "h", text: "Where it ended" },
      {
        type: "p",
        text: "Atlas was later wound down. It remains one of the most fun projects I've worked on: computer vision, construction and a product that had to work for people holding a phone in their garage.",
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
    description: "A hiring startup I co-founded, with AI matching and a swipe-to-apply app before either was common.",
    teaser: "Swipe right on a job, with AI doing the matching",
    image: SWIPPR_COVER,
    carousel: ["swipe-card", "pricing", "pitch", "social", "post-job", "talent-profile", "b2b-hero", "one-pager", "b2b-login"].map((n) => `/images/carousel/swippr/${n}.webp`),
    story: [
      { type: "images", items: [SWIPPR_COVER, SWIPPR_SWIPE_CARD] },
      {
        type: "p",
        text: "Swippr was a hiring startup I co-founded with two partners. At the time, few products used AI to match candidates with companies, and applying for a job still meant long forms. Swippr matched both sides on what they cared about, and let candidates apply with a swipe.",
      },
      { type: "h", text: "A job you can judge in 30 seconds" },
      {
        type: "p",
        text: "Every job card leads with location, salary, benefits and a compatibility score based on the candidate's own preferences, so a role can be judged in under 30 seconds. Swipe left, swipe right, or Super Swipp to stand out. Details only open when a role earns the attention. A match leads straight to a chat with the recruiter and a slot for the first interview, and the app is free for candidates.",
      },
      { type: "images", items: [SWIPPR_SOCIAL, SWIPPR_PITCH] },
      { type: "images", items: [SWIPPR_PRICING] },
      { type: "h", text: "From a candidate app to a B2B service" },
      {
        type: "p",
        text: "We built the app and got early validation from users and customers. A marketplace needs both sides at once, so to gain traction we moved to a B2B model: we helped three companies find talent, ran those searches through our own admin, and used each one to learn and improve the product.",
      },
      {
        type: "p",
        text: "A company could post a role in one screen: who they need, seniority, English level, the countries to search, the work mode, skills and a salary range. On our side, every talent had a profile we could match and assign to a position.",
      },
      { type: "images", items: [SWIPPR_POST_JOB, SWIPPR_TALENT] },
      {
        type: "p",
        text: "The B2B offer needed its own voice, so I designed a nearshoring landing page and a sales one-pager that explained the service and the platform behind it.",
      },
      { type: "images", items: [SWIPPR_B2B_HERO, SWIPPR_B2B_PROCESS] },
      { type: "images", items: [SWIPPR_ONE_PAGER, SWIPPR_B2B_LOGIN] },
      { type: "h", text: "My role" },
      {
        type: "p",
        text: "As one of three founders, I designed the brand, the candidate app, the B2B admin, the landing pages and the marketing and sales assets. I also worked directly with our early partners and users, and made many of the product and business decisions.",
      },
      { type: "h", text: "Where it ended" },
      {
        type: "p",
        text: "Distribution was the hardest part: reaching enough companies and candidates at the same time. After those first three companies, we decided to stop.",
      },
    ],
  },

  // ---------- 2022 ----------
  {
    slug: "nomicol-docucol",
    year: 2022,
    employer: RV,
    client: "Nomicol and Docucol",
    description: "Payroll and contracts for small businesses in Colombia, without an accountant or a lawyer for every task.",
    teaser: "Payroll in minutes, not days, and contracts from template to signature",
    image: NOMICOL_DOCUCOL_COVER,
    story: [
      { type: "images", items: [NOMICOL_DOCUCOL_COVER, DOCUCOL_HERO] },
      { type: "p", text: RV_NOTE },
      {
        type: "p",
        text: "Two products for the same customer: small businesses in Colombia that do their own admin. Nomicol runs payroll and Docucol handles contracts, and they share one family of marks, colours and devices.",
      },
      { type: "h", text: "Nomicol: payroll in minutes, not days" },
      {
        type: "p",
        text: "92% of companies in Colombia have fewer than 20 employees, and most have no accounting or HR team. They run payroll by hand, which makes mistakes likely and can end in fines from government agencies.",
      },
      {
        type: "p",
        text: "As UX lead I ran two research sprints over four weeks, with 14 interviews with accountants, business owners, department leads and employees, plus a benchmark and desk research. The interviews showed why existing payroll tools didn't help: their calculations weren't always right, they took a long time to learn, support was slow, and payslips didn't explain what employees cared about.",
      },
      {
        type: "p",
        text: "So Nomicol had to be quick to learn and show its work. Businesses register their employees once and keep a history of every period and report. Managers update a period with overtime, deductions and other payments, and see at a glance which payrolls were accepted, rejected or flagged. Employees follow their next payment in real time from a mobile app. The landing page makes the same promise: payroll in minutes, not days.",
      },
      { type: "images", items: [NOMICOL_LANDING, NOMICOL_BLOG] },
      {
        type: "p",
        text: "We launched the first version of the platform and the employee app, then ran usability tests to decide what came next. Behind it are more than 120 organization screens across 16 task flows, 10 employee screens across 4 flows, and a design system with its own colours, Poppins type scale, components, icons, illustrations and empty states.",
      },
      { type: "images", items: [NOMICOL_DS] },
      { type: "h", text: "Docucol: from template to signed contract" },
      {
        type: "p",
        text: "When people or companies need a contract, however simple, they usually go to a lawyer. That is expensive, and often more than the document needs. Docucol lets them create contracts from templates, invite others to review or sign digitally, add reminders and expiration dates, and keep everything organized in folders.",
      },
      {
        type: "p",
        text: "I benchmarked six competitors across document creation, templates, digital signatures, invitations, reminders, expiration dates, file management, watermarks, collaboration, help and onboarding, and summed it up in a SWOT. Three things shaped the design. Template creation was the most complex part and tended to get cluttered. Onboarding and tutorials were crucial. And creating a document had to be easy to reach, with a clear sequence.",
      },
      {
        type: "p",
        text: "So onboarding teaches before it asks: a short carousel explains templates, then helps you create your digital signature by drawing it or uploading a file. Creating a document is always one button away, and organizations can add their own watermark from settings. The work covered more than 120 organization screens across 16 task flows, and 8 guest screens across 4 flows for people invited to sign.",
      },
      { type: "images", items: [DOCUCOL_LOGIN, DOCUCOL_TEMPLATES] },
      { type: "images", items: [DOCUCOL_SIGNATURE, DOCUCOL_WATERMARK] },
    ],
  },
  {
    slug: "bff",
    year: 2022,
    employer: RV,
    client: "BFF (Best Friend Famoso)",
    description: "An app where Latin American fans book personal videos and messages from their favourite celebrities.",
    teaser: "A fan app, a celebrity app, a landing page and an admin dashboard on one design system",
    image: BFF_COVER,
    story: [
      { type: "images", items: [BFF_COVER, BFF_MOCKUPS] },
      { type: "p", text: RV_NOTE },
      {
        type: "p",
        text: "BFF (Best Friend Famoso) is an app where fans find Latin American celebrities they admire, from actors and singers to comedians, influencers and content creators, and ask them for something personal: a custom video, a serenade, or a like, comment or follow on social media. Fans can request it for themselves or as a gift, businesses can book special services, and celebrities can apply to join and manage their requests in their own app.",
      },
      { type: "h", text: "Fans were willing to pay, but rarely got noticed" },
      {
        type: "p",
        text: "In Colombia, fans tried to reach celebrities through social media and ask for a personal message or video. Many were willing to pay for it, but they were unlikely to get an answer. Celebrities, on their side, couldn't keep their audience happy and were missing an extra source of income.",
      },
      {
        type: "p",
        text: "I led the design from start to end. I helped run the user research, designed the information architecture and the interactions, and we launched the first versions of the fan app, the celebrity app, a landing page and an admin dashboard. After launch we ran usability tests and used them to prioritise the next releases.",
      },
      {
        type: "p",
        text: "Both sides had to win. For fans, contacting a celebrity had to be fast and simple, a request had to feel personal, and they had to know where it stood. For celebrities, creating and managing a profile and answering requests had to be easy.",
      },
      { type: "h", text: "The fan app" },
      {
        type: "p",
        text: "Fans browse celebrities by category and by occasion (birthdays, love, celebrations, special dates), see every service with its price upfront, and send a request in three steps: what they want, their account, and payment.",
      },
      { type: "images", items: [BFF_CLIENT] },
      { type: "h", text: "The celebrity app" },
      {
        type: "p",
        text: "Celebrities see their pending, completed and cancelled requests, search them by ID or client, and filter them by service. Each request opens with who it is for, the fan's instructions and the price, so they can record their answer or reject it from the same screen.",
      },
      { type: "images", items: [BFF_CELEBRITY] },
      { type: "h", text: "Landing page and admin dashboard" },
      {
        type: "p",
        text: "The landing page introduces BFF to fans, walks them through a request step by step, and links to apply as a celebrity. The admin dashboard lets the BFF team manage requests, payments, celebrities, clients and admins, and the catalogue of categories, services and occasions. Each celebrity's monthly payout shows what was billed and what they receive after the manager, BFF and payment-gateway fees.",
      },
      { type: "images", items: [BFF_LANDING_HERO, BFF_LANDING_STEPS] },
      { type: "images", items: [BFF_DASHBOARD] },
      { type: "h", text: "One system for four products" },
      {
        type: "p",
        text: "A shared design system kept the four products consistent: a bold palette of primary, secondary and tertiary colours, Archivo Expanded for headlines and Helios Antique for text, service, occasion and request cards, inputs, buttons, notifications, and a set of icons and illustrations.",
      },
      { type: "images", items: [BFF_DESIGN_SYSTEM] },
      { type: "h", text: "Results" },
      {
        type: "p",
        text: "On the main tasks, finding celebrities and requesting services, fans had a 95% success rate and a 91% satisfaction score. Celebrities rated the app 97.5% CSAT on average across all tasks and described it as easy to use, valuable and helpful. Cancelling a request was the hardest part for users, so it went into the next release.",
      },
    ],
  },
  {
    slug: "check-mig",
    year: 2022,
    employer: { label: "Personal" },
    client: "Check Mig",
    description: "A redesign of Colombia's pre-travel migration form that cut the time to complete it from 12 minutes to 3.",
    teaser: "The same migration form, from 12 minutes to 3",
    image: CHECK_MIG_COVER,
    story: [
      { type: "images", items: [CHECK_MIG_COVER, CHECK_MIG_FLOW] },
      {
        type: "p",
        text: "A personal redesign, not the live government service. Check-Mig is the form people fill in before they enter or leave Colombia, so they can preload their trip and spend less time at the immigration desk. Users complete it for themselves and the people they travel with, then look up and download their certificate.",
      },
      { type: "h", text: "A form you can't skip" },
      {
        type: "p",
        text: "Travelers already have a long list of things to do before an international trip, and this form is long. It also isn't optional: without it, they can't travel. The service gets about 2.4 million visits a month, two thirds of them from Colombians, and the Android app had more than 100,000 downloads with a 2.4-star rating.",
      },
      {
        type: "p",
        text: "I ran the whole process myself: five interviews with people who had traveled abroad, analytics and desk research, personas and a customer journey, a revised site map validated with tree testing, task flows, wireframes, a design system, motion and usability testing. The interviews explained the rating. The main task took 12 minutes on average, people didn't understand the order of the form, and the system didn't tell them what was happening.",
      },
      { type: "h", text: "One clear path, one step at a time" },
      {
        type: "p",
        text: "The home page now offers two doors: complete your registration, or look up and download it. The form splits into three steps (trip direction, flight details, passengers) with progress always visible on the left. Choices like the direction of travel and the means of transport are large cards with an icon, not dropdowns. The certificate comes back laid out like a ticket, with the traveler, flight, date and route, and a single button to download the PDF.",
      },
      {
        type: "p",
        text: "A small design system kept it consistent: a calm teal and green palette, a type scale, a 12-column grid, spacing, buttons with loading states, inputs with clear error and success states, icons and cards.",
      },
      { type: "images", items: [CHECK_MIG_DS] },
      { type: "h", text: "Results" },
      {
        type: "p",
        text: "I tested the clickable prototype with five users. All five completed the registration without problems, the average time dropped from 12 minutes to 3 (75% less), and users rated the experience 90% CSAT, calling it very friendly. The most common request was to save personal details for future trips.",
      },
    ],
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
