-- QR check-in credentials are separate from team-management credentials.
ALTER TABLE public.hackathon_teams
  ADD COLUMN IF NOT EXISTS checkin_token_hash text UNIQUE;

CREATE INDEX IF NOT EXISTS hackathon_teams_event_checkin_token_idx
  ON public.hackathon_teams(event_id, checkin_token_hash)
  WHERE checkin_token_hash IS NOT NULL;
