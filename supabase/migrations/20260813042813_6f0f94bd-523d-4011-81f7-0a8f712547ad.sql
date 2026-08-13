-- prevent duplicates
CREATE UNIQUE INDEX IF NOT EXISTS events_slug_key ON public.events (slug);
CREATE UNIQUE INDEX IF NOT EXISTS events_title_date_key ON public.events (lower(title), event_date);
CREATE UNIQUE INDEX IF NOT EXISTS projects_slug_key ON public.projects (slug);
CREATE UNIQUE INDEX IF NOT EXISTS members_slug_key ON public.members (slug);
CREATE UNIQUE INDEX IF NOT EXISTS event_registrations_event_email_key ON public.event_registrations (event_id, lower(email));

-- achievements can belong to a member
ALTER TABLE public.achievements ADD COLUMN IF NOT EXISTS member_id uuid REFERENCES public.members(id) ON DELETE CASCADE;

-- announcements
CREATE TABLE IF NOT EXISTS public.announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text NOT NULL,
  team_id text REFERENCES public.teams(id) ON DELETE SET NULL,
  author_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  pinned boolean NOT NULL DEFAULT false,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.announcements TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.announcements TO authenticated;
GRANT ALL ON public.announcements TO service_role;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published announcements are public" ON public.announcements FOR SELECT TO anon, authenticated USING (published = true);
CREATE POLICY "Admins manage announcements" ON public.announcements FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Heads manage team announcements" ON public.announcements FOR ALL TO authenticated USING (team_id IS NOT NULL AND is_head_of(auth.uid(), team_id)) WITH CHECK (team_id IS NOT NULL AND is_head_of(auth.uid(), team_id));
CREATE TRIGGER announcements_updated_at BEFORE UPDATE ON public.announcements FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- badges
CREATE TABLE IF NOT EXISTS public.badges (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text,
  icon text NOT NULL DEFAULT 'award',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.badges TO anon;
GRANT SELECT ON public.badges TO authenticated;
GRANT ALL ON public.badges TO service_role;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Badges are public" ON public.badges FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage badges" ON public.badges FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TABLE IF NOT EXISTS public.member_badges (
  member_id uuid NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
  badge_id text NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  note text,
  awarded_on date NOT NULL DEFAULT CURRENT_DATE,
  PRIMARY KEY (member_id, badge_id)
);
GRANT SELECT ON public.member_badges TO anon;
GRANT SELECT ON public.member_badges TO authenticated;
GRANT ALL ON public.member_badges TO service_role;
ALTER TABLE public.member_badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Member badges are public" ON public.member_badges FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage member badges" ON public.member_badges FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

INSERT INTO public.badges (id, name, description, icon) VALUES
  ('founder', 'Founder', 'Part of the founding crew of Vertex', 'flag'),
  ('team-head', 'Team Head', 'Leads a Vertex team', 'shield'),
  ('hackathon-win', 'Hackathon Winner', 'Won a hackathon representing Vertex', 'trophy'),
  ('shipper', 'Shipper', 'Shipped a project featured in the showcase', 'rocket'),
  ('regular', 'Regular', 'Checked in to five or more club events', 'calendar'),
  ('mentor', 'Mentor', 'Actively mentors other members', 'compass')
ON CONFLICT (id) DO NOTHING;

-- mentorship
CREATE TABLE IF NOT EXISTS public.mentorship_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mentee_id uuid NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
  mentor_id uuid NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
  topic text NOT NULL,
  message text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.mentorship_requests TO authenticated;
GRANT ALL ON public.mentorship_requests TO service_role;
ALTER TABLE public.mentorship_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Participants read mentorship requests" ON public.mentorship_requests FOR SELECT TO authenticated USING (
  has_role(auth.uid(), 'admin'::app_role)
  OR EXISTS (SELECT 1 FROM public.members m WHERE m.user_id = auth.uid() AND (m.id = mentee_id OR m.id = mentor_id))
);
CREATE POLICY "Members create mentorship requests" ON public.mentorship_requests FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.members m WHERE m.user_id = auth.uid() AND m.id = mentee_id)
);
CREATE POLICY "Participants update mentorship requests" ON public.mentorship_requests FOR UPDATE TO authenticated USING (
  has_role(auth.uid(), 'admin'::app_role)
  OR EXISTS (SELECT 1 FROM public.members m WHERE m.user_id = auth.uid() AND (m.id = mentee_id OR m.id = mentor_id))
) WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role)
  OR EXISTS (SELECT 1 FROM public.members m WHERE m.user_id = auth.uid() AND (m.id = mentee_id OR m.id = mentor_id))
);
CREATE TRIGGER mentorship_requests_updated_at BEFORE UPDATE ON public.mentorship_requests FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- storage policies for the private media bucket
CREATE POLICY "Staff read media" ON storage.objects FOR SELECT TO authenticated USING (
  bucket_id = 'media' AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'head'::app_role) OR has_role(auth.uid(), 'member'::app_role))
);
CREATE POLICY "Staff upload media" ON storage.objects FOR INSERT TO authenticated WITH CHECK (
  bucket_id = 'media' AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'head'::app_role) OR has_role(auth.uid(), 'member'::app_role))
);
CREATE POLICY "Staff update media" ON storage.objects FOR UPDATE TO authenticated USING (
  bucket_id = 'media' AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'head'::app_role))
);
CREATE POLICY "Admins delete media" ON storage.objects FOR DELETE TO authenticated USING (
  bucket_id = 'media' AND has_role(auth.uid(), 'admin'::app_role)
);