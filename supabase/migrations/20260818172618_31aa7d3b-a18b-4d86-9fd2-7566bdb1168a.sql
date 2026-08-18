ALTER TABLE public.events ALTER COLUMN event_date DROP NOT NULL;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS schedule_tba boolean NOT NULL DEFAULT false;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS workspace_kind text;
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS photo_path text;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS cover_path text;

CREATE TABLE public.event_workspaces (
  event_id uuid PRIMARY KEY REFERENCES public.events(id) ON DELETE CASCADE,
  registration_open boolean NOT NULL DEFAULT false,
  min_team_size integer NOT NULL DEFAULT 1,
  max_team_size integer NOT NULL DEFAULT 6,
  rules text,
  submissions_open boolean NOT NULL DEFAULT false,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT event_workspaces_team_size_valid CHECK (min_team_size >= 1 AND max_team_size >= min_team_size AND max_team_size <= 20)
);
GRANT SELECT ON public.event_workspaces TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.event_workspaces TO authenticated;
GRANT ALL ON public.event_workspaces TO service_role;
ALTER TABLE public.event_workspaces ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published event workspaces are public" ON public.event_workspaces FOR SELECT TO anon, authenticated USING (published = true);
CREATE POLICY "Admins manage event workspaces" ON public.event_workspaces FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER event_workspaces_updated_at BEFORE UPDATE ON public.event_workspaces FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.hackathon_teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  name text NOT NULL,
  lead_name text NOT NULL,
  lead_email text NOT NULL,
  lead_phone text,
  college text,
  management_token_hash text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'registered' CHECK (status IN ('registered','in_review','shortlisted','selected','waitlisted','rejected','withdrawn')),
  mentor_name text,
  mentor_email text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE, DELETE ON public.hackathon_teams TO authenticated;
GRANT ALL ON public.hackathon_teams TO service_role;
ALTER TABLE public.hackathon_teams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff manage hackathon teams" ON public.hackathon_teams FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'head')) WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'head'));
CREATE UNIQUE INDEX hackathon_teams_event_name_key ON public.hackathon_teams(event_id, lower(name));
CREATE UNIQUE INDEX hackathon_teams_event_lead_email_key ON public.hackathon_teams(event_id, lower(lead_email));
CREATE TRIGGER hackathon_teams_updated_at BEFORE UPDATE ON public.hackathon_teams FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.hackathon_team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL REFERENCES public.hackathon_teams(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  usn text,
  branch text,
  year text,
  is_lead boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE, DELETE ON public.hackathon_team_members TO authenticated;
GRANT ALL ON public.hackathon_team_members TO service_role;
ALTER TABLE public.hackathon_team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff manage hackathon team members" ON public.hackathon_team_members FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'head')) WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'head'));
CREATE UNIQUE INDEX hackathon_team_members_team_email_key ON public.hackathon_team_members(team_id, lower(email));
CREATE UNIQUE INDEX hackathon_team_members_team_usn_key ON public.hackathon_team_members(team_id, lower(usn)) WHERE usn IS NOT NULL AND usn <> '';
CREATE TRIGGER hackathon_team_members_updated_at BEFORE UPDATE ON public.hackathon_team_members FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.hackathon_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL UNIQUE REFERENCES public.hackathon_teams(id) ON DELETE CASCADE,
  problem_statement_id text,
  problem_statement_title text,
  theme text,
  solution_title text,
  solution_summary text,
  repository_url text,
  demo_url text,
  video_url text,
  deck_path text,
  document_paths text[] NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','submitted','under_review','revision_requested','final')),
  submitted_at timestamptz,
  published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE, DELETE ON public.hackathon_submissions TO authenticated;
GRANT SELECT ON public.hackathon_submissions TO anon;
GRANT ALL ON public.hackathon_submissions TO service_role;
ALTER TABLE public.hackathon_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published hackathon submissions are public" ON public.hackathon_submissions FOR SELECT TO anon, authenticated USING (published = true);
CREATE POLICY "Staff manage hackathon submissions" ON public.hackathon_submissions FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'head')) WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'head'));
CREATE TRIGGER hackathon_submissions_updated_at BEFORE UPDATE ON public.hackathon_submissions FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.event_milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  starts_at timestamptz,
  ends_at timestamptz,
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.event_milestones TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.event_milestones TO authenticated;
GRANT ALL ON public.event_milestones TO service_role;
ALTER TABLE public.event_milestones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published event milestones are public" ON public.event_milestones FOR SELECT TO anon, authenticated USING (published = true);
CREATE POLICY "Admins manage event milestones" ON public.event_milestones FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER event_milestones_updated_at BEFORE UPDATE ON public.event_milestones FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.hackathon_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL REFERENCES public.hackathon_teams(id) ON DELETE CASCADE,
  activity_type text NOT NULL,
  summary text NOT NULL,
  metadata jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.hackathon_activities TO authenticated;
