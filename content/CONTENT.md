# uxdarwin.com — Content doc (v0.1, draft for review)

This is the single source for everything the site says: positioning, structure, headlines, and body copy. We agree on it here before any design or code.

**How to review:** comment inline on the PR. Where there are options (A / B / C), pick one or mix. Anything marked **❓ Needs Darwin** is a fact only you can give; the site will not ship with any of those gaps (no placeholders, no lorem ipsum). A section without its facts gets cut, not faked.

**Status legend:** ✅ ready to use · ✏️ draft, needs your edit · ❓ needs facts from you

---

## 1. Positioning

### 1.1 The one message ✏️

> A Staff Product Designer who leads teams, builds design systems, and increasingly ships the frontend himself, across startups, a LatAm-scale marketplace, agencies, and his own product.

Everything on the site should support that sentence. A reviewer who skims for 30 seconds should leave with three things:

1. **He's senior and has led.** 11+ years in product design, 8+ leading. Led a 12-person team at Mercado Libre; built a design team from zero at Red Valley.
2. **He has range.** Founding designer at an AI startup, enterprise seller tools at Latin America's largest marketplace, agency client work, and a product he built and sold himself.
3. **He closes the gap between design and code.** Design systems at two companies, and now shipping small frontend features at Coverbase. The site itself is proof.

### 1.2 Title and framing ✅

- Title everywhere: **Staff Product Designer**.
- Design engineering is described as *how the scope is growing*, never as a new title. Phrases we use: "designs and ships", "from Figma to production", "close to the code". We never say "Design Engineer" as his role.
- Mercado Libre framing, exact: **UX Technical Lead for the First Party business unit, leading 12 people, within Seller Experience**. We don't claim the whole design org.

### 1.3 Voice ✏️

- First person, plain, specific. Short sentences. Numbers over adjectives.
- Confident without superlatives: no "passionate", "rockstar", "pixel-perfect", "obsessed with users".
- Every claim is backed by a project on the page. If we can't show it, we don't say it.
- English first. ❓ Do you want a Spanish version (useful for LatAm roles), or English only?

---

## 2. Site structure

Proposal: a short, multi-page site. The home page does most of the work for a skimming reviewer; case studies are one click away.

| Page | Purpose | Length |
|---|---|---|
| **Home** | Hero, selected work grid, experience strip, how I work, contact | One scroll, ~5 screens |
| **Work / [project]** | One page per featured project, same structure each time | Visual-heavy, 2–4 min read |
| **About** | Story, timeline, design engineering, principles, photo | One screen of text plus timeline |
| **Contact** | Not a page: footer block plus a mailto link on every page | — |
| **Résumé** | PDF link in nav | ❓ Do you want a downloadable résumé? |

Nav: `Work` · `About` · `Résumé` · `LinkedIn ↗`

Why not one long single page: reviewers open case studies in tabs and share direct links. Why not long deep dives: reviewers told us they prefer breadth, so each case study is short and leads with the final design.

---

## 3. Home page

### 3.1 Hero ✏️ (pick one)

**Option A: scope-led (recommended)**
> **I design products, the systems behind them, and the code that ships them.**
> Staff Product Designer with 11+ years in product and 8+ leading teams. Currently founding designer at Coverbase AI. Before that, I led a 12-person design team at Mercado Libre.

**Option B: range-led**
> **From a church-booking app I sold to 30 clients to seller tools used in six countries.**
> I'm Darwin Álvarez, a Staff Product Designer. For 11+ years I've designed products at startups, agencies and Latin America's largest marketplace, and led the teams that build them.

**Option C: short and plain**
> **Darwin Álvarez, Staff Product Designer.**
> I lead design for products, teams and design systems, and I ship frontend code when it gets the work out faster. Founding designer at Coverbase AI; previously UX Technical Lead at Mercado Libre.

Why A: it states the three pillars in one line, positions design engineering as scope rather than title, and the subhead carries the seniority proof.

CTAs under the hero: **See selected work** (scrolls to grid) · **Get in touch** (mailto)

❓ Needs Darwin: the email address you want public, and whether you want "Based in …" / "Open to remote" in the hero.

### 3.2 Selected work section ✏️

Section title: **Selected work**
Intro line: *A range of products, teams and stages: an AI startup from day one, enterprise tools at marketplace scale, agency work, and a product I built and sold.*

Each card: project name, one-line outcome, company · year, tags (e.g. *Design system · 0→1 · B2B*). Card copy is in section 4.

### 3.3 Experience strip ✏️

A compact row a reviewer can scan in five seconds.

| Company | Role | Years | One line |
|---|---|---|---|
| Coverbase AI | Founding Designer | 2024–now | Product, brand and design system for an AI startup, from design sprint to shipped frontend. |
| Mercado Libre | UX Technical Lead, First Party | ❓ | Led 12 designers in Seller Experience; built the business unit's design system. |
| Red Valley | Design Lead | ❓ | Built the agency's design team from scratch. |
| Chezco | Founder | ❓ | Designed, built and sold an event reservations app to 30 churches. |

❓ Needs Darwin: start and end years for Mercado Libre, Red Valley and Chezco. Was Chezco running in parallel with other roles?

### 3.4 How I work ✏️

Section title: **How I work**

**Start from the business problem.**
I frame the work around what the company needs to move and what the user is stuck on, then agree on how we'll know it worked before we design anything.

**Systems over screens.**
I've built design system libraries at Mercado Libre and Coverbase so teams ship consistent work without waiting on design. A good system is the most leveraged thing a designer can make.

**Close to the code.**
I review in the browser, ship small frontend features myself, and ❓ *[prototype in code? confirm]*. Fewer handoffs means less lost in translation.

**Grow the team, not just the work.**
I've led a 12-person team and built a design team from zero. I care about clear critique, shared standards, and designers who can make decisions without me.

❓ Do these four sound like you? Swap any that don't, and tell me a real example behind each so the case studies can prove them.

### 3.5 Contact block ✏️

> **Let's talk.**
> I'm open to Staff and Principal product design roles, especially where design and engineering work closely together.
> `email` · LinkedIn ↗ · Résumé (PDF)

❓ Do you want to say you're open to roles publicly? (Some people prefer a neutral "Say hello".) Alternative line: *I like hard product problems and small, senior teams. Say hello.*

---

## 4. Featured work

### 4.1 Recommended lineup ✏️

Reviewers want range, so the goal is 5–6 projects that each show something different. Candidates below; ❓ **you pick the final set**, and tell me which have shippable final screens in Figma.

| # | Project (working name) | Company | What it proves | Status |
|---|---|---|---|---|
| 1 | Coverbase core product flow | Coverbase AI | 0→1 product design at an AI startup, research and product decisions | ❓ which flow? |
| 2 | Coverbase design system + frontend | Coverbase AI | Systems thinking and design engineering (shipped code) | ❓ |
| 3 | Coverbase marketing site / brand | Coverbase AI | Visual and brand craft | ❓ |
| 4 | First Party design system library | Mercado Libre | Design systems at scale, multi-country | ❓ |
| 5 | First Party vendor / internal tool | Mercado Libre | Complex B2B workflows, enterprise UX, LatAm users | ❓ which tool? |
| 6 | Church event reservations app | Chezco | End-to-end ownership: designed, built, sold to 30 clients | ❓ |
| 7 | Red Valley client project | Red Valley | Agency range, different industry | ❓ which client can you show? |

