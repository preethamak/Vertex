-- Invite-based SIH team registration.
-- The team lead registers alone and receives a join code; teammates join themselves
-- until the official SIH team size is reached. All writes stay atomic in the database.

ALTER TABLE public.hackathon_teams
  ADD COLUMN IF NOT EXISTS join_code text;

-- Human-friendly, unambiguous join codes (no 0/O/1/I).
CREATE OR REPLACE FUNCTION public.make_sih_join_code()
RETURNS text
LANGUAGE sql
VOLATILE
AS $$
  SELECT string_agg(
    (ARRAY['2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','J','K','L','M','N','P','Q','R','S','T','V','W','X','Y','Z'])[1 + (ascii(c) % 31)],
    ''
  )
  FROM regexp_split_to_table(substring(md5(gen_random_uuid()::text || clock_timestamp()::text), 1, 8), '') AS c;
$$;

UPDATE public.hackathon_teams
SET join_code = public.make_sih_join_code()
WHERE join_code IS NULL;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'hackathon_teams_join_code_key') THEN
    ALTER TABLE public.hackathon_teams
      ALTER COLUMN join_code SET NOT NULL,
      ADD CONSTRAINT hackathon_teams_join_code_key UNIQUE (join_code);
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS hackathon_teams_event_join_code_idx
  ON public.hackathon_teams(event_id, join_code);

-- Atomic team creation: team row + lead member + empty submission + activity log.
CREATE OR REPLACE FUNCTION public.create_sih_team(
  p_event_id uuid,
  p_name text,
  p_lead_name text,
  p_lead_email text,
  p_lead_gender text,
  p_lead_phone text,
  p_lead_srn text,
  p_lead_branch text,
  p_lead_year text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_registration_open boolean;
  v_team_id uuid;
  v_join_code text;
  v_management_token text;
  v_checkin_token text;
BEGIN
  SELECT registration_open INTO v_registration_open
  FROM public.event_workspaces
  WHERE event_id = p_event_id;
  IF v_registration_open IS DISTINCT FROM true THEN
    RAISE EXCEPTION 'Registration is closed right now.';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.hackathon_teams
    WHERE event_id = p_event_id AND lower(name) = lower(btrim(p_name))
  ) THEN
    RAISE EXCEPTION 'A team with that name is already registered.';
  END IF;

  v_management_token := replace(gen_random_uuid()::text, '-', '');
  v_checkin_token := replace(gen_random_uuid()::text, '-', '');

  INSERT INTO public.hackathon_teams (
    event_id, name, lead_name, lead_email, lead_phone,
    management_token_hash, checkin_token_hash, join_code
  ) VALUES (
    p_event_id,
    btrim(p_name),
    btrim(p_lead_name),
    lower(btrim(p_lead_email)),
    nullif(btrim(p_lead_phone), ''),
    encode(sha256(('vertex:' || v_management_token)::bytea), 'hex'),
    encode(sha256(('vertex:checkin:' || v_checkin_token)::bytea), 'hex'),
    public.make_sih_join_code()
  )
  RETURNING id, join_code INTO v_team_id, v_join_code;

  INSERT INTO public.hackathon_team_members (
    team_id, name, email, gender, phone, usn, branch, year, is_lead
  ) VALUES (
    v_team_id,
    btrim(p_lead_name),
    lower(btrim(p_lead_email)),
    p_lead_gender,
    nullif(btrim(p_lead_phone), ''),
    nullif(btrim(p_lead_srn), ''),
    nullif(btrim(p_lead_branch), ''),
    nullif(btrim(p_lead_year), ''),
    true
  );

  INSERT INTO public.hackathon_submissions (team_id) VALUES (v_team_id);

  INSERT INTO public.hackathon_activities (team_id, activity_type, summary)
  VALUES (v_team_id, 'registered', btrim(p_name) || ' registered. Invites are open for the rest of the roster.');

  RETURN jsonb_build_object(
    'team_id', v_team_id,
    'join_code', v_join_code,
    'management_token', v_management_token,
    'checkin_token', v_checkin_token
  );
END;
$$;

