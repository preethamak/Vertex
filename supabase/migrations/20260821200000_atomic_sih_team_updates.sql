-- Keep a team profile and its roster consistent. This is intentionally service-role
-- only: team management remains authenticated by the opaque management key in the
-- application server, not by a public database RPC.
create or replace function public.update_sih_team_and_roster(
  p_team_id uuid,
  p_name text,
  p_college text,
  p_mentor_name text,
  p_mentor_email text,
  p_lead_name text,
  p_lead_email text,
  p_members jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.hackathon_teams
  set name = p_name,
      college = nullif(p_college, ''),
      mentor_name = nullif(p_mentor_name, ''),
      mentor_email = nullif(p_mentor_email, ''),
      lead_name = p_lead_name,
      lead_email = lower(p_lead_email)
  where id = p_team_id;

  if not found then
    raise exception 'Hackathon team not found';
  end if;

  delete from public.hackathon_team_members where team_id = p_team_id;

  insert into public.hackathon_team_members
    (team_id, name, email, gender, phone, usn, branch, year, is_lead)
  select
    p_team_id,
    trim(member.name),
    lower(trim(member.email)),
    member.gender,
    nullif(trim(member.phone), ''),
    nullif(trim(member.usn), ''),
    nullif(trim(member.branch), ''),
    nullif(trim(member.year), ''),
    member.is_lead
  from jsonb_to_recordset(p_members) as member(
    name text,
    email text,
    gender text,
    phone text,
    usn text,
    branch text,
    year text,
    is_lead boolean
  );
end;
$$;

revoke all on function public.update_sih_team_and_roster(uuid, text, text, text, text, text, text, jsonb) from public, anon, authenticated;
grant execute on function public.update_sih_team_and_roster(uuid, text, text, text, text, text, text, jsonb) to service_role;