My suggested set of six: **1, 2, 4, 5, 6, 7**, and fold the marketing site (3) into the Coverbase case studies as a section. That gives two startup, two enterprise, one founder, one agency. Leadership (12-person team, building Red Valley's team) lives on About and inside the relevant case studies rather than as its own project.

A "More work" strip under the featured grid can hold smaller pieces (explorations, components, motion studies) as images with one-line captions.

❓ NDA check: which Mercado Libre and Coverbase work can be shown publicly, and does any of it need blurring or redacted data?

### 4.2 Case study template ✅

Every case study uses the same order, so reviewers know where to look. Final design comes first, not last.

1. **Title + one-line outcome** (the headline is the result, not the project name)
2. **Hero visual**: the final shipped design
3. **At a glance**: Company · Product · Segment · My role · Team · Timeline · Platforms
4. **Context**: what the product is, who uses it (2–3 sentences)
5. **The problem**: business problem and user problem (2–3 sentences)
6. **What I did**: role, key decisions, trade-offs, who I worked with (PMs, engineers, researchers). 3–4 short beats, each with a visual
7. **The final design**: screens, flows, components, prototype or motion
8. **Results**: metrics where we have them, qualitative outcomes where we don't
9. **What I'd do next** (optional, 1–2 sentences)

Target length: ~400–600 words of copy per case study. The visuals carry it.

### 4.3 Draft copy per project

Below is what I can write from what I know today. Everything marked ❓ is what's missing before the page can ship.

---

#### Coverbase AI — Founding product design

**Card line:** ✏️ *Designing an AI product from the first sprint to shipped code.*

**At a glance:** Coverbase AI · San Francisco · ❓ product/segment · Founding Designer · Nov 2024–present · ❓ team size · Web

**Context** ✏️
Coverbase AI is a San Francisco startup building ❓ *[one-line: what the product does and for whom]*. I joined in November 2024 as the founding designer, part-time at first and then full-time, owning product, marketing and design system work.

**The problem** ❓
What was the product or business problem when you joined? (e.g. no design foundation, a key workflow users struggled with, a launch to support.)

**What I did** ✏️
- Ran design sprints with the founders to ❓ *[decide what?]*.
- Did user research with ❓ *[who: customers, prospects?]* that changed ❓ *[which decision?]*.
- Built the design system from scratch, so the team could ❓ *[ship faster / stay consistent]*.
- Designed the marketing site and ❓ *[brand?]*.
- Shipped small frontend features myself and handed off the rest to engineering.

**Results** ❓
Any of: launch dates, customers onboarded, conversion on the marketing site, time saved per handoff, components in the system, features you shipped in code.

---

#### Coverbase AI — Design system, designed and coded

**Card line:** ✏️ *A design system built for a team where the designer also ships.*

**Context** ✏️
A founding team moves fast, and without shared components every new screen is a one-off. I built Coverbase's design system so product and marketing could share one visual language, and so design decisions show up in code the same way they look in Figma.

**What I did** ❓
Need: what's in it (tokens, components, patterns), what tools (Figma variables? code library? Storybook?), which parts you built in code yourself, how engineers adopted it.

**Results** ❓
Need: number of components, adoption, any speed or consistency change you can name.

---

#### Mercado Libre — First Party design system library

**Card line:** ✏️ *One design system for a business unit serving sellers in six countries.*

**At a glance:** Mercado Libre · Seller Experience · First Party business unit · UX Technical Lead · ❓ years · Users in Chile, Argentina, Brazil, Peru, Colombia and Mexico

**Context** ✅
Mercado Libre is Latin America's largest marketplace. Its Seller Experience team, 200+ people, builds the tools sellers use to run their business. I was UX Technical Lead for the First Party business unit, which builds tools for vendors and internal teams, leading a team of 12.

**The problem** ❓
What wasn't working before the library? (e.g. inconsistent tools, duplicated components, slow delivery, gaps in the company-wide system for B2B use cases.)

**What I did** ✏️
I built and led the business unit's design system library: ❓ *[how it related to Mercado Libre's main design system, what it added, how you got 12 designers and their engineering partners to use it]*.

**Results** ❓
Need: components, teams or products using it, adoption, delivery time, consistency audits, anything measurable.

---

#### Mercado Libre — ❓ Vendor or internal tool

**Card line:** ❓ Depends on the project.

I need you to pick one shipped tool from First Party (a vendor-facing flow or an internal operations tool) that shows a complex B2B workflow. Then: what it does, who uses it, what was hard, what you decided, what changed after launch.

---

#### Chezco — Event reservations for churches

**Card line:** ✏️ *A product I designed, built and sold to 30 churches.*

**At a glance:** Chezco (my UX agency) · Founder · ❓ years · ❓ web / mobile

**Context** ✏️
Before joining larger teams, I ran Chezco, my own UX agency. Churches kept running events, from services to retreats, on ❓ *[paper sign-ups / spreadsheets / WhatsApp?]*. I designed and built a reservations app for them and sold it to 30 clients.

**The problem** ❓
What exactly was painful for organizers and attendees? Capacity limits, double bookings, check-in?

**What I did** ✏️
Everything: research with church staff, product design, ❓ *[build: did you code it, or lead a developer?]*, pricing, sales, and support. It's where I learned what it takes to make something people pay for.

**Results** ✏️
30 paying clients. ❓ Plus anything else: events or reservations processed, retention, how long it ran, what happened to it.

---

#### Red Valley — ❓ Client project

**Card line:** ❓ Depends on the project.

**Context** ✏️
At Red Valley, a design and development agency, I was Design Lead and built the design team from scratch while shipping client work.

❓ Pick one client project you can show, ideally in a different industry from the others. Then the same questions: client, problem, your role, final design, results.

---

## 5. About page

### 5.1 Headline ✏️

