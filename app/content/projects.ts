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
  /** A cut-out with a transparent background: no frame, the shadow follows its shape. */
  transparent?: boolean;
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
  coverVideo?: { src: string; poster: string; width: number; height: number; /** Fill the cover box (crops only background margin). */ fill?: boolean };
  /** A wide card: two thirds of a row, next to a tall photo when one is left. */
  wide?: boolean;
  /** With wide: share the row with the next card instead of a photo. */
  pairNext?: boolean;
  /** With wide: share the row with the previous card, which sits on the left. */
  pairPrev?: boolean;
  /** Close the feed row after this card, so the cards before it share a row on their own. */
  rowEnd?: boolean;
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
  2400,
  1350,
);
const CQ = (f: string, alt: string, w: number, h: number) => img(`cocuy-${f}.webp`, alt, w, h);
const CQ_ANALYTICS = CQ("analytics", "Figma library analytics for Cocuy: component insertions over the year, top teams and component statistics, with Navbar at 12,920 instances", 1374, 1420);
const CQ_UPLOAD_BEFORE = CQ("layout-upload-before", "Before: the offer upload page in the supplier center, with its own spacing and container widths", 2000, 1007);
const CQ_UPLOAD = CQ("layout-upload", "After: the same upload page rebuilt on the shared Layout component", 2000, 1007);
const CQ_OFFERS = CQ("layout-offers", "After: the offer status table in Scarlet on the shared Layout, navbar and side menu", 2000, 1007);
const CQ_SEARCH_BEFORE = CQ("layout-offers-before", "Before: offer status search that took one SAP SKU at a time", 2000, 1008);
const CQ_SEARCH = CQ("bulk-search", "After: the bulk search field open in Scarlet, holding dozens of IDs as tags", 2000, 1007);
const CQ_SEARCH_PANDORA = CQ("bulk-search-pandora", "After: bulk search implemented in Pandora's First Party offer-removal tool", 2000, 1007);
const CQ_ROW_BEFORE = CQ("row-before", "Before: purchase order rows in the supplier center", 2000, 1839);
const CQ_ROW = CQ("row", "After: purchase order rows with a clearer hierarchy, shared with the Sales team's rows", 1775, 1632);
const CQ_CARDS_BEFORE = CQ("cards-before", "Before: contract cards in Scarlet", 1366, 1500);
const CQ_CARDS = CQ("cards", "After: contract cards with clearer reading levels and hierarchy", 2000, 2196);
const CQ_MENU_BEFORE = CQ("sidemenu-before", "Before: three different side menus in Buying Portal, the supplier center and Scarlet", 2000, 1544);
const CQ_MENU = CQ("sidemenu", "After: one side menu component across Buying Portal, the supplier center and Scarlet", 2000, 1468);
const CQ_HEADERS_BEFORE = CQ("headers-before", "Before: the size guide manager header", 2000, 1007);
const CQ_HEADERS = CQ("headers", "After: the size guide manager with standardized header spacing, alignment and hierarchy", 2000, 1070);
const CQ_TOOLBARS_BEFORE = CQ("toolbars-before", "Before: the commercial agreements toolbar in Buying Portal, with the inconsistencies marked", 2000, 1007);
const CQ_TOOLBARS = CQ("toolbars", "After: the commercial agreements page on the shared toolbar component", 2000, 1007);
const CQ_ERRORS_BEFORE = CQ("errors-before", "Before: a generic error page in the supplier center", 1613, 829);
const CQ_ERRORS_403 = CQ("errors-403", "After: the standard 403 page, asking for the missing permissions", 2000, 1007);
const CQ_ERRORS_404 = CQ("errors-404", "After: the standard 404 page, with its illustration and wording", 2000, 1007);
const CQ_CRUMBS_BEFORE = CQ("breadcrumbs-before", "Before: a cooperative agreement form with its own breadcrumb", 2000, 1018);
const CQ_CRUMBS = CQ("breadcrumbs", "After: the same form with breadcrumbs built into the Layout component", 2000, 1018);
const SPICE_COVER: ProjectImage = { src: "/media/spice-org-cover.webp", video: "/media/spice-org-cover.mp4", alt: "Spice.org hero intro: the navigation, headline, buttons and SQL query explorer rise into place over the lined background", width: 1600, height: 1468 };
const SPICE_M_HERO = img("spice-org-mobile-hero.webp", "Spice.org on mobile: the headline, buttons and query explorer with paging dots", 786, 1704);
const SPICE_M_MENU = img("spice-org-mobile-menu.webp", "Spice.org on mobile: the navigation menu open over the hero, with the demo video below", 786, 1604);
const SPICE_M_CTA = img("spice-org-mobile-cta.webp", "Spice.org on mobile: the closing call to action and a customer quote", 474, 1116);
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

const CONTRACTS_COVER: ProjectImage = { src: "/media/cb-contracts-cover.webp", video: "/media/cb-contracts-cover.mp4", alt: "The redesigned Contracts portfolio in use, adding contracts and opening a row menu, in front of the timeline view that runs each contract from its notice due date to the end of its term", width: 1600, height: 1000 };
const CB_VR_VIDEO: ProjectImage = { src: "/media/cb-vendor-registry.webp", video: "/media/cb-vendor-registry.mp4", alt: "Vendor Registry Portal walkthrough: sign in with a work email, open the magic link, describe a need, and get approved, conditional and in-review options", width: 1920, height: 1064 };
const CB_VR_SIGNIN = img("cb-vr-signin.webp", "Vendor Registry sign-in under the customer's own brand: work email only, with a magic link instead of a password", 2400, 1330);
const CB_VR_EMAIL = img("cb-vr-email.webp", "The sign-in email: one button to open the Vendor Registry, branded for the customer and powered by Coverbase", 2400, 1330);
const CB_VR_RESULTS = img("cb-vr-results.webp", "Search results for a described need: counts of approved, conditional and in-review options above a table with approval, vendor, tier and next review", 2400, 1330);
const VENDOR_REGISTRY_COVER = img("vendor-registry-cover.webp", "Charles River Vendor Registry Portal: a search for a meeting-transcription tool with approved, conditional and in-review results", 1600, 1000);
const INSPECT_ZERO_TOUCH_COVER = img("inspect-cover-square.webp", "Inspect's first-run page, what Inspect can do and two ways to get started, in front of a completed Zero Touch assessment", 1600, 1600);
const AUDIT_COVER: ProjectImage = img("audit-cover.webp", "The redesigned vendor profile, with the Coverbase Agent summarizing a new vendor and recommending next steps, in front of the search-first New vendor step", 1600, 1000);
const AUDIT_AGENT = img("audit-agent.webp", "Vendor profile right after creation: the Coverbase Agent explains what was filled in, lists recommended next steps as a checklist, and a vertical lifecycle sits beside it", 2400, 1665);
const AUDIT_STEP1 = img("audit-step1.webp", "New vendor, step 1: search-first, with Select and continue on a matched profile and Continue from scratch always visible", 2400, 1500);
const AUDIT_STEP2 = img("audit-step2.webp", "New vendor, step 2: vendor details with AI autofill, and the fields that drive workflows marked Used by workflow", 2400, 1500);
const AUDIT_ABOUT = img("audit-about.webp", "The About tab: extracted company profile, location, custom fields, registration and products as collapsible cards", 2400, 2253);
const AUDIT_PROPERTIES = img("audit-properties.webp", "The Properties tab: tags, contacts, owners and watchers, plus shortcuts to services, findings, commitments and questionnaire submissions", 2400, 1500);
const AUDIT_OVERVIEW = img("audit-overview.webp", "The redesigned home page: actionable at-a-glance cards, a calmer work queue empty state and recent completed assessments", 2400, 1500);
const CB_CONTRACTS_TRIAGE = img("cb-contracts-table.webp", "Contracts triage table: four work cards (notice deadlines, renewal decisions, missing renewal details, reviews needed) above one row per contract, ordered by notice due date", 2400, 1515);
const CB_CONTRACTS_TIMELINE = img("cb-contracts-timeline.webp", "Timeline view of the same contracts: each row runs from its notice due date to the end of the current term, with a dashed line where the notice date is missing", 2400, 1544);
const CB_CONTRACTS_PORTFOLIO: ProjectImage = { src: "/media/cb-contracts-portfolio.webp", video: "/media/cb-contracts-portfolio.mp4", alt: "The redesigned Contracts portfolio: Key Dates, Pending Tasks, Approvals and Portfolio cards above the table, a single Export button, the Add contracts menu, and a row menu that holds every contract action", width: 1920, height: 880 };
const RADAR_COVER = img("radar-cover.webp", "Coverbase Radar: the signals list with severity and affected suppliers, and an event page with an AI summary, triage status and the vendors involved", 1600, 1000);
const CB_ZERO_TOUCH = img("cb-zero-touch.webp", "Zero Touch Assessment for 1Password: review results with a low-risk score beside the sections for supplier profile, reputational risk, controls and security posture", 2400, 1372);
const CB_RADAR_BACKTEST = img("cb-radar-backtest.webp", "Radar's New Detector form: sources, categories, severity threshold and guidance for what Radar should watch", 2400, 1372);
const CB_RADAR_MAP = img("cb-radar-map.webp", "A Radar event for a critical file-transfer vulnerability, with the Exposure map showing which vendors are hit directly and which through a shared provider", 2400, 1502);
const CB_RADAR_DETECTORS = img("cb-radar-detectors.webp", "The same Radar event on its Detectors tab: each detector that fired, with severity, confidence and the sources behind it", 2400, 1579);
const CB_RADAR_EMPTY = img("cb-radar-empty.webp", "Radar's empty state while it monitors the recommended detectors, with a banner to review them", 2400, 1500);
const CB_INSPECT_START = img("cb-inspect-start.webp", "Inspect's first-run page: what Inspect can do, then two ways to start, connecting an identity provider (Okta or Microsoft Entra) or browsing the application library", 2400, 1500);
const CB_OKTA_SELECT = img("cb-okta-select.webp", "Connect Okta to Inspect, step 3: app details and connection verified, three synced applications to choose from, and an explicit approval before Inspect provisions anything", 2400, 1500);
const CB_INSPECT_CONFIG = img("cb-inspect-config.webp", "Configuration, Inspect: one card each for Okta, Microsoft Entra and Google OAuth, with connection status, last sync and how many applications are added", 2400, 405);
const CB_ZT_RUNNING = img("cb-zt-running.webp", "Zero Touch assessment while it runs: a progress banner, a persistent section index on the left, and each section reporting what Coverbase is checking right now", 2400, 1500);
const CB_ZT_COMPLETED = img("cb-zt-completed.webp", "Completed Zero Touch assessment: risk level and score up front, the vendor profile and inherent risk grouped together, and the reviewer decision kept in view on the right", 2400, 1450);
const CB_OKTA_CONNECT = img("cb-okta-connect.webp", "Connect Okta to Inspect: app details are found, then step-by-step setup of the public key, scopes and roles Inspect needs", 2400, 1747);
const CB_OKTA_DONE = img("cb-okta-done.webp", "Okta connection completed: three applications ready for inspection, with New inspection and View applications", 2400, 1500);
const CB_INSPECT_APPS = img("cb-inspect-apps.webp", "Inspect's Applications tab: counts of added, unavailable, inspected and not-inspected apps, the Okta sync status, and each app with its source and last inspection", 2400, 1500);
const CB_AD_POINT = img("cb-inspect-ad-point.webp", "Inspect campaign ad: a castle certificate reads Security status while the real castle behind it crumbles. Your vendor passed the test. Is it still true today?", 1620, 1620);
const CB_AD_VERIFY = img("cb-inspect-ad-verify.webp", "Inspect campaign ad: a small robot with an Inspector badge scans a castle into a wireframe. Test your third parties continuously", 1620, 1620);
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
const BM_COVER: ProjectImage = { src: "/media/cb-brand-cover.webp", video: "/media/cb-brand-cover.mp4", alt: "The website's Applied AI section with its isometric platform diagram, in front of the closing call to action: an engraved Great Wall scene with a drone, where the cursor becomes the Book a demo button", width: 1600, height: 1000 };
const BM_SITE_CTA: ProjectImage = { src: "/media/cb-site-cta-footer.webp", video: "/media/cb-site-cta-footer.mp4", alt: "Footer experiment: a shader dome over an engraved Great Wall scene, parallax layers as the page scrolls into the blue footer, and a cursor that turns into the Book a demo button", width: 1600, height: 824 };
const BM_LOGO_ANIM: ProjectImage = { src: "/media/cb-logo-animation.webp", video: "/media/cb-logo-animation.mp4", alt: "The Coverbase logo animation: the mark's three shapes round into capsules, shrink into three circles that rotate around the center, and open back into the mark", width: 1000, height: 1000 };
const BM_LOGO_GRID = img("cb-logo-guide-grid.webp", "Logo animation guideline, step 1: the mark on its construction lines", 1000, 1000);
const BM_LOGO_CAPSULES = img("cb-logo-guide-capsules.webp", "Logo animation guideline, step 2: each shape becomes a rounded capsule on the same construction lines", 1000, 1000);
const BM_LOGO_ROTATION = img("cb-logo-guide-rotation.webp", "Logo animation guideline, step 3: the capsules become three circles that rotate around the mark's center", 1000, 1000);
const BM_MARK = img("cb-brand-mark.webp", "The refreshed Coverbase mark on its construction lines: two rounded triangles that meet on one shared axis", 2400, 1350);
const BM_AUDIT = img("cb-brand-audit.webp", "Audit of the previous mark, annotated: misaligned edges where the shapes meet, an overlapped point, and a right edge that doesn't follow a design grid", 2400, 1350);
const BM_GRID = img("cb-brand-grid.webp", "The construction grid for the new mark: every edge sits on the same set of 30-degree lines", 2400, 1350);
const BM_ICON = img("cb-brand-icon.webp", "The new Coverbase icon with a blue gradient on white", 2400, 1350);
const BM_WORDMARK = img("cb-brand-wordmark.webp", "The Coverbase logo in white on a deep blue gradient", 2400, 1350);
const BM_COLORS = img("cb-brand-colors.webp", "Brand guidelines, colors: the primary blue scale from 50 to 950, with 700 marked as the main color", 2400, 1350);
const BM_VARIATIONS = img("cb-brand-variations.webp", "Brand guidelines, logo variations: full logo and icon in gradient, solid blue, gradient black and solid black, on light and dark backgrounds", 2400, 1350);
const BM_SITE_WALK: ProjectImage = { src: "/media/cb-site-walkthrough.webp", video: "/media/cb-site-walkthrough.mp4", alt: "Scrolling the redesigned Coverbase website: the Applied AI platform diagram, the supplier work queue, platform agents, TPM-Bench v2 results, industries and the closing call to action", width: 1600, height: 888 };
const BM_SITE_APPLIED = img("cb-site-applied-ai.webp", "Website, Applied AI section: an isometric platform diagram over an engraved mountain landscape, with three cards on how agents work across the vendor lifecycle", 2400, 1427);
const BM_SITE_AGENT: ProjectImage = { src: "/media/cb-site-agent-work.webp", video: "/media/cb-site-agent-work.mp4", alt: "Isometric Agent work illustration: trust center, public records and your requirements feed an agent that collects evidence, maps it to controls and isolates the gaps", width: 1600, height: 806 };
const BM_SITE_DIAGRAM: ProjectImage = { src: "/media/cb-site-diagram.webp", video: "/media/cb-site-diagram.mp4", alt: "Interactive isometric diagram: evidence and requirements route through Coverbase in three steps, with a caption for each step", width: 1600, height: 1142 };
const BM_SITE_INDUSTRIES: ProjectImage = { src: "/media/cb-site-industries.webp", video: "/media/cb-site-industries.mp4", alt: "Industries section with hover animations on each isometric illustration: regulated institutions, security and compliance, growing vendor networks", width: 1600, height: 900 };
const BM_AMSTERDAM: ProjectImage = { src: "/media/cb-amsterdam-event.webp", video: "/media/cb-amsterdam-event.mp4", alt: "Amsterdam event page: An evening on the Amsterdam canals, with date and boarding location, why the evening matters, a welcome for guests in town for the conference week, and the Reserve your seat form", width: 1600, height: 828 };
const BM_CAB_HERO = img("cb-cab-hero.webp", "Customer Advisory Board page hero: the meeting title, date with Add to calendar, and the Napa Valley venue with directions, over a photo of the winery", 1800, 932);
const BM_CAB_GUEST = img("cb-cab-guest.webp", "Customer Advisory Board page for guests: what the day is for and what Coverbase covers, a sticky card with date and location, and an event schedule with expandable sessions", 1800, 1925);
const BM_NYC_OG = img("cb-nyc-dinner-og.webp", "Share image for the New York executive dinner: title, date, venue and Event by invitation only over a photo of the restaurant", 1600, 840);
const BM_NYC_PAGE = img("cb-nyc-dinner-page.webp", "New York executive dinner page: hero with date, venue and Reserve your seat, then why the dinner matters, three stats, the three topics and a short agenda beside a sticky reservation card", 1800, 2606);
const BM_AD_RADAR = img("cb-ad-radar.webp", "Radar ad: Watch Your Vendors Between Reviews. Once a year isn't monitoring. This is. coverbase.com/radar", 1600, 1600);
const BM_AD_REPORT = img("cb-ad-report.webp", "Report ad: TPRM Wasn't Built for the World We're In Now, with the open 2026 report and a small robot", 1600, 1600);
const SPICE_AI_WEBSITE_COVER = img("spice-ai-website-cover.webp", "Spice AI website: the hero, The Data and AI Stack in One Engine, beside a SQL playground", 1600, 1000);
const SA = (f: string, alt: string, w: number, h: number) => img(`spice-ai-${f}.webp`, alt, w, h);
const SA_HOME_HERO = SA("home-hero", "Spice AI homepage on desktop: The Data and AI Stack in One Engine, beside a SQL playground with hybrid search, LLM inference and federation callouts, over the customer logos", 2000, 1378);
const SA_HOME_GROUND = SA("home-ground", "Spice AI homepage: Ground apps and AI agents in enterprise data, with tabs for SQL federation, hybrid search and embedded AI inference", 2000, 1242);
const SA_HOME_AI_ERA = SA("home-ai-era", "Spice AI homepage: Do more with your data in three charted numbers, then Built for the AI era with deploy, sandboxing and observability cards", 2000, 1806);
const SA_HOME_PRODUCTION = SA("home-production", "Spice AI homepage: a customer quote, Get started with Spice resource cards and the See spice in action call to action", 2000, 2357);
const SA_FEDERATION = SA("diagram-federation", "Spice engine diagram, SQL Federation and Acceleration highlighted: accelerated data and catalogs", 2000, 1352);
const SA_HYBRID = SA("diagram-hybrid", "Spice engine diagram, Hybrid SQL Search highlighted: full-text, vector, keyword and re-ranking", 2000, 1352);
const SA_INFERENCE = SA("diagram-inference", "Spice engine diagram, LLM Inference highlighted: serving and grounding AI in data", 2000, 1352);
const SA_STACK = SA("stack", "The Data and AI Stack in One Engine: the Spice playground with a hybrid search query, its results and the three capability callouts", 2000, 1274);
const SA_APPS = SA("diagram-apps", "Architecture diagram: AI apps on top of Spice AI, which connects S3 buckets and tables with AI models such as NVIDIA NIM, OpenAI and Hugging Face", 1388, 760);
const SA_22 = SA("2-2", "Spice 2.2 announcement: Spice Cloud Connect for BYOC, MySQL change data capture, Debezium CDC without Kafka and faster search", 2000, 1047);
const SA_ICON = SA("icon", "The Spice AI app icon over a grid of the data sources and AI providers it connects", 1360, 1034);
const SA_SIGNIN = SA("signin", "Spice Cloud Platform sign-in: continue with GitHub, beside what the platform does and the companies that run it in production", 2000, 1111);
const SA_CTA = SA("cta", "See spice in action: a dark call to action for a live demo", 2000, 640);
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
const CHARMED_COVER: ProjectImage = { src: "/media/charmed-cover.webp", video: "/media/charmed-cover.mp4", alt: "Charmed sign-in prototype: an astronaut and a robot facing an alien landscape as the Charmed star rises over a wireframe terrain", width: 1600, height: 976 };
const CHARMED_ONBOARDING: ProjectImage = { src: "/media/charmed-onboarding.webp", video: "/media/charmed-onboarding.mp4", alt: "Onboarding prototype: a completed quest opens a chest worth 1,000 credits", width: 1400, height: 862 };
const CHARMED_WEBSITE: ProjectImage = { src: "/media/charmed-website.webp", video: "/media/charmed-website.mp4", alt: "Website prototype: the AI Texture Generator page scrolling through generated materials, refinement and art-direction controls", width: 1600, height: 982 };
const CHARMED_WEB_HERO = img("charmed-website-hero.webp", "Charmed website: AI Texture Generator hero with a robot carrying two generated materials", 1336, 896);
const CHARMED_WEB_MATERIALS = img("charmed-website-materials.webp", "Charmed website: bring your vision to life in 3D, with textures being added to the robot", 1336, 896);
const CHARMED_WEB_REFINE = img("charmed-website-refine.webp", "Charmed website: enhance and refine textured objects, adjusting color saturation on a patch", 1336, 896);
const CHARMED_RENDERS = img("charmed-texture-renders.webp", "Texture Generator renders: seeds in progress and completed marble and metal textures on cubes", 1400, 856);
const CHARMED_PATCH = img("charmed-texture-patch.webp", "Texture Generator patch tool on a mug with a painted flower, with an onboarding tip", 1400, 856);
const CHARMED_HELICOPTER = img("charmed-texture-helicopter.webp", "Texture Generator brush patching a new texture onto a helicopter", 1400, 856);
const CHARMED_ANIMATOR = img("charmed-animator.webp", "3D Animator empty state: a rigged mannequin ready to animate", 1400, 856);
const CHARMED_ANIMATOR_MOBILE = img("charmed-animator-mobile.webp", "3D Animator on mobile: a character preview with animation thumbnails and share", 732, 1537);
const CHARMED_DESIGNER: ProjectImage = { ...img("charmed-3d-designer.webp", "3D Designer: a couch and lamp scene with object, environment and reference image panels and a generated preview", 1429, 788), transparent: true };
const CHARMED_EMAIL_WAITLIST = img("charmed-email-waitlist.webp", "Waitlist email: you're on the first group to try Charmed's texture app, with a megaphone illustration", 761, 1287);
const CHARMED_EMAIL_NOTIFY = img("charmed-email-notifications.webp", "Product update email introducing notifications for finished textures", 930, 993);
const ATLAS_3D_SCAN = img("atlas-3d-scan.webp", "Atlas: a 3D scan of a home, built from a client's phone capture, with the photos it came from", 1271, 952);
const ATLAS_ONBOARDING = img("atlas-onboarding.webp", "Atlas client app onboarding: let's get capturing, then steps on moving through the room, looping around it and keeping walls in frame", 2000, 1085);
const ATLAS_CAPTURE = img("atlas-capture.webp", "Atlas client app: capturing a garage by scan or photo, then a confirmation that the 3D model is on its way", 2000, 1418);
const ATLAS_DASHBOARD = img("atlas-dashboard.webp", "Atlas contractor dashboard: projects in progress, recent calls, completed projects, conversion by funnel stage and completed scans", 1456, 818);
const ATLAS_PROJECT = img("atlas-project-detail.webp", "Atlas project detail: the client, call history, and the property's climate trends, history, utility info and 3D scan", 1456, 819);
const ATLAS_LOGIN = img("atlas-login.webp", "Atlas sign-in over a line illustration of a city and its landscape", 1456, 818);
const ATLAS_CALLS_EMPTY = img("atlas-calls-empty.webp", "Atlas calls page empty state, with an illustration of a person on a call", 1456, 818);
const ATLAS_COVER: ProjectImage = { src: "/media/atlas-cover.webp", video: "/media/atlas-cover.mp4", alt: "Atlas: a garage capture where a contractor adds a Tesla Powerwall to the scene, beside the client onboarding video, with me showing how to keep the right distance", width: 1600, height: 1056 };
const AUGMEND_COVER_SQ = img("augmend-cover-square.webp", "Augmend landing hero: Collective intelligence for developers, over a shared workspace with teammates' cursors", 1600, 1600);
const AUGMEND_LANDING = img("augmend-landing.webp", "Augmend landing: Accelerate software development team speed with AI-augmented collaboration tools, with a waitlist field above the workspace", 2000, 1130);
const AUGMEND_LOGO = img("augmend-logo.webp", "Augmend logo on lime, dark, light and white backgrounds", 888, 1366);
const AUGMEND_COLORS = img("augmend-colors.webp", "Augmend color system: neutral, lime primary, violet complementary, error and warning scales", 1124, 1061);
const AUGMEND_PITCH_PURPOSE = img("augmend-pitch-purpose.webp", "Pitch deck purpose slide: accelerate how teams build and operate software by reducing collaboration tax and augmenting team knowledge with AI", 1341, 892);
const AUGMEND_PITCH_SOLUTION = img("augmend-pitch-solution.webp", "Pitch deck solution slide: a multiplayer workspace, Figma meets Copilot, rebuilt for devops", 1332, 890);
const AUGMEND_SIGNUP = img("augmend-signup.webp", "Augmend sign-up: create an account beside the illustration Your team's shared brain", 1444, 830);
const AUGMEND_EMPTY = img("augmend-empty-state.webp", "Augmend workspaces empty state with a binoculars illustration and a Create a multi-player workspace prompt", 1444, 722);
const AUGMEND_WORKSPACE = img("augmend-workspace.webp", "Augmend shared workspace: a dashboard, terminals and CloudWatch logs side by side, with teammates' cursors and an events panel", 1400, 857);
const AUGMEND_CLIENT = img("augmend-client-app.webp", "Onboarding step: download the client app to record and share activity with your colleagues", 918, 1309);
const AUGMEND_WAITLIST = img("augmend-waitlist.webp", "Waitlist modal: Welcome on board, with an illustration of shared windows and cursors", 1030, 1122);
const AUGMEND_EMAIL_BETA = img("augmend-email-beta.webp", "Private beta confirmation email: You're on the list and we're so excited", 778, 1269);
const AUGMEND_EMAIL_ARTICLE = img("augmend-email-article.webp", "Newsletter email announcing a new article, with the Augmend app icon between mail and calendar icons", 778, 1232);
const AUGMEND_EMAIL_INVITE = img("augmend-email-invite.webp", "Team invitation email with two people fitting puzzle pieces together", 712, 1212);
const COOL_EARTH_COVER = img("cool-earth-cover.webp", "ECool Club home, with the Gold tier card and a Take action button in front of it, over Cool Earth's striped green background", 1600, 1053);
const COOL_EARTH_HOME = img("cool-earth-home.webp", "ECool Club home: connect, contribute and get rewarded, with seeds and a daily streak in the top bar and an invitation to earn 100 seeds", 2400, 1350);
const COOL_EARTH_REWARDS = img("cool-earth-rewards.webp", "Rewards: badges for streaks, seeds, oxygen saved, sharing and the forum, above course certificates", 2400, 1350);
const COOL_EARTH_LEADERBOARD = img("cool-earth-leaderboard.webp", "Leaderboards: badge tiers up to gold and a weekly ranking of businesses and supporters by points", 2400, 1350);
const COOL_EARTH_LEARN = img("cool-earth-learn.webp", "Learn: free courses about wildlife and rainforest protection, each worth 50 seeds", 2400, 1350);
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
    description: "A read-only portal where any employee can check whether their company already has an approved vendor or service before requesting a new one.",
    teaser: "Before you request a new vendor, check if you already have one",
    image: VENDOR_REGISTRY_COVER,
    story: [
      { type: "images", items: [VENDOR_REGISTRY_COVER] },
      {
        type: "p",
        text: "Vendor reviews usually start when someone needs a tool. Most of those people aren't on the third-party risk team and never open the Coverbase dashboard, so they file a new intake even when the company already has an approved option. I redesigned the Vendor Registry Portal for them: a read-only place to check first, replacing the previous portal.",
      },
      { type: "images", items: [CB_VR_VIDEO] },
      { type: "h", text: "No account, no dashboard" },
      {
        type: "p",
        text: "The portal is white-labelled under the customer's own brand and domain. People sign in with their work email and a magic link, with no password to create, and a compact version can be embedded in an internal page.",
      },
      { type: "images", items: [CB_VR_SIGNIN, CB_VR_EMAIL] },
      { type: "h", text: "Search by need, not by vendor name" },
      {
        type: "p",
        text: "Employees rarely know which vendor they want; they know the job. Search accepts a vendor, a product, a service or a plain description such as \u201ca tool to transcribe internal meetings\u201d. Results open with what matters most, how many options are approved, approved with conditions or still in review, followed by each option's approval, vendor tier and next review, with reviews that are due or coming up flagged.",
      },
      { type: "images", items: [CB_VR_RESULTS] },
      { type: "h", text: "Details the admins decide" },
      {
        type: "p",
        text: "Opening a result explains why it fits the need, what use is approved and what is restricted, then the service and vendor details. Most of those fields, such as assessment outcome, next assessment date, tier, tags, lifecycle status and use case, are configured by portal admins, so each organization decides what its employees see. When nothing matches, the page says so plainly and offers two ways forward: refine the search or open a vendor intake.",
      },
      { type: "h", text: "Result" },
      {
        type: "p",
        text: "The new Vendor Registry Portal shipped in 2026, giving employees outside the risk team a self-serve answer before they start an intake.",
      },
    ],
  },
  {
    slug: "contracts",
    year: 2026,
    employer: CB,
    client: "Contracts and Contract Guardian",
    description: "Contract management and AI clause review inside Coverbase, redesigned around the questions customers bring to it.",
    teaser: "What expires, and when do I act? Redesigning the contracts portfolio around dates",
    image: CONTRACTS_COVER,
    coverVideo: { src: "/media/cb-contracts-cover.mp4", poster: "/media/cb-contracts-cover.webp", width: 1600, height: 1000, fill: true },
    story: [
      { type: "images", items: [CONTRACTS_COVER] },
      {
        type: "p",
        text: "Procurement and legal teams track hundreds of vendor contracts, and the dates hidden inside them decide real money: notice periods, auto-renewals, termination windows. In 2026 Contract Guardian took the whole contract review into Coverbase: bulk import organized by vendor, engagement, service and key dates; AI clause review; redlines exported to Word with tracked changes; and multi-party e-signatures. That shipped in September.",
      },
      { type: "h", text: "First pass: triage before detail" },
      {
        type: "p",
        text: "I started in September with a brief built around one scenario: an analyst opens Contracts to find what needs attention, then reviews several contracts in a row. The evidence pointed at the list itself. Rows were grouped by vendor, so one customer couldn't tell why they saw 24 rows when they had 764 contracts. The summary cards competed with equal weight, and product analytics showed a list, contract, list loop in 27.5% of journeys.",
      },
      {
        type: "p",
        text: "So the first pass treated the portfolio as triage. One row is one contract. The cards became work questions with an explicit count and the reason behind it: notice deadlines, renewal decisions needed, missing renewal details, reviews needed. The table sorts by the most actionable date, notice due, and its columns follow the triage story: contract, vendor, status, notice due, renewal decision, renewal, renewal term, current term end. Instead of a separate renewal runway screen, a timeline view reuses the same dataset and controls, and Start clause review moved from the global toolbar into each row so nobody has to pick the contract twice.",
      },
      { type: "images", items: [CB_CONTRACTS_TRIAGE, CB_CONTRACTS_TIMELINE] },
      {
        type: "p",
        text: "To break the loop, I added a lightweight preview: a side panel that opens from a row, keeps the row highlighted and the table usable underneath, shows the vendor before the contract, steps to the previous or next contract in the current filtered order, and opens the full record when it's time to commit. Engineering had it implemented by early October, with a toggle to turn previews on or off, and I proposed it as a shared pattern for Vendors, Assessments, Radar, Findings and Cases.",
      },
      { type: "h", text: "Second pass: start where people actually are" },
      {
        type: "p",
        text: "In November I went back to Contracts end to end with usage data. The portfolio and the contract detail made up over 99% of views; assembly, signatures, templates and the repository each had fewer than 50, so the portfolio stayed the focus. Support conversations and customer calls pointed the same way: renewals and notices were one of the three largest themes, and customers asked directly for views like \u201cexpiring in six months\u201d and \u201cnotices in the next 60 days\u201d.",
      },
      { type: "h", text: "What was broken" },
      {
        type: "p",
        text: "The summary cards didn't fully answer the questions people brought to the page, and related information was split between the cards and the toolbar. A strip in the toolbar looked like one control but behaved three ways: one segment filtered, one did nothing and one opened a drawer. The Actions menu mixed portfolio-wide actions, per-contract actions and five different ways to add contracts. Even our own team struggled with it in a demo, and bulk import, the main way customers bring contracts in, was buried in the empty state.",
      },
      { type: "images", items: [CB_CONTRACTS_PORTFOLIO] },
      { type: "h", text: "One card per question, one home per action" },
      {
        type: "p",
        text: "The new portfolio opens with one card per question: Key Dates, Pending Tasks, Approvals (only for organizations that use them) and Portfolio, each opening in place with more detail. The toolbar strip is gone and its figures moved into the cards. Every item from the old Actions menu got a clear home: saved reports in Reports, reminders in Configuration (because reminders are settings, not actions), imports in a new Add contracts menu grouped by use, and Export as the single button left. Each row's menu now holds every contract action, where before some lived only in the bulk bar, and the bulk bar repeats the ones that work on many contracts at once.",
      },
      {
        type: "p",
        text: "I documented the evidence and a decision log for every change, and built the redesign in code as well as in design. Both passes, the triage table with its timeline view and preview, and the question cards with the new Add contracts menu, shipped to customers.",
      },
    ],
  },
  {
    slug: "radar",
    year: 2026,
    employer: CB,
    client: "Radar",
    description: "Continuous monitoring of vendor risk: security events, outages and news, matched to the vendors a company depends on.",
    teaser: "From a feed of alerts to an investigation: who is exposed, and what we did about it",
    image: RADAR_COVER,
    story: [
      { type: "images", items: [RADAR_COVER] },
      {
        type: "p",
        text: "Radar watches the outside world for events that touch a customer's vendors: vulnerabilities, breaches, outages, financial and legal news. When something happens, a team needs more than an alert: who is affected, how badly, and what has already been done about it.",
      },
      { type: "h", text: "Every event is an investigation" },
      {
        type: "p",
        text: "I redesigned Radar around the event page. Each event opens with a short summary, its timeline from disclosure to our alert, and a status the team owns. Below it, tabs answer the next questions in order: which detectors fired and why, who is exposed, which sources back it up, and what happened when. The separate Alerts table went away; alert details now live on the event they belong to.",
      },
      { type: "images", items: [CB_RADAR_DETECTORS] },
      { type: "h", text: "Exposure, direct and indirect" },
      {
        type: "p",
        text: "The hardest question in an incident is reach. A vulnerability in one file-transfer product can hit a vendor directly, or reach three more through a provider they share. The Exposure view groups affected vendors by tier and shows both paths, so a team can start with the vendors that matter most instead of the longest list.",
      },
      { type: "images", items: [CB_RADAR_MAP] },
      { type: "h", text: "Tuning what Radar watches" },
      {
        type: "p",
        text: "Detectors define what Radar looks for. Teams can start from a recommended set, write their own with sources, categories and a severity threshold, and backtest a detector against past events before trusting it in production, so false positives get tuned out before anyone is paged.",
      },
      { type: "images", items: [CB_RADAR_BACKTEST, CB_RADAR_EMPTY] },
      { type: "h", text: "Result" },
      {
        type: "p",
        text: "Detector backtesting shipped in January 2026. The redesigned Radar went live for every Coverbase organization in September 2026, with Ask Coverbase AI on each event, the Exposure view, vendor status-page monitoring with snapshots of what changed, and custom statuses with inline actions for tracking the response.",
      },
    ],
  },
  {
    slug: "coverbase-brand-marketing",
    year: 2026,
    employer: CB,
    client: "Brand, website and marketing",
    description: "A refreshed Coverbase mark and brand foundations, a richer marketing website, and the event pages and ads around it.",
    teaser: "A logo rebuilt on a real grid, a website with motion, and event pages guests can act on",
    image: BM_COVER,
    coverVideo: { src: "/media/cb-brand-cover.mp4", poster: "/media/cb-brand-cover.webp", width: 1600, height: 1000, fill: true },
    wide: true,
    pairNext: true,
    story: [
      { type: "images", items: [BM_COVER] },
      {
        type: "p",
        text: "Beyond the product, I worked on how Coverbase shows up outside it. In 2026 that meant three things: tightening the logo and writing down brand foundations, raising the craft of the marketing website, and designing the pages and assets marketing used to fill rooms.",
      },
      { type: "images", items: [BM_SITE_CTA] },
      {
        type: "p",
        text: "The footer started as an experiment in how far the site's visual language could go: a shader for the dome, layered illustrations for parallax as the page scrolls, and cursor effects that turn the pointer into the Book a demo button, so a visitor can click anywhere on the scene.",
      },
      { type: "h", text: "Brand: a mark that holds up close" },
      {
        type: "p",
        text: "I started with an audit of the existing mark: the two shapes were misaligned where they met, they overlapped at the center point, and the right edge didn't land on any grid. I rebuilt it on one set of 30-degree construction lines with consistent rounded corners, so every edge has a reason to be where it is.",
      },
      { type: "images", items: [BM_AUDIT, BM_GRID] },
      { type: "images", items: [BM_MARK, BM_ICON] },
      {
        type: "p",
        text: "Then I set new foundations so every team could use the brand consistently: a primary blue scale with one main color, logo and icon variations for light and dark backgrounds, and type pairings, collected in a 2026 brand guidelines deck.",
      },
      { type: "images", items: [BM_WORDMARK, BM_COLORS] },
      { type: "images", items: [BM_VARIATIONS] },
      { type: "h", text: "The logo in motion" },
      {
        type: "p",
        text: "I also gave the mark a motion of its own. The animation never leaves the construction grid: each shape rounds into a capsule along the same lines, the capsules shrink into three circles that rotate around the mark's center, and they open back into the logo. I built it in code with Claude and wrote guidelines for each step, so it can be reproduced anywhere the brand needs to move.",
      },
      { type: "images", items: [BM_LOGO_ANIM, BM_LOGO_GRID] },
      { type: "images", items: [BM_LOGO_CAPSULES, BM_LOGO_ROTATION] },
      { type: "h", text: "Website: from a fast build to a crafted one" },
      {
        type: "p",
        text: "The CEO had rebuilt the website in Ploy to move fast. I proposed a set of improvements on top of it and designed them for production: a visual direction mixing engraving with geometric dithering, warmer and lighter backgrounds with grain, and isometric illustrations as a reusable language for explaining the platform. I updated the illustrative product view, the platform diagrams, the TPM-Bench v2 results section and the footer.",
      },
      { type: "images", items: [BM_SITE_WALK] },
      { type: "images", items: [BM_SITE_APPLIED, BM_SITE_AGENT] },
      {
        type: "p",
        text: "Motion does the explaining. The platform diagram walks through how evidence and requirements route through Coverbase step by step, and the Industries illustrations animate on hover.",
      },
      { type: "images", items: [BM_SITE_DIAGRAM, BM_SITE_INDUSTRIES] },
      { type: "h", text: "Marketing: pages a guest can act on" },
      {
        type: "p",
        text: "For a hosted evening on the Amsterdam canals during a major industry conference week, I designed a landing page that reads like the invitation it is: one scene, the date and boarding area up front, a short reason to come, a welcome for guests whether or not they have a conference badge, and a reservation form that asks for four fields.",
      },
      { type: "images", items: [BM_AMSTERDAM] },
      {
        type: "p",
        text: "The Customer Advisory Board page was built for executives traveling to a full day in Napa Valley, so clarity mattered more than persuasion. Everything a guest needs to plan sits where they look first: the date with Add to calendar, the venue with directions, a note that travel, lodging and meals are covered, and a schedule from the morning departure to the ride back, with each session expanding to show what it covers.",
      },
      { type: "images", items: [BM_CAB_HERO, BM_CAB_GUEST] },
      {
        type: "p",
        text: "The same structure carried over to an executive dinner in New York, with its own share image so the invitation looks right wherever it's posted: the hero answers when, where and how to reserve, and the page explains why the evening is worth it before the short agenda.",
      },
      { type: "images", items: [BM_NYC_OG, BM_NYC_PAGE] },
      {
        type: "p",
        text: "Campaign ads used the same blues and a single idea each: watching vendors between annual reviews with Radar, and a free 2026 report on third-party risk in the age of AI.",
      },
      { type: "images", items: [BM_AD_RADAR, BM_AD_REPORT] },
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
    slug: "vendor-onboarding-audit",
    year: 2026,
    employer: CB,
    client: "Vendor onboarding audit",
    description: "A usability audit for a Fortune 500 prospect, turned into a clearer path from first login to a new vendor's next step.",
    teaser: "From \"I created the vendor, now what?\" to an agent that answers it",
    image: AUDIT_COVER,
    story: [
      { type: "images", items: [AUDIT_COVER] },
      {
        type: "p",
        text: "A Fortune 500 company evaluating Coverbase in a proof of concept kept running into the same wall: the product felt hard to use and non-obvious, most of all in vendor onboarding, the workflow almost every customer depends on. If less technical users struggled there, it meant friction, confusion and support load from day one.",
      },
      {
        type: "p",
        text: "I reviewed the prospect's call recordings, mapped their path from demo to first product touch, and logged usability issues for every step, from login to the vendor profile. I checked them against product analytics and support feedback, ranked them by how often they came up and what they put at stake for the deal, and turned each one into a design ticket with a proposed solution in Figma and a short thread for the team.",
      },
      { type: "h", text: "Search first, then create" },
      {
        type: "p",
        text: "Adding a vendor was the highest-priority fix. The modal opened on a noisy list of existing vendors before anyone typed, and when nothing matched, the way to create one from scratch was easy to miss. The new first step starts with a single name field: matching profiles appear as you type, each with Select and continue, and Continue from scratch is always there. The second step marks the fields that drive automatic workflow routing, so people know which details are worth filling in now.",
      },
      { type: "images", items: [AUDIT_STEP1, AUDIT_STEP2] },
      { type: "h", text: "I created the vendor, now what?" },
      {
        type: "p",
        text: "That was the question users asked right after creating a vendor. The vendor page now opens with the Coverbase Agent: it says what was just filled in and where it came from, recommends the next steps as an interactive checklist, and takes questions about the vendor. Its actions reuse the floating surfaces the product already has, and a vertical lifecycle sits beside it, because a horizontal stepper would not scale to more statuses.",
      },
      { type: "images", items: [AUDIT_AGENT] },
      { type: "h", text: "One job per tab" },
      {
        type: "p",
        text: "The old profile spread general information across three columns and several cards. I moved to navigation plus two columns with vertical tabs, and gave each tab one job: Overview for what changes or needs attention, About for the facts Coverbase extracts about the vendor in collapsible cards, and Properties for how the organization works with the vendor, with shortcuts to findings, commitments and questionnaire submissions. Tabs with nothing to act on stay hidden until they do, such as Bill of Materials after a BOM upload.",
      },
      { type: "images", items: [AUDIT_ABOUT, AUDIT_PROPERTIES] },
      { type: "h", text: "Lighter from the first screen" },
      {
        type: "p",
        text: "The same pass covered the shell around these flows. The top bar dropped repeated page icons, treats Work queue and Notifications as equal actions and only shows system status when something needs attention. The home page lost a redundant search field and gained at-a-glance cards that each lead to an action. On the vendors table, a heatmap showed clicks gathering on search, filters and New vendor, so the redesign keeps those prominent, makes New vendor the primary action and uses tabs for the related lists.",
      },
      { type: "images", items: [AUDIT_OVERVIEW] },
      {
        type: "p",
        text: "The prospect responded well to the redesigned vendor experience in a follow-up call, and the findings became the first set of design tickets for the onboarding work.",
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
      { type: "h", text: "A homepage that runs the engine" },
      {
        type: "p",
        text: "The homepage opens on the product itself: a SQL playground with callouts for hybrid search, LLM inference and federation, next to the line The Data and AI Stack in One Engine. From there it walks through what teams can ground in their data, three numbers worth remembering, what makes it ready for the AI era, proof from production, and where to start.",
      },
      { type: "images", items: [SA_HOME_HERO, SA_HOME_GROUND] },
      { type: "images", items: [SA_HOME_AI_ERA, SA_HOME_PRODUCTION] },
      { type: "h", text: "Diagrams that explain the architecture" },
      {
        type: "p",
        text: "Spice does three jobs in one engine, which is hard to say in a sentence. One diagram carries it, with a state for each capability: SQL federation and acceleration, hybrid search, and LLM inference. A second diagram shows where Spice sits, between AI apps and the storage and models they depend on.",
      },
      { type: "images", items: [SA_FEDERATION, SA_HYBRID, SA_INFERENCE] },
      { type: "images", items: [SA_STACK, SA_APPS] },
      { type: "h", text: "Marketing design" },
      {
        type: "p",
        text: "The same system carries the marketing work: release announcements such as Spice 2.2, the app icon, the Spice Cloud Platform sign-in and the closing call to action.",
      },
      { type: "images", items: [SA_22, SA_ICON] },
      { type: "images", items: [SA_SIGNIN, SA_CTA] },
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
    image: SPICE_COVER,
    coverVideo: { src: "/media/spice-org-cover.mp4", poster: "/media/spice-org-cover.webp", width: 1600, height: 1468, fill: true },
    story: [
      { type: "images", items: [SPICE_COVER, SPICE_CAPS, SPICE_INSTALL] },
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
      { type: "images", items: [SPICE_M_HERO, SPICE_M_MENU, SPICE_M_CTA] },
    ],
  },
  {
    slug: "inspect-zero-touch",
    year: 2026,
    employer: CB,
    client: "Inspect and Zero Touch",
    description: "Two ways to check a vendor without waiting on a questionnaire: test their live service, or assess them from evidence that already exists.",
    teaser: "Test the service, not the certificate",
    image: INSPECT_ZERO_TOUCH_COVER,
    story: [
      { type: "images", items: [INSPECT_ZERO_TOUCH_COVER] },
      {
        type: "p",
        text: "A vendor review usually rests on documents: a SOC 2 report, a questionnaire, a certificate. They describe what was true at one point in time. Inspect checks what is true now. Read-only agents sign in to the third-party apps a company uses and test the controls that matter, such as MFA, single sign-on and admin access, and keep time-stamped evidence of what they saw.",
      },
      { type: "h", text: "A guided connection to Okta" },
      {
        type: "p",
        text: "Inspect needs access to the company's identity provider before it can test anything. I started with the first screen: say plainly what Inspect does, then offer two ways in, connect Okta or Microsoft Entra to discover managed apps, or browse an application library for a quick test or an app outside the identity provider. The word library mattered: it tells people there are ready-made settings to start from.",
      },
      { type: "images", items: [CB_INSPECT_START] },
      {
        type: "p",
        text: "The connection itself became four guided steps: app details, configuring the connection, syncing and selecting applications, and preparing them for inspection. Each step separates what the person does in Okta from what Coverbase checks automatically, and asks for access only when it becomes relevant: the scopes for creating an inspection identity are explained up front but used only after apps are chosen, behind an explicit approval. I designed the loading and error states of every step, plus an empty inventory, so a wrong client ID or a missing role can be fixed in place without starting over.",
      },
      { type: "images", items: [CB_OKTA_CONNECT, CB_OKTA_SELECT] },
      { type: "images", items: [CB_OKTA_DONE] },
      {
        type: "p",
        text: "Connections then got one home under Configuration: a card for each of Okta, Microsoft Entra and Google OAuth, with status, last sync, the inventory available and the apps already added to Inspect.",
      },
      { type: "images", items: [CB_INSPECT_CONFIG] },
      { type: "h", text: "From one inspection to continuous checks" },
      {
        type: "p",
        text: "Once apps are connected, the Applications view shows what is inspected, what isn't, and what can't be reached. Inspections run on a schedule, and each run is compared with the last, separating material changes from noise, so a reviewer sees what changed rather than rereading everything.",
      },
      { type: "images", items: [CB_INSPECT_APPS] },
      { type: "h", text: "Zero Touch Assessments" },
      {
        type: "p",
        text: "Zero Touch is the lightweight sibling: an assessment built from public data and the intelligence Coverbase already holds, with no questionnaire and no outreach to the vendor. The first version treated it like a smaller traditional assessment, so reviewers expected to go through it issue by issue. I reframed it as screening: one assessment-level conclusion with grouped observations and the evidence behind them, and a default path of launch, review the summary, then close, or only when it's warranted, raise a finding or start a full assessment.",
      },
      { type: "images", items: [CB_ZERO_TOUCH] },
      {
        type: "p",
        text: "I designed the completed results first and worked backward into launch and processing. While a run is in progress, the old page offered Approve, Escalate and Archive before there was anything to act on, and filled the screen with empty scores, findings and sources. The new running state shows what Coverbase is doing right now, section by section, with a persistent index for jumping around a long report.",
      },
      { type: "images", items: [CB_ZT_RUNNING] },
      {
        type: "p",
        text: "On the completed page, the risk level and score come first, risk information is grouped in one place, and the reviewer decision stays in view on the right. Sections carry a confidence label, because evidence quality varies and \u201cnothing found\u201d must never read as \u201cstrong evidence of low risk\u201d.",
      },
      { type: "images", items: [CB_ZT_COMPLETED] },
      { type: "h", text: "Taking it to market" },
      {
        type: "p",
        text: "I also designed the September 2026 launch campaign for Inspect, built on one idea: a certificate says the castle was safe once. These two ads ran on LinkedIn and Meta.",
      },
      { type: "images", items: [CB_AD_POINT, CB_AD_VERIFY] },
      { type: "h", text: "Result" },
      {
        type: "p",
        text: "Both shipped in the September 2026 release. Inspect gained scheduled inspections, notifications for outcomes that need attention, change comparisons, evidence from browser activity and API responses, an Accounts view and repeatable probes. Zero Touch gained the new summary, six pre-built templates, and a way to build it into intake and other workflows. The first-run page, the guided Okta connection, the Configuration cards and the redesigned running and completed Zero Touch pages all shipped.",
      },
    ],
  },
  {
    slug: "cocuy",
    year: 2025,
    employer: ML,
    client: "Cocuy",
    wide: true,
    pairPrev: true,
    description: "Cocuy, the B2B design system that gave Mercado Libre's First Party tools one language.",
    teaser: "From launch in June to 62,000+ component insertions and a squad of its own",
    image: COCUY,
    story: [
      { type: "images", items: [COCUY, CQ_ANALYTICS] },
      {
        type: "p",
        text: "First Party, Mercado Libre's own retail business, runs on internal and vendor tools such as Scarlet, Buying Portal, Pandora and the supplier center. Each tool had grown its own frame: its own grid, navbar, side menu, headers, toolbars, rows, cards and error pages. Andes, Mercado Libre's design system, did not cover many of these B2B cases, so every team solved them again.",
      },
      {
        type: "p",
        text: "Cocuy is the answer: a B2B sub-library of Andes for First Party. I co-led it to get it off the ground and gain traction, and did its design execution. Once it had traction, a dedicated squad was created to maintain it and carry its future work.",
      },
      { type: "h", text: "Three goals" },
      {
        type: "p",
        text: "Improve how consistently the First Party tools work together as one ecosystem. Make the team faster at execution. Raise the quality of what ships.",
      },
      { type: "h", text: "Design, code and Storybook, in step" },
      {
        type: "p",
        text: "The biggest win is that Cocuy never lived only in Figma. We built the sub-library in Figma while staying aligned with front-end the whole way, so the patterns shipped as a Storybook library as well. We also created a skill that makes the design system ready for AI, so components and rules can be used by AI tools and not only by people.",
      },
      {
        type: "p",
        text: "The hardest part was not a component. It was keeping a large number of delivery and UX ops teams in sync on the same definitions while they kept shipping their own roadmaps, and that is the part we handled best.",
      },
      { type: "h", text: "Layout: one frame for every tool" },
      {
        type: "p",
        text: "We reviewed resolutions, grids, spacing and standard container widths, then designed a single Layout component based on Seller Experience screen types. Breadcrumbs, navbar, side menu, headers and toolbars are built into it, with containers, naming, auto layout and responsive behavior already set.",
      },
      { type: "images", items: [CQ_UPLOAD_BEFORE, CQ_UPLOAD] },
      { type: "images", items: [CQ_OFFERS] },
      { type: "h", text: "Bulk search" },
      {
        type: "p",
        text: "First Party teams search by dozens of IDs at once, a case Andes does not cover. Bulk search complements Andes: paste a list, see every ID as a tag, fix the ones with errors, search once. It works with or without split view, comes with guidelines and wordings, and sits inside the toolbar. It is implemented in Pandora's offer-removal tool.",
      },
      { type: "images", items: [CQ_SEARCH_BEFORE, CQ_SEARCH] },
      { type: "images", items: [CQ_SEARCH_PANDORA] },
      { type: "h", text: "Rows and cards" },
      {
        type: "p",
        text: "Rows were unified in design and specs between First Party and Sales, with a clearer visual hierarchy, and turned into a component other experiences can reuse. Cards were reviewed together with the Publificado flow to fix their reading levels, then built as one component covering every use case and handed off with the improvements applied to contracts and configurations.",
      },
      { type: "images", items: [CQ_ROW_BEFORE, CQ_ROW] },
      { type: "images", items: [CQ_CARDS_BEFORE, CQ_CARDS] },
      { type: "h", text: "Navbar and side menu" },
      {
        type: "p",
        text: "Three tools, three menus. We redrew the iconography to comply with Andes, then unified, refactored and published one navigation component with shared rules for behavior, color, size, spacing, the tool label and where each element goes. Navbar became the library's most used component, with 12,920 instances.",
      },
      { type: "images", items: [CQ_MENU_BEFORE, CQ_MENU] },
      { type: "h", text: "Headers and toolbars" },
      {
        type: "p",
        text: "Headers got standard spacing, alignment and hierarchy between their elements. Toolbars became one component, which removed the visual inconsistencies between tools.",
      },
      { type: "images", items: [CQ_HEADERS_BEFORE, CQ_HEADERS] },
      { type: "images", items: [CQ_TOOLBARS_BEFORE, CQ_TOOLBARS] },
      { type: "h", text: "Technical errors" },
      {
        type: "p",
        text: "403, 404, 500, offline and mobile errors looked different in every tool, from unstyled browser pages to mismatched illustrations. We documented the most frequent errors in First Party, wrote guidance for each type, and aligned with the front-end technical lead so the result shipped as a pattern. First Party teams adopted the standard illustrations and wordings.",
      },
      { type: "images", items: [CQ_ERRORS_BEFORE, CQ_ERRORS_404] },
      { type: "images", items: [CQ_ERRORS_403] },
      { type: "h", text: "Breadcrumbs" },
      {
        type: "p",
        text: "Breadcrumb guidelines moved into the Layout component, so they are applied the same way every time, with clear content rules across Seller Experience.",
      },
      { type: "images", items: [CQ_CRUMBS_BEFORE, CQ_CRUMBS] },
      { type: "h", text: "Results" },
      {
        type: "p",
        text: "Since its launch on June 19, Cocuy logged more than 62,000 component insertions in design files and grew past 20 components, patterns and guidelines, used by 23 teams. Navbar leads with 12,920 instances. A Cocuy squad now owns its maintenance and technical path.",
      },
      {
        type: "p",
        text: "Next: make Cocuy an official satellite library of Andes, move reusable patterns into the Seller Experience library, and keep building it in code as 1P UI Core.",
      },
    ],
  },

  // ---------- 2024 ----------
  {
    slug: "cool-earth",
    year: 2024,
    employer: TT,
    client: "Cool Earth",
    description: "A gamified donor experience that won Toptal's global hackathon.",
    teaser: "Turning donors into members with a gamified ECool Club",
    image: COOL_EARTH_COVER,
    story: [
      { type: "images", items: [COOL_EARTH_COVER, COOL_EARTH_HOME] },
      {
        type: "p",
        text: "Cool Earth is a charity that fights carbon emissions by keeping rainforests standing, and it works through the Indigenous and forest communities who have looked after those forests for generations. In Toptal's global hackathon in Q1 2024, Cool Earth asked teams for an immersive, educational and interactive way to turn businesses into long-term charity partners. I led design for our team, and we won.",
      },
      { type: "h", text: "The challenge" },
      {
        type: "p",
        text: "The brief asked for more than a campaign. The solution had to highlight the charity's impact, hook people's attention and convert them into donors, while serving outreach, fundraising and education alike. It also had to be low budget and low maintenance, easy for teams with basic technical skills to run with little training, true to Cool Earth's brand, and able to win new donors while strengthening existing partners. Judges scored the clarity of the idea, the clarity of how it reaches its audience, the approach, how widely Cool Earth's teams could use it, and the brand fit.",
      },
      { type: "h", text: "Giving as a game" },
      {
        type: "p",
        text: "Our idea was ECool Club: a membership where a business's support becomes progress it can see and share. Members take action for the forest and earn seeds, keep a daily streak, take free courses that end in certificates, unlock badges and tiers, and climb a weekly leaderboard. The game mechanics give a company a reason to come back and progress it can show, which is what turns a one-off gift into a lasting partnership, and the same content works for outreach, fundraising and education.",
      },
      { type: "images", items: [COOL_EARTH_REWARDS] },
      { type: "images", items: [COOL_EARTH_LEADERBOARD, COOL_EARTH_LEARN] },
      { type: "h", text: "High fidelity to sell the idea" },
      {
        type: "p",
        text: "A hackathon is won in a few minutes of demo, and judges and donors respond to what feels real. So I prioritized high-fidelity mockups in Cool Earth's own look over wireframes or diagrams: the audience could picture the product live on day one, feel the emotional pull of the mission, and see that the brand criterion was met. I also built a Cool Earth UI library, so every screen stayed consistent and on brand.",
      },
    ],
  },

  {
    slug: "atlas",
    rowEnd: true,
    year: 2024,
    employer: TT,
    client: "Atlas",
    description: "Scope and quote home service jobs remotely, from a phone scan.",
    teaser: "Scope a job from a phone scan, not a site visit",
    image: ATLAS_COVER,
    coverVideo: { src: "/media/atlas-cover.mp4", poster: "/media/atlas-cover.webp", width: 1600, height: 1056, fill: true },
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
    year: 2023, // estimate: the files date from 2023 to 2024
    employer: TT,
    client: "Charmed",
    description: "AI tools that take game creators from an idea to an animated 3D asset.",
    teaser: "Texture, animate and build 3D game assets with AI",
    image: CHARMED_COVER,
    coverVideo: { src: "/media/charmed-cover-square.mp4", poster: "/media/charmed-cover-square.webp", width: 1600, height: 1600, fill: true },
    story: [
      { type: "images", items: [CHARMED_COVER, CHARMED_WEB_HERO] },
      { type: "p", text: TT_NOTE },
      {
        type: "p",
        text: "Building a game has always meant big teams, deep pockets or a lot of time. Charmed set out to change that with AI tools for the whole 3D art process: generate a mesh, texture it with UV-unwrapped materials, then rig and animate it, all in apps designed to work together, on desktop and on a phone.",
      },
      { type: "h", text: "A texture generator artists can steer" },
      {
        type: "p",
        text: "The first tool was the AI Texture Generator, launched as a free beta. You describe a texture in a prompt, like Midjourney but in 3D, and artists keep control: a background image guides palette and style, guidance textures like line drawings and normal maps lock in details, and a patch tool regenerates small areas to explore variations.",
      },
      { type: "images", items: [CHARMED_RENDERS] },
      { type: "images", items: [CHARMED_PATCH, CHARMED_HELICOPTER] },
      { type: "h", text: "One suite, from mesh to motion" },
      {
        type: "p",
        text: "The same system then carried the rest of the suite: a 3D Animator that auto-rigs human-like meshes and adds animations, on desktop and mobile, and a 3D Designer that composes scenes from objects, environments and reference images.",
      },
      { type: "images", items: [CHARMED_ANIMATOR, CHARMED_ANIMATOR_MOBILE] },
      { type: "images", items: [CHARMED_DESIGNER] },
      { type: "h", text: "Onboarding as a game" },
      {
        type: "p",
        text: "For an audience of game makers, onboarding became a game too: quests to generate a geometry, texture an object, animate a character or share in the showcase, each one unlocking a chest of credits to spend in the tools.",
      },
      { type: "images", items: [CHARMED_ONBOARDING] },
      { type: "h", text: "Website and emails" },
      {
        type: "p",
        text: "The website shows the product at work, with materials, textures and refinements animating on a single robot, and the emails welcomed the first beta users and announced new features.",
      },
      { type: "images", items: [CHARMED_WEBSITE] },
      { type: "images", items: [CHARMED_WEB_MATERIALS, CHARMED_WEB_REFINE] },
      { type: "images", items: [CHARMED_EMAIL_WAITLIST, CHARMED_EMAIL_NOTIFY] },
      { type: "h", text: "My role" },
      {
        type: "p",
        text: "I designed the Hub and the tools' MVPs, the Texture Generator, the 3D Animator and the 3D Designer, the gamified onboarding, the website and the marketing emails.",
      },
    ],
  },
  {
    slug: "augmend",
    year: 2023, // estimate: the files date from 2022 to 2023
    employer: TT,
    client: "Augmend",
    description: "A real-time incident workspace for dev teams, with an AI assistant.",
    teaser: "Fix incidents together, with AI that remembers",
    image: AUGMEND_COVER_SQ,
    story: [
      { type: "images", items: [AUGMEND_COVER_SQ, AUGMEND_LANDING] },
      { type: "p", text: TT_NOTE },
      {
        type: "p",
        text: "Augmend was a Seattle-based dev tools startup building a new way to manage incidents: a shared space where engineers track and mitigate a problem in real time. It was built to be transparent, so clients and stakeholders could follow the progress, with AI support to guide the team and prevent bad outcomes. I joined as the Product Designer and helped shape the product vision from scratch.",
      },
      { type: "h", text: "A pitch built on one idea" },
      {
        type: "p",
        text: "The founding idea fit in a sentence: reduce the collaboration tax and augment what the team knows with AI. I designed the pitch deck the founders used to raise capital, and it framed the product as a multiplayer workspace, Figma meets Copilot, rebuilt for devops.",
      },
      { type: "images", items: [AUGMEND_PITCH_PURPOSE, AUGMEND_PITCH_SOLUTION] },
      { type: "h", text: "Prototypes first, then the MVP" },
      {
        type: "p",
        text: "Before committing to a build, the founder and CEO and I co-created prototypes and took them into customer conversations to validate the experience. Then I designed the MVP: a canvas where everyone brings their own tools, dashboards, terminals and logs, and works side by side, with every step recorded so the team keeps the context.",
      },
      { type: "images", items: [AUGMEND_WORKSPACE] },
      { type: "images", items: [AUGMEND_SIGNUP, AUGMEND_EMPTY] },
      { type: "images", items: [AUGMEND_CLIENT, AUGMEND_WAITLIST] },
      { type: "h", text: "A brand for developers" },
      {
        type: "p",
        text: "I designed the brand too: the A mark and wordmark, a dark interface with a lime accent, and a playful illustration style with teammates' cursors that runs from the product to the landing page.",
      },
      { type: "images", items: [AUGMEND_LOGO, AUGMEND_COLORS] },
      { type: "h", text: "Landing page and emails" },
      {
        type: "p",
        text: "The landing page invited teams to join the waitlist for the private beta, and a few emails carried the same voice: the beta confirmation, a newsletter for new articles and the team invitation.",
      },
      { type: "images", items: [AUGMEND_EMAIL_BETA, AUGMEND_EMAIL_ARTICLE, AUGMEND_EMAIL_INVITE] },
      { type: "h", text: "My role" },
      {
        type: "p",
        text: "I was the Product Designer (UX/UI) from the start. I designed the MVP, the brand, the landing page, the emails and the pitch deck, and co-created the prototypes we used to validate the experience with customers.",
      },
    ],
  },
  {
    slug: "swippr",
    year: 2023, // estimate
    employer: { label: "Founder" },
    client: "Swippr",
    description: "A hiring startup I co-founded, with AI matching and swipe-to-apply.",
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