GRANT ALL ON public.hackathon_activities TO service_role;
ALTER TABLE public.hackathon_activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff read hackathon activity" ON public.hackathon_activities FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'head'));
CREATE POLICY "Admins manage hackathon activity" ON public.hackathon_activities FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.event_announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  title text NOT NULL,
  body text NOT NULL,
  pinned boolean NOT NULL DEFAULT false,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.event_announcements TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.event_announcements TO authenticated;
GRANT ALL ON public.event_announcements TO service_role;
ALTER TABLE public.event_announcements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published event announcements are public" ON public.event_announcements FOR SELECT TO anon, authenticated USING (published = true);
CREATE POLICY "Admins manage event announcements" ON public.event_announcements FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER event_announcements_updated_at BEFORE UPDATE ON public.event_announcements FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.evaluation_criteria (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  max_score numeric(6,2) NOT NULL DEFAULT 10 CHECK (max_score > 0 AND max_score <= 1000),
  weight numeric(6,3) NOT NULL DEFAULT 1 CHECK (weight > 0 AND weight <= 100),
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.evaluation_criteria TO authenticated;
GRANT ALL ON public.evaluation_criteria TO service_role;
ALTER TABLE public.evaluation_criteria ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage evaluation criteria" ON public.evaluation_criteria FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER evaluation_criteria_updated_at BEFORE UPDATE ON public.evaluation_criteria FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.evaluation_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL REFERENCES public.hackathon_teams(id) ON DELETE CASCADE,
  criterion_id uuid NOT NULL REFERENCES public.evaluation_criteria(id) ON DELETE CASCADE,
  judge_id uuid NOT NULL,
  score numeric(6,2) NOT NULL CHECK (score >= 0),
  feedback text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(team_id, criterion_id, judge_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.evaluation_scores TO authenticated;
GRANT ALL ON public.evaluation_scores TO service_role;
ALTER TABLE public.evaluation_scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage evaluation scores" ON public.evaluation_scores FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER evaluation_scores_updated_at BEFORE UPDATE ON public.evaluation_scores FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.events (slug, title, event_date, start_time, location, tag, description, published, schedule_tba, workspace_kind)
VALUES ('sih-internal-hackathon', 'SIH Internal Hackathon', NULL, NULL, 'To be announced', 'Hackathon', 'Vertex’s internal Smart India Hackathon selection workspace for forming teams, developing problem statements, submitting prototypes, and tracking evaluation.', true, true, 'hackathon')
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, schedule_tba = true, workspace_kind = 'hackathon';

INSERT INTO public.event_workspaces (event_id, registration_open, min_team_size, max_team_size, rules, submissions_open, published)
SELECT id, false, 1, 6, 'Team-size rules, registration dates, and the event schedule will be published after the official announcement.', false, true
FROM public.events WHERE slug = 'sih-internal-hackathon'
ON CONFLICT (event_id) DO NOTHING;