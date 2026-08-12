-- ROLES ------------------------------------------------------------------
CREATE TYPE public.app_role AS ENUM ('admin', 'head', 'member');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE POLICY "Users read own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage roles" ON public.user_roles
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- TEAMS -------------------------------------------------------------------
CREATE TABLE public.teams (
  id text PRIMARY KEY,
  name text NOT NULL,
  code text NOT NULL,
  blurb text,
  sort_order int NOT NULL DEFAULT 0
);
GRANT SELECT ON public.teams TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.teams TO authenticated;
GRANT ALL ON public.teams TO service_role;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Teams are public" ON public.teams FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage teams" ON public.teams FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- MEMBERS -----------------------------------------------------------------
CREATE TABLE public.members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL,
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  role text NOT NULL DEFAULT 'Member',
  team_id text REFERENCES public.teams(id) ON DELETE SET NULL,
  is_head boolean NOT NULL DEFAULT false,
  is_leadership boolean NOT NULL DEFAULT false,
  photo_url text,
  bio text,
  skills text[] NOT NULL DEFAULT '{}',
  links jsonb NOT NULL DEFAULT '{}'::jsonb,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.members TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.members TO authenticated;
GRANT ALL ON public.members TO service_role;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members are public" ON public.members FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Members update own profile" ON public.members FOR UPDATE TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins manage members" ON public.members FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER members_updated_at BEFORE UPDATE ON public.members
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.is_head_of(_user_id uuid, _team_id text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.members
    WHERE user_id = _user_id AND is_head = true AND team_id = _team_id
  );
$$;

-- EVENTS ------------------------------------------------------------------
CREATE TABLE public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  event_date date NOT NULL,
  start_time text,
  location text NOT NULL DEFAULT 'TBA',
  tag text NOT NULL DEFAULT 'Event',
  description text,
  cover_url text,
  capacity int,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.events TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.events TO authenticated;
GRANT ALL ON public.events TO service_role;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published events are public" ON public.events FOR SELECT TO anon, authenticated USING (published = true);
CREATE POLICY "Admins read all events" ON public.events FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage events" ON public.events FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER events_updated_at BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.event_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  usn text,
  code text NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(9), 'hex'),
  checked_in_at timestamptz,
  checked_in_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.event_registrations TO authenticated;
GRANT ALL ON public.event_registrations TO service_role;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff manage registrations" ON public.event_registrations FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'head'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'head'));

-- APPLICATIONS ------------------------------------------------------------
CREATE TABLE public.applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  usn text,
  year text,
  branch text,
  email text NOT NULL,
  phone text,
  team_first text REFERENCES public.teams(id) ON DELETE SET NULL,
  team_second text REFERENCES public.teams(id) ON DELETE SET NULL,
  why text,
  links text,
  status text NOT NULL DEFAULT 'new',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.applications TO authenticated;
GRANT ALL ON public.applications TO service_role;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff read applications" ON public.applications FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin')
         OR public.is_head_of(auth.uid(), team_first)
         OR public.is_head_of(auth.uid(), team_second));
CREATE POLICY "Admins manage applications" ON public.applications FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Heads update their applications" ON public.applications FOR UPDATE TO authenticated
  USING (public.is_head_of(auth.uid(), team_first) OR public.is_head_of(auth.uid(), team_second))
  WITH CHECK (public.is_head_of(auth.uid(), team_first) OR public.is_head_of(auth.uid(), team_second));
CREATE TRIGGER applications_updated_at BEFORE UPDATE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- PROJECTS ----------------------------------------------------------------
CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  description text,
  tech text[] NOT NULL DEFAULT '{}',
  cover_url text,
  link text,
  year int,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.projects TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.projects TO authenticated;
GRANT ALL ON public.projects TO service_role;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published projects are public" ON public.projects FOR SELECT TO anon, authenticated USING (published = true);
CREATE POLICY "Admins manage projects" ON public.projects FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.project_contributors (
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  member_id uuid NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, member_id)
);
GRANT SELECT ON public.project_contributors TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.project_contributors TO authenticated;
GRANT ALL ON public.project_contributors TO service_role;
ALTER TABLE public.project_contributors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Contributors are public" ON public.project_contributors FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage contributors" ON public.project_contributors FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ACHIEVEMENTS ------------------------------------------------------------
CREATE TABLE public.achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  happened_on date NOT NULL DEFAULT current_date,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.achievements TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.achievements TO authenticated;
GRANT ALL ON public.achievements TO service_role;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Achievements are public" ON public.achievements FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage achievements" ON public.achievements FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- STORAGE POLICIES --------------------------------------------------------
CREATE POLICY "Signed in users read media" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'media');
CREATE POLICY "Signed in users upload media" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'media');
CREATE POLICY "Owners update media" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'media' AND (owner = auth.uid() OR public.has_role(auth.uid(), 'admin')));
CREATE POLICY "Owners delete media" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'media' AND (owner = auth.uid() OR public.has_role(auth.uid(), 'admin')));

