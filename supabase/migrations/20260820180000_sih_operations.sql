-- Production controls for the Vertex SIH Internal Hackathon workspace.

CREATE TABLE public.hackathon_problem_statements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  statement_code text NOT NULL,
  title text NOT NULL,
  organization text,
  category text,
  theme text,
  description text,
  source_url text,
  source_version text,
  published boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT hackathon_problem_statements_code_nonempty CHECK (length(btrim(statement_code)) > 0),
  CONSTRAINT hackathon_problem_statements_title_nonempty CHECK (length(btrim(title)) > 0),
  CONSTRAINT hackathon_problem_statements_source_url_http CHECK (source_url IS NULL OR source_url ~* '^https?://')
);

CREATE UNIQUE INDEX hackathon_problem_statements_event_code_key
  ON public.hackathon_problem_statements(event_id, lower(statement_code));
CREATE INDEX hackathon_problem_statements_event_published_sort_idx
  ON public.hackathon_problem_statements(event_id, published, sort_order, statement_code);
GRANT SELECT ON public.hackathon_problem_statements TO anon, authenticated;
GRANT ALL ON public.hackathon_problem_statements TO service_role;
ALTER TABLE public.hackathon_problem_statements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published SIH problem statements are public"
  ON public.hackathon_problem_statements FOR SELECT TO anon, authenticated
  USING (published = true);
CREATE POLICY "Admins manage SIH problem statements"
  ON public.hackathon_problem_statements FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER hackathon_problem_statements_updated_at
  BEFORE UPDATE ON public.hackathon_problem_statements
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.hackathon_checkins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  team_id uuid NOT NULL REFERENCES public.hackathon_teams(id) ON DELETE CASCADE,
  checked_in_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  checked_in_at timestamptz NOT NULL DEFAULT now(),
  method text NOT NULL DEFAULT 'qr' CHECK (method IN ('qr', 'manual')),
  note text,
  UNIQUE(event_id, team_id)
);

CREATE INDEX hackathon_checkins_event_time_idx
  ON public.hackathon_checkins(event_id, checked_in_at DESC);
GRANT SELECT, INSERT ON public.hackathon_checkins TO authenticated;
GRANT ALL ON public.hackathon_checkins TO service_role;
ALTER TABLE public.hackathon_checkins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff read SIH checkins"
  ON public.hackathon_checkins FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'head'));
CREATE POLICY "Staff create SIH checkins"
  ON public.hackathon_checkins FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'head'));

ALTER TABLE public.hackathon_submissions
  ADD COLUMN IF NOT EXISTS finalized_at timestamptz,
  ADD COLUMN IF NOT EXISTS finalized_by_token_hash text,
  ADD COLUMN IF NOT EXISTS reopened_at timestamptz,
  ADD COLUMN IF NOT EXISTS reopened_by uuid REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE OR REPLACE FUNCTION public.prevent_finalized_submission_mutation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF OLD.finalized_at IS NOT NULL
     AND NOT public.has_role(auth.uid(), 'admin')
     AND NEW.finalized_at IS NOT NULL THEN
    RAISE EXCEPTION 'Finalized submissions can only be reopened by an administrator.';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS prevent_finalized_submission_mutation ON public.hackathon_submissions;
CREATE TRIGGER prevent_finalized_submission_mutation
  BEFORE UPDATE ON public.hackathon_submissions
  FOR EACH ROW EXECUTE FUNCTION public.prevent_finalized_submission_mutation();

REVOKE EXECUTE ON FUNCTION public.prevent_finalized_submission_mutation() FROM anon, authenticated;
