-- Private gateway ledger. Values are integer millionths of a credit.
create table public.sarvam_gateway_teams (
  registration_id uuid primary key references public.event_registrations(id),
  key_hash text not null unique,
  key_prefix text not null,
  allowance bigint not null default 500000000 check (allowance >= 0),
  spent bigint not null default 0 check (spent >= 0 and spent <= allowance),
  active boolean not null default true,
  created_at timestamptz not null default now()
);
create table public.sarvam_gateway_requests (
  id uuid primary key default gen_random_uuid(),
  registration_id uuid not null references public.sarvam_gateway_teams(registration_id),
  reserved bigint not null check (reserved > 0),
  status text not null default 'reserved' check (status in ('reserved','completed','upstream_error')),
  created_at timestamptz not null default now()
);
alter table public.sarvam_gateway_teams enable row level security;
alter table public.sarvam_gateway_requests enable row level security;
revoke all on public.sarvam_gateway_teams, public.sarvam_gateway_requests from anon, authenticated;

-- Row locking via the single UPDATE prevents simultaneous calls overspending.
create function public.reserve_sarvam_gateway(p_hash text, p_amount bigint)
returns uuid language plpgsql security invoker set search_path = '' as $$
declare team_id uuid; request_id uuid;
begin
  if p_amount <= 0 or p_amount > 100000000 then return null; end if;
  update public.sarvam_gateway_teams t set spent = t.spent + p_amount
   from public.event_registrations r, public.events e
   where t.key_hash = p_hash and t.active and t.registration_id = r.id
     and r.event_id = e.id and e.slug = 'build-with-sarvam' and r.status = 'approved'
     and t.spent + p_amount <= t.allowance
   returning t.registration_id into team_id;
  if team_id is null then return null; end if;
  insert into public.sarvam_gateway_requests(registration_id, reserved)
    values(team_id, p_amount) returning id into request_id;
  return request_id;
end $$;
revoke all on function public.reserve_sarvam_gateway(text,bigint) from public, anon, authenticated;
grant execute on function public.reserve_sarvam_gateway(text,bigint) to service_role;
