-- Reviews are private to event administrators. Existing team registrations are unchanged.
create table public.sarvam_team_reviews (
  registration_id uuid not null references public.event_registrations(id) on delete cascade,
  reviewer_id uuid not null references auth.users(id) on delete cascade,
  innovation smallint not null check (innovation between 1 and 5),
  relevance smallint not null check (relevance between 1 and 5),
  feasibility smallint not null check (feasibility between 1 and 5),
  technology smallint not null check (technology between 1 and 5),
  impact smallint not null check (impact between 1 and 5),
  notes text not null default '' check (char_length(notes) <= 2000),
  updated_at timestamptz not null default now(),
  primary key (registration_id, reviewer_id)
);
alter table public.sarvam_team_reviews enable row level security;
revoke all on public.sarvam_team_reviews from anon, authenticated;
grant select, insert, update on public.sarvam_team_reviews to authenticated;
create policy "Sarvam reviews admin select" on public.sarvam_team_reviews for select to authenticated
  using (public.has_role((select auth.uid()), 'admin'));
create policy "Sarvam reviews admin insert" on public.sarvam_team_reviews for insert to authenticated
  with check (public.has_role((select auth.uid()), 'admin') and reviewer_id = (select auth.uid()));
create policy "Sarvam reviews admin update own" on public.sarvam_team_reviews for update to authenticated
  using (public.has_role((select auth.uid()), 'admin') and reviewer_id = (select auth.uid()))
  with check (public.has_role((select auth.uid()), 'admin') and reviewer_id = (select auth.uid()));