-- SEED --------------------------------------------------------------------
INSERT INTO public.teams (id, name, code, blurb, sort_order) VALUES
  ('events', 'Event Management', 'EVT', 'Plans, schedules, and runs everything Vertex puts on.', 1),
  ('media', 'Media', 'MED', 'Photo, video, design, and everything that makes Vertex look like Vertex.', 2),
  ('pr', 'PR & Marketing', 'PRM', 'Owns the voice of the club across campus and online.', 3),
  ('tech', 'Technical', 'TCH', 'Builds, ships, and breaks things. Workshops, tools, and projects.', 4),
  ('sponsorship', 'Sponsorship', 'SPN', 'Brings in partners, budgets, and industry relationships.', 5);

INSERT INTO public.members (slug, name, role, team_id, is_head, is_leadership, bio, sort_order) VALUES
  ('preetham-ak', 'Preetham AK', 'Founder', NULL, false, true, 'Founded Vertex in 2026 with the vision of a college technical club built by teams, not titles.', 1),
  ('pavan-achar', 'Pavan Achar', 'President', NULL, false, true, 'Leads Vertex operations, strategy, and the people who make everything move.', 2),
  ('madan-kumar', 'Madan Kumar', 'Vice President', NULL, false, true, 'Backs up leadership, coordinates teams, keeps the club running end-to-end.', 3),
  ('parinitha-n', 'Parinitha N', 'Team Head', 'events', true, false, NULL, 1),
  ('pawan-kumar', 'Pawan Kumar', 'Member', 'events', false, false, NULL, 2),
  ('sai-brundha', 'Sai Brundha', 'Member', 'events', false, false, NULL, 3),
  ('raghuveer-singh', 'Raghuveer Singh', 'Member', 'events', false, false, NULL, 4),
  ('namratha-n-raju', 'Namratha N. Raju', 'Member', 'events', false, false, NULL, 5),
  ('rahul-ne', 'Rahul NE', 'Team Head', 'media', true, false, NULL, 1),
  ('raagib-qadri', 'Raagib Qadri', 'Member', 'media', false, false, NULL, 2),
  ('raghava', 'Raghava', 'Member', 'media', false, false, NULL, 3),
  ('vedashree-r', 'Vedashree R.', 'Member', 'media', false, false, NULL, 4),
  ('chaithali-k-k', 'Chaithali K. K.', 'Member', 'media', false, false, NULL, 5),
  ('niveditha', 'Niveditha', 'Member', 'media', false, false, NULL, 6),
  ('nagendra-mahesha', 'Nagendra Mahesha', 'Team Head', 'pr', true, false, NULL, 1),
  ('jeevith', 'Jeevith', 'Member', 'pr', false, false, NULL, 2),
  ('k-b-janavi', 'K. B. Janavi', 'Member', 'pr', false, false, NULL, 3),
  ('chandana-s', 'Chandana S.', 'Member', 'pr', false, false, NULL, 4),
  ('thanaya-s', 'Thanaya S.', 'Member', 'pr', false, false, NULL, 5),
  ('akash-gouda', 'Akash Gouda', 'Team Head', 'tech', true, false, NULL, 1),
  ('shivam', 'Shivam', 'Member', 'tech', false, false, NULL, 2),
  ('mohammed-tasowuff', 'Mohammed Tasowuff', 'Member', 'tech', false, false, NULL, 3),
  ('shalini-m', 'Shalini M.', 'Member', 'tech', false, false, NULL, 4),
  ('dhruthi-c', 'Dhruthi C.', 'Member', 'tech', false, false, NULL, 5),
  ('chinmayi-k-c', 'Chinmayi K. C.', 'Member', 'tech', false, false, NULL, 6),
  ('sindhuja', 'Sindhuja', 'Team Head', 'sponsorship', true, false, NULL, 1),
  ('rithika', 'Rithika', 'Member', 'sponsorship', false, false, NULL, 2),
  ('navya-k', 'Navya K.', 'Member', 'sponsorship', false, false, NULL, 3),
  ('s-n-jeevan', 'S. N. Jeevan', 'Member', 'sponsorship', false, false, NULL, 4),
  ('ashish-jayaprakash', 'Ashish Jayaprakash', 'Member', 'sponsorship', false, false, NULL, 5);

INSERT INTO public.events (slug, title, event_date, location, tag, description, published) VALUES
  ('vertex-launch', 'Vertex Launch Night', '2026-03-14', 'Main Auditorium', 'Launch', 'The official kickoff of Vertex. Team introductions, keynote from the founders, and the first-ever tech showcase.', true),
  ('hack-vertex', 'Hack Vertex 01', '2026-04-19', 'Tech Block, Level 3', 'Hackathon', '24-hour build weekend. Bring an idea, leave with a shipped project. Mentors from every Vertex team on the floor.', true),
  ('design-jam', 'Design x Code Jam', '2026-05-10', 'Studio 2', 'Workshop', 'Media and Technical teams team up for a live design-to-code jam. Build a real interface in a single afternoon.', true),
  ('sponsor-mixer', 'Industry Mixer', '2026-06-07', 'Rooftop Lounge', 'Networking', 'Sponsorship team hosts partners, alumni, and recruiters. Members demo projects, share cards, make moves.', true);

INSERT INTO public.achievements (title, description, happened_on) VALUES
  ('Vertex founded', 'The club is formed with five teams and a founding leadership of three.', '2026-01-15'),
  ('First 30 members onboarded', 'Full roster assembled across Technical, Media, Events, PR, and Sponsorship.', '2026-02-01');
