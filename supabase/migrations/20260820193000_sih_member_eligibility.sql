-- SIH 2026 eligibility requires every team to include at least one female student.
-- Store the self-declared value needed to enforce that rule; it is never exposed on the public roster.
ALTER TABLE public.hackathon_team_members
  ADD COLUMN IF NOT EXISTS gender text;

ALTER TABLE public.hackathon_team_members
  DROP CONSTRAINT IF EXISTS hackathon_team_members_gender_check;

ALTER TABLE public.hackathon_team_members
  ADD CONSTRAINT hackathon_team_members_gender_check
  CHECK (gender IS NULL OR gender IN ('female', 'male', 'prefer_not_to_say'));
