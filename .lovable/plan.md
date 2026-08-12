# Vertex — Phase 2: A Living Club Platform

Turning the static roster into a real club system: accounts, applications, events with QR check-in, a projects showcase, and a bolder visual layer.

This is big, so it ships in four waves. Each wave is usable on its own.

## Wave 1 — Backend + Live Member Profiles

Enable Lovable Cloud (database, auth, file storage) and move members out of the hardcoded file.

- Members, teams, roles stored in the database; the homepage and profile pages read live data.
- Member login (email + password). A logged-in member can edit their own profile: photo upload, bio, skills, social links.
- Leadership/admin role (stored in a separate roles table, never on the profile) can add or remove members, assign teams, promote heads, and edit anything.
- Admin dashboard at `/admin` — members, events, applications in one place.
- Existing roster from `src/data/team.ts` seeded into the database so nothing is lost.

## Wave 2 — Recruitment Funnel

- Public `/join` page: what each team does, current openings, why join.
- Application form: name, USN, year, branch, team preferences (ranked), why-you, links.
- Applications land in the admin dashboard with status flow: new → shortlisted → interviewed → accepted / rejected.
- Team heads see only applications for their team; leadership sees all.
- Accepted application can be converted into a member record in one click.

## Wave 3 — Events + QR Check-in

- Events move to the database; admins create/edit/publish them.
- Public event page per event with registration (open to non-members too).
- Every registration generates a digital pass with a unique QR code.
- `/scan` — a camera-based scanner for organizers: scan a pass, mark attendance, see live check-in count. Invalid or already-used passes are called out clearly.
- Per-event attendance list, exportable.
- Member profile QR (already built) keeps working and now also acts as a member check-in code.

## Wave 4 — Interactive Showcase + Bold Visuals

Showcase:
- Projects gallery: each project has cover image, description, tech tags, and linked contributors; contributors' profiles link back to their projects.
- Achievements/wall of wins timeline.
- Explorable org graph: an interactive node map of Vertex — leadership at the center, teams branching out, members as nodes. Drag, zoom, click a node to open a profile.

Bold visual layer (staying pure black, hairline, monospace — no new palette):
- WebGL hero: a slowly rotating wireframe vertex/polyhedron reacting to cursor, with the Vertex mark locked in the center. Static fallback where WebGL is unavailable.
- Terminal-style boot sequence on first visit only — a few lines of type-on text before the hero resolves. Skippable, respects reduced-motion, never blocks navigation.
- Generative member ID cards: each profile renders as a printable/shareable badge — monogram or photo, team code, member ID, QR — with a deterministic generated pattern unique to that member. Downloadable as an image.
- Scroll-driven reveals, magnetic hover on nav and cards, animated counters on the stats strip.

## Technical Notes

- Lovable Cloud (Postgres + auth + storage) backs everything. Row-level security on every table; roles in a dedicated `user_roles` table with a security-definer role check.
- Photos go to a storage bucket; public read, member-scoped write.
- QR scanning uses a browser camera library loaded client-side only; check-in validation happens server-side so a screenshotted pass can't be reused.
- WebGL hero and the org graph are client-only, lazily loaded so they never block first paint or SSR.
- Public pages (home, profiles, events, join) stay server-rendered for SEO; admin and scanner are behind auth.
- Motion respects `prefers-reduced-motion` throughout.

## Suggested Order

Wave 1 first — everything else depends on the database and roles. Then pick Wave 2, 3, or 4 based on what the club needs soonest (recruitment season vs. an upcoming event).
