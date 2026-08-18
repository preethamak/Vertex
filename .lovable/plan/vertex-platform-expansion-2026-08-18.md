# Vertex Platform Expansion

## Goal
Turn Vertex into a polished club operating system: reliable public member media, rich member identity and discovery, live event experiences, and a real SIH Internal Hackathon workspace. The SIH schedule remains “to be announced”; no fictional dates, venues, registrations, teams, or activity will be seeded.

## What will be built

### 1. Reliable photo pipeline
- Replace expiring signed URLs stored in member records with stable storage object paths.
- Serve public profile media through a controlled media endpoint that creates a fresh short-lived signed response, while preserving the private bucket.
- Upload through an authenticated server-controlled flow with file type/size validation, unique member-scoped paths, upload progress/state, retry, immediate preview, and explicit save confirmation.
- Normalize photos to a web-friendly square image in the browser, keep initials as a resilient fallback, and migrate existing stored photo URLs back to object paths where possible.
- Use the same media resolver for member cards, profiles, projects, recap cards, and social images.

### 2. Member identity and discovery
- Add a downloadable black-and-silver member ID card with member photo, role, team, Vertex mark, and profile QR; provide square and story-sized exports.
- Add a share-card route suitable for social previews and set each profile’s OG/Twitter image to its absolute card URL.
- Add a dedicated achievements/recap view per member, grouped by year, using real attendance, badges, achievements, mentorship, and contributed projects only.
- Upgrade directory search to multi-skill matching with AND/OR controls, skill suggestions, match counts, and a visual skill-to-member graph.
- Add an interactive organization graph connecting leadership, team heads, and members, with pan/zoom/drag, search focus, and links to profiles.

### 3. Live event mode
- Add a full-screen event operations route for admins/heads with real-time registration and check-in counts, recent arrivals, capacity progress, and attendance breakdowns.
- Subscribe to backend changes so the board updates without refresh; keep public attendee PII private.
- Link live mode from the admin event controls and preserve the current secure check-in flow.

### 4. SIH Internal Hackathon
- Add one real event named **SIH Internal Hackathon**, with schedule and venue shown as **To be announced** rather than fabricated values.
- Add an admin-configurable hackathon workspace: registration window, min/max team size, submission phases, visibility, and rules.
- Allow any student to create a team through a validated public registration flow; generate a secure team-management link/token so participants do not need a Vertex account.
- Let team leads add/edit teammates, enforce unique emails/USNs and configurable team size, manage problem statement/theme/solution, mentor details, repository/demo/video links, and document/deck uploads.
- Add configurable timeline milestones and a team activity log recording meaningful changes.
- Add event-scoped announcements visible inside the SIH workspace.
- Add admin tools for teams, submission completeness, mentor assignment, evaluation criteria/scores/feedback, shortlist/status, exports, and registration controls.
- Prevent duplicate event/team/member registrations at the database layer and never seed fake teams, submissions, activity, judging, or attendees.

### 5. Across-site integration
- Give SIH a polished event detail page and clear entry points from Home, Events, Dashboard, and Admin.
- Extend the member dashboard with owned hackathon teams, submissions, timeline status, recap, and ID-card actions.
- Extend announcements and projects so real hackathon updates and completed submissions can flow into existing feeds/showcase when admins choose to publish them.
- Preserve the pure-black/silver Vertex design while improving responsive navigation, empty states, loading feedback, and mobile workflows.

## Technical details
- Add backend tables for event workspaces, hackathon teams, teammates, submissions, milestones, activities, event announcements, mentor assignments, evaluation criteria/scores, and secure management tokens.
- Every new public-schema table will include explicit grants, RLS, and narrow policies. Public team management will use validated server functions and hashed opaque management tokens; privileged judging stays authenticated and role-checked.
- Store uploaded document/photo object paths rather than expiring URLs. Downloads resolve paths at request time.
- Add realtime subscriptions only to safe event aggregates/authorized staff views; no public PII feed.
- Keep server-function files as thin declarations and move schemas/helpers to client-safe or server-only modules.
- Validate all browser and server inputs with Zod, including file metadata, URLs, team limits, status transitions, and scoring ranges.
- Add route-specific metadata for every new content route and verify desktop/mobile rendering, image loading, exports, registration, team management, and live updates.

## Delivery order
1. Database and storage model, including the real SIH event.
2. Photo migration and reliable upload/rendering pipeline.
3. SIH public registration, team workspace, timeline, announcements, submissions, and admin controls.
4. Member ID/social cards, OG images, recaps, skill graph, and org graph.
5. Live event mode and cross-site integration.
6. End-to-end verification and security/backend lint checks.