-- Atomic teammate join: validates capacity, duplicates, and SIH eligibility.
CREATE OR REPLACE FUNCTION public.join_sih_team(
  p_event_id uuid,
  p_join_code text,
  p_member jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_registration_open boolean;
  v_team public.hackathon_teams;
  v_submission_final timestamptz;
  v_count integer;
  v_has_female boolean;
  v_gender text;
  v_email text;
  v_srn text;
BEGIN
  SELECT registration_open INTO v_registration_open
  FROM public.event_workspaces
  WHERE event_id = p_event_id;
  IF v_registration_open IS DISTINCT FROM true THEN
    RAISE EXCEPTION 'Registration is closed right now.';
  END IF;

  SELECT * INTO v_team
  FROM public.hackathon_teams
  WHERE event_id = p_event_id AND join_code = upper(btrim(p_join_code));
  IF NOT FOUND THEN
    RAISE EXCEPTION 'That join code does not match any team.';
  END IF;

  SELECT finalized_at INTO v_submission_final
  FROM public.hackathon_submissions
  WHERE team_id = v_team.id;
  IF v_submission_final IS NOT NULL THEN
    RAISE EXCEPTION 'This team already submitted and its roster is locked.';
  END IF;

  SELECT count(*), bool_or(gender = 'female') INTO v_count, v_has_female
  FROM public.hackathon_team_members
  WHERE team_id = v_team.id;

  IF v_count >= 6 THEN
    RAISE EXCEPTION 'This team already has all 6 members.';
  END IF;

  v_email := lower(btrim(p_member->>'email'));
  v_srn := nullif(lower(btrim(coalesce(p_member->>'srn', ''))), '');
  v_gender := coalesce(p_member->>'gender', 'prefer_not_to_say');

  IF EXISTS (SELECT 1 FROM public.hackathon_team_members WHERE team_id = v_team.id AND email = v_email) THEN
    RAISE EXCEPTION 'That email is already on this team.';
  END IF;

  IF v_srn IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.hackathon_team_members WHERE team_id = v_team.id AND lower(usn) = v_srn
  ) THEN
    RAISE EXCEPTION 'That SRN is already on this team.';
  END IF;

  -- SIH 2026: a complete team must include at least one female student.
  IF v_count + 1 = 6 AND v_gender <> 'female' AND v_has_female IS NOT TRUE THEN
    RAISE EXCEPTION 'SIH 2026 requires each team to include at least one female student. This roster needs one before it can be completed.';
  END IF;

  INSERT INTO public.hackathon_team_members (
    team_id, name, email, gender, phone, usn, branch, year, is_lead
  ) VALUES (
    v_team.id,
    btrim(p_member->>'name'),
    v_email,
    v_gender,
    nullif(btrim(coalesce(p_member->>'phone', '')), ''),
    nullif(btrim(coalesce(p_member->>'srn', '')), ''),
    nullif(btrim(coalesce(p_member->>'branch', '')), ''),
    nullif(btrim(coalesce(p_member->>'year', '')), ''),
    false
  );

  INSERT INTO public.hackathon_activities (team_id, activity_type, summary)
  VALUES (
    v_team.id,
    'member_joined',
    btrim(p_member->>'name') || ' joined via invite (' || (v_count + 1) || '/6).'
  );

  RETURN jsonb_build_object('team_name', v_team.name, 'member_count', v_count + 1);
END;
$$;

-- Lead can invalidate a leaked invite link and get a fresh code.
CREATE OR REPLACE FUNCTION public.rotate_sih_join_code(p_management_token text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_team_id uuid;
  v_new_code text;
  v_submission_final timestamptz;
BEGIN
  SELECT id INTO v_team_id
  FROM public.hackathon_teams
  WHERE management_token_hash = encode(sha256(('vertex:' || p_management_token)::bytea), 'hex');
  IF NOT FOUND THEN
    RAISE EXCEPTION 'That team key is not valid.';
  END IF;

  SELECT finalized_at INTO v_submission_final FROM public.hackathon_submissions WHERE team_id = v_team_id;
  IF v_submission_final IS NOT NULL THEN
    RAISE EXCEPTION 'This team already submitted and its roster is locked.';
  END IF;

  UPDATE public.hackathon_teams
  SET join_code = public.make_sih_join_code()
  WHERE id = v_team_id
  RETURNING join_code INTO v_new_code;

  RETURN v_new_code;
END;
$$;

REVOKE ALL ON FUNCTION public.create_sih_team(uuid, text, text, text, text, text, text, text, text) FROM public, anon, authenticated;
REVOKE ALL ON FUNCTION public.join_sih_team(uuid, text, jsonb) FROM public, anon, authenticated;
REVOKE ALL ON FUNCTION public.rotate_sih_join_code(text) FROM public, anon, authenticated;
REVOKE ALL ON FUNCTION public.make_sih_join_code() FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.create_sih_team(uuid, text, text, text, text, text, text, text, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.join_sih_team(uuid, text, jsonb) TO service_role;
GRANT EXECUTE ON FUNCTION public.rotate_sih_join_code(text) TO service_role;
GRANT EXECUTE ON FUNCTION public.make_sih_join_code() TO service_role;