> **Designer, team lead, and lately, the person who ships the frontend too.**

### 5.2 Bio ✏️

**Short (for meta, social, cards — ~40 words)**
> Darwin Álvarez is a Staff Product Designer with 11+ years in product design and 8+ leading teams. He's the founding designer at Coverbase AI and was UX Technical Lead at Mercado Libre, where he led a 12-person team in Seller Experience.

**Long (About page, ~180 words, first person)**
> I've been designing products for more than eleven years and leading design teams for eight.
>
> I started by running my own UX agency, Chezco, where I designed, built and sold an event reservations app to 30 churches. That taught me the whole loop: finding a real problem, shipping something, and getting people to pay for it.
>
> At Red Valley I was Design Lead and built the agency's design team from scratch. At Mercado Libre I was UX Technical Lead for the First Party business unit inside Seller Experience, leading 12 designers and building the unit's design system library for tools used by vendors and internal teams across Chile, Argentina, Brazil, Peru, Colombia and Mexico.
>
> Since November 2024 I've been the founding designer at Coverbase AI, a San Francisco startup. I run design sprints and user research, make product decisions with the founders, built the design system, designed the marketing site, and ship small frontend features myself.
>
> That last part is where my work is heading: fewer handoffs, more of the design making it to production intact.

❓ Needs Darwin: where you're based, anything personal you'd like to include (one line is enough, e.g. what you do outside work), and a photo.

### 5.3 Timeline ✏️

Same data as the experience strip (3.3), with one extra line per role on scope and team. ❓ Add: education, notable talks, writing, teaching or mentoring, awards, if any.

### 5.4 On design engineering ✏️

> I'm a product designer first. But the best work I've shipped lately came from closing the gap between Figma and the browser: building components that match the system exactly, prototyping interactions in code, and shipping small features without a handoff. This site is part of that. I designed and built it myself. ❓ *[keep only if true once it's built]*

---

## 6. Footer ✏️

> Darwin Álvarez · Staff Product Designer
> `email` · LinkedIn ↗ · GitHub ↗
> Designed and built by me. © 2026

---

## 7. SEO and sharing ✏️

- **Title:** Darwin Álvarez · Staff Product Designer
- **Meta description (≤155 chars):** Staff Product Designer with 11+ years designing products, leading teams and building design systems. Founding designer at Coverbase AI; ex-Mercado Libre.
- **Open Graph image:** name, title, and one strong product visual (design phase).
- **Case study titles:** `[Project] · Darwin Álvarez`

---

## 8. GitHub profile README ✏️

This repo is your GitHub profile repo, so `README.md` shows on github.com/uxdarwin. Proposed text, kept short:

> ### Hi, I'm Darwin 👋
> Staff Product Designer. 11+ years designing products, 8+ leading design teams. Founding designer at Coverbase AI, previously UX Technical Lead at Mercado Libre. I design products and design systems, and I increasingly ship the frontend myself.
>
> 🌐 [uxdarwin.com](https://uxdarwin.com) · 💼 [LinkedIn](https://www.linkedin.com/in/darwinalvarezsanchez/)
>
> This repo is the source of my portfolio site.

❓ Should Coverbase AI link to its site? If so, confirm the URL. The uxdarwin.com link only goes in once the site is deployed (no broken links).

---

## 9. Everything I need from you

Grouped so you can answer in one pass. Short answers are fine; I'll turn them into copy.

**Basics**
1. Public email for the site.
2. Where you're based, and whether to mention remote / relocation.
3. English only, or Spanish too?
4. Downloadable résumé: yes or no?
5. Say "open to roles" publicly, or keep it neutral?
6. Photo for About.

**Dates and facts**
7. Years for Mercado Libre, Red Valley and Chezco.
8. One line on what Coverbase AI does and for whom, in words you're comfortable making public.
9. Team sizes you worked with at Coverbase and Red Valley.
10. Education, talks, mentoring, awards (if any).

**Projects**
11. Your final 5–6 projects (see 4.1). My suggestion: Coverbase product, Coverbase design system, ML design system, ML tool, Chezco, Red Valley client.
12. For each: the problem, 2–3 key decisions or trade-offs, who you worked with, and any numbers.
13. What can be shown publicly (NDA), and what needs redacting.
14. Which have final, shipped screens in Figma (we'll need them at export quality in the design phase).

**Tone check**
15. Hero option A, B or C.
16. Do the four "How I work" principles sound like you?
