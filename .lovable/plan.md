# Vertex Visual Overhaul

Make the site feel designed, not templated: black stays, but gains depth, glass, typography and motion across every page.

## 1. Foundation — depth on black

- Layered background system: base black plus a soft silver radial glow, a fine grain/noise overlay, and the existing grid rendered as a slow parallax layer with a vignette so it never looks flat.
- New tokens in `src/styles.css`: elevated surfaces (`--surface-1/2/3`), glass tokens (translucent fill, border, blur), silver gradient text, glow shadows, and a light-sweep border effect for cards and buttons.
- Radius, spacing, and shadow scale unified so all components share the same physical language.

## 2. Component system

- Glass card primitive: translucent panel, hairline top highlight, hover lift plus a cursor-tracked sheen. Used by member cards, events, projects, announcements, mentors, hackathon panels, dashboard and admin blocks.
- Rebuilt buttons (primary silver, ghost, outline with glow border), badges/chips, inputs with focus glow, tabs, section headers with monospace eyebrow labels and rule lines, skeleton loaders, and richer empty states.
- Header: floating glass bar that shrinks on scroll, animated active-link indicator, and a proper full-screen mobile menu (currently links just hide on small screens).
- Footer: layered glass with big Vertex mark, quick links, and hairline dividers.

## 3. Motion

- Add Motion (framer-motion) with a shared set of variants: scroll reveal, staggered grids, page transitions between routes, and number count-ups for stats.
- Hero: kinetic type reveal, animated logo mark, subtle magnetic hover on primary actions, marquee strip of teams/skills.
- Micro-interactions: hover tilt on member cards, animated QR reveal, animated tabs and filter chips, toast/skeleton polish.
- All motion respects `prefers-reduced-motion`.

## 4. Page-by-page

- Home: editorial hero with oversized type, animated stat band, bento-style leadership block, team sections as glass grids, marquee, refined contact block.
- Member profile: cinematic header with large photo, gradient scrim, role/team chips, tabbed content (about, skills, achievements, projects), glass QR panel with share/download.
- Events: split layout with featured event hero (SIH), timeline rail, and glass event cards with status chips.
- Hackathon workspace: dashboard-style bento — timeline, team roster, submission state, announcements.
- Projects / Announcements / Mentors: masonry-ish glass grids, animated filter chips, better empty states.
- Dashboard + Admin: same design system applied — clearer sectioning, stat tiles, glass tables and forms.

## Technical notes

- All colors/effects go through semantic tokens in `src/styles.css`; no hardcoded color utilities in components.
- Glass uses Tailwind `backdrop-blur` utilities only (no hand-written vendor prefixes).
- New shared components under `src/components/ui/` and `src/components/` (GlassCard, SectionHeader, Reveal, PageShell, MobileNav, StatTile).
- Only presentation changes: data loading, server functions, auth and hackathon logic stay as-is.
- Verify each route in desktop and mobile viewports after the pass.

## Order

1. Tokens, background layers, motion setup
2. Shared components, header/footer
3. Home and member profile
4. Events, hackathon, projects, announcements, mentors
5. Dashboard and admin
6. Responsive + reduced-motion pass
