-- Staff-recorded progress. Participant statements are not credit verification.
create table public.sarvam_participant_progress (
  registration_id uuid not null references public.event_registrations(id) on delete cascade,
  member_index smallint not null check (member_index between 0 and 3),
  credit_status text not null default 'not_started' check (credit_status in ('not_started', 'reported_registered', 'sent_to_sarvam', 'credit_confirmed', 'needs_help')),
  group_reported boolean not null default false,
  updated_by uuid references auth.users(id),
  updated_at timestamptz not null default now(),
  primary key (registration_id, member_index)
);
alter table public.sarvam_participant_progress enable row level security;
revoke all on public.sarvam_participant_progress from anon, authenticated;
grant select, insert, update on public.sarvam_participant_progress to authenticated;
create policy "Sarvam progress admin select" on public.sarvam_participant_progress for select to authenticated using (public.has_role((select auth.uid()), 'admin'));
create policy "Sarvam progress admin insert" on public.sarvam_participant_progress for insert to authenticated with check (public.has_role((select auth.uid()), 'admin') and updated_by = (select auth.uid()));
create policy "Sarvam progress admin update" on public.sarvam_participant_progress for update to authenticated using (public.has_role((select auth.uid()), 'admin')) with check (public.has_role((select auth.uid()), 'admin') and updated_by = (select auth.uid()));
