---
goal: Production-ready SIH Internal Hackathon workspace for Vertex
version: 1.0
date_created: 2026-08-20
last_updated: 2026-08-20
owner: Vertex Technical Club
status: 'In progress'
tags: [feature, sih, registration, administration, design]
---

# Introduction

![Status: In progress](https://img.shields.io/badge/status-In_progress-yellow)

Build a real internal-selection workspace for SIH 2026. It must accept and manage student teams, preserve every submission, issue verifiable QR passes, give staff complete operational control, and avoid publishing unverified SIH dates, problem statements, or branding.

## 1. Requirements & Constraints

- **REQ-001**: Provide a public `/hackathon` route with event status, rules, announcements, milestones, a real registration entry point, and public team roster that excludes contact information.
- **REQ-002**: Require each registering team to provide a unique team name, a lead, and a roster within the administrator-configured team-size range.
- **REQ-003**: Give a team lead a private, token-backed dashboard where they can edit the roster, select an SIH problem statement, save a draft, make one intentional final submission, and view activity history.
- **REQ-004**: Generate a QR pass only after successful registration; provide a staff-only scanner/check-in flow that records who was checked in and when.
- **REQ-005**: Give admins controls for registration and submissions windows, rules, milestones, announcements, problem-statement import and publication, team status, submission review, and exports.
- **REQ-006**: Apply the new premium Vertex visual system across the hackathon, events, profile, dashboard, and admin experiences.
- **SEC-001**: Store only a hash of each private team token; never expose the token after initial registration except through the lead's explicit downloaded/saved key.
- **SEC-002**: Authorize all staff and admin changes server-side with existing `assertStaff` and `assertAdmin` checks; do not trust browser role state.
- **SEC-003**: Validate every request with Zod, cap text and file inputs, validate URLs, and prevent changes after a final submission unless an admin reopens the team.
- **SEC-004**: Keep student contact fields and submission drafts private; public views may reveal only deliberately published work and public roster fields.
- **CON-001**: Do not hard-code 2026 SIH dates, problem statements, logo files, or claims until the club verifies the source asset and imports it through the admin workflow.
- **CON-002**: Preserve Lovable-compatible Git history; use additive commits only and never force-push, rebase, amend, or squash published commits.
- **GUD-001**: Use accessible labels, keyboard-operable controls, visible error states, and reduced-motion-safe animation.
- **GUD-002**: Treat the official SIH portal as the source of record. The portal was inaccessible to automated verification on 2026-08-20, so imported statement data requires a staff review step.

## 2. Implementation Steps

### Implementation Phase 1

- GOAL-001: Stabilize the visual system and establish a working baseline for all subsequent routes.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-001 | Add `src/components/Atmosphere.tsx` and `src/components/Reveal.tsx`; use Motion with `useReducedMotion` and no pointer capture. | ✅ | 2026-08-20 |
| TASK-002 | Replace the flat homepage chrome in `src/components/SiteChrome.tsx` and `src/routes/index.tsx` with responsive glass navigation, mobile navigation, elevated surfaces, active-atmosphere hero, and scroll reveals. | ✅ | 2026-08-20 |
| TASK-003 | Regenerate `package-lock.json` from `package.json` so the declared Motion dependency is installable by `npm ci`. | ✅ | 2026-08-20 |

### Implementation Phase 2

- GOAL-002: Make SIH data safe, configurable, and operationally complete.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-004 | Add a migration for `hackathon_problem_statements`, `hackathon_checkins`, and immutable final-submission fields; add unique keys, foreign keys, indexes, RLS, and service-role-only mutations. |  |  |
| TASK-005 | Extend `src/lib/schemas.ts` with statement import, URL, check-in, and final-submission schemas; reject duplicate emails/USNs within a roster and invalid submission states. |  |  |
| TASK-006 | Extend `src/lib/hackathon.server.ts` to use transactions or compensating cleanup for team registration, issue QR payloads, preserve draft history, enforce finalization locks, and expose staff-safe export data. |  |  |
| TASK-007 | Extend `src/lib/hackathon.functions.ts` with server-authorized statement management, finalization/reopen, QR verification, check-in, and CSV export functions. |  |  |

### Implementation Phase 3

- GOAL-003: Deliver the student registration and team-management journeys.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-008 | Add `src/routes/hackathon/index.tsx` with SIH overview, officially imported statement browser, announcements, timeline, registration status, roster, and registration CTA. |  |  |
| TASK-009 | Add `src/routes/hackathon/register.tsx` with progressive team roster fields, inline validation, explicit registration confirmation, team-key handoff, printable QR pass, and recovery guidance. |  |  |
| TASK-010 | Add `src/routes/hackathon/team.tsx` with a token-only session stored in browser session storage, roster manager, selected statement, autosaved draft, final-submit confirmation, timeline, and activity feed. |  |  |
| TASK-011 | Add an SIH workspace route and CTA to `src/components/SiteChrome.tsx`, `src/routes/events.tsx`, and `src/routes/index.tsx`. |  |  |

### Implementation Phase 4

- GOAL-004: Deliver staff operations without exposing private student information.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-012 | Add an SIH tab to `src/routes/_authenticated/admin.tsx` for registration windows, rules, milestone/announcement composition, problem-statement CSV import, team review, status changes, and CSV export. |  |  |
| TASK-013 | Add `src/routes/_authenticated/checkin.tsx` for camera/manual QR validation, duplicate-check-in feedback, roster display, and staff audit trail. |  |  |
| TASK-014 | Add a member ID-card/check-in representation to `src/routes/member.$slug.tsx` only for authenticated staff and member-authorized use; do not use a static public QR as authority. |  |  |

### Implementation Phase 5

- GOAL-005: Complete quality, security, and live-event readiness verification.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-015 | Add unit tests for token hashing, registration limits, duplicate identity rejection, finalized submission locking, and check-in idempotency. |  |  |
| TASK-016 | Add integration tests against a disposable Supabase project for roles, RLS, data privacy, state transitions, and failure recovery. |  |  |
| TASK-017 | Test desktop and mobile registration, team editing, final submission, check-in, and admin export manually with a seeded test event; record the runbook in `docs/sih-operations.md`. |  |  |

## 3. Alternatives

- **ALT-001**: Use a public form and spreadsheet for registration. Rejected because it cannot safely manage rosters, submissions, QR verification, or controlled status changes.
- **ALT-002**: Authenticate every student with a new account. Deferred because token-backed team management reduces registration friction; it may be added later for account recovery.
- **ALT-003**: Hard-code the SIH 2026 statement list into source. Rejected because the list, dates, and official assets can change and must be reviewable by staff.

## 4. Dependencies

- **DEP-001**: Production Supabase project with current migrations applied and service-role secrets configured in the deployment environment.
- **DEP-002**: Official SIH 2026 problem-statement workbook, announcement dates, PPT template, and brand-asset permission supplied or approved by the club SPOC.
- **DEP-003**: Staff devices with camera access for QR check-in; the manual code path is mandatory as a fallback.

## 5. Files

- **FILE-001**: `src/lib/hackathon.server.ts` — private event workflow and data operations.
- **FILE-002**: `src/lib/hackathon.functions.ts` — validated server-function boundary.
- **FILE-003**: `src/lib/schemas.ts` — all untrusted input contracts.
- **FILE-004**: `supabase/migrations/` — SIH-specific schema and access controls.
- **FILE-005**: `src/routes/hackathon/` — public, registration, and team pages.
- **FILE-006**: `src/routes/_authenticated/admin.tsx` and `src/routes/_authenticated/checkin.tsx` — staff operations.
- **FILE-007**: `docs/sih-operations.md` — event-day operating procedures.

## 6. Testing

- **TEST-001**: `npm ci && npm run build` completes with no type, route-generation, or production-build errors.
- **TEST-002**: Valid teams from the configured minimum through maximum size register exactly once and receive a QR pass; invalid/duplicate teams are rejected with useful errors.
- **TEST-003**: A saved draft remains editable, a final submission is locked, and an admin can explicitly reopen it.
- **TEST-004**: A QR check-in succeeds once, reports a prior check-in on repeat scan, and records staff/time data.
- **TEST-005**: Anonymous requests cannot enumerate contacts, drafts, team tokens, private QR payloads, or staff functions.

## 7. Risks & Assumptions

- **RISK-001**: Late or corrected SIH data could mislead students; mitigate with admin-managed import, source URL, version label, and publish toggle.
- **RISK-002**: A lost private team key can prevent management access; mitigate with lead-email recovery requiring staff verification rather than automatic disclosure.
- **RISK-003**: Service outage on event day can affect camera check-in; mitigate with downloadable staff roster and manual code fallback.
- **ASSUMPTION-001**: Vertex has a staff member designated as the SIH SPOC who will approve official content before publishing it.
- **ASSUMPTION-002**: The internal event allows team sizes that the admin can configure; the default must not be asserted as an SIH rule without SPOC confirmation.

## 8. Related Specifications / Further Reading

[Smart India Hackathon official portal](https://www.sih.gov.in/)
[SIH 2024 College SPOC guidelines](https://www.sih.gov.in/letters/Guidelines-College-SPOC.pdf)
[Vertex SIH backend foundation](../../src/lib/hackathon.server.ts)
