-- SIH lifecycle overhaul: teammate self-service, key recovery, submission
-- review workflow, judging, and mentor assignment.

-- ============================================================
-- 1. Teammate self-service: each joined member gets an opaque token
-- ============================================================
ALTER TABLE public.hackathon_team_members
  ADD COLUMN IF NOT EXISTS member_token_hash text UNIQUE;

-- ============================================================
-- 2. join_sih_team v2: also returns a personal member token
-- ============================================================
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
  v_member_token text;
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

  IF v_count + 1 = 6 AND v_gender <> 'female' AND v_has_female IS NOT TRUE THEN
    RAISE EXCEPTION 'SIH 2026 requires each team to include at least one female student. This roster needs one before it can be completed.';
  END IF;

  v_member_token := replace(gen_random_uuid()::text, '-', '');

  INSERT INTO public.hackathon_team_members (
    team_id, name, email, gender, phone, usn, branch, year, is_lead, member_token_hash
  ) VALUES (
    v_team.id,
    btrim(p_member->>'name'),
    v_email,
    v_gender,
    nullif(btrim(coalesce(p_member->>'phone', '')), ''),
    nullif(btrim(coalesce(p_member->>'srn', '')), ''),
    nullif(btrim(coalesce(p_member->>'branch', '')), ''),
    nullif(btrim(coalesce(p_member->>'year', '')), ''),
    false,
    encode(sha256(('vertex:member:' || v_member_token)::bytea), 'hex')
  );

  INSERT INTO public.hackathon_activities (team_id, activity_type, summary)
  VALUES (
    v_team.id,
    'member_joined',
    btrim(p_member->>'name') || ' joined via invite (' || (v_count + 1) || '/6).'
  );

  RETURN jsonb_build_object(
    'team_name', v_team.name,
    'member_count', v_count + 1,
    'member_token', v_member_token
  );
END;
$$;

-- ============================================================
-- 3. Teammate self-service RPCs
-- ============================================================

-- A teammate edits their own entry (everything except email/team).
CREATE OR REPLACE FUNCTION public.update_sih_member_own(
  p_member_token text,
  p_member jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_member_id uuid;
  v_finalized timestamptz;
  v_srn text;
BEGIN
  SELECT id INTO v_member_id
  FROM public.hackathon_team_members
  WHERE member_token_hash = encode(sha256(('vertex:member:' || p_member_token)::bytea), 'hex');
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Member key is not valid.';
  END IF;

  SELECT finalized_at INTO v_finalized
  FROM public.hackathon_submissions s
  JOIN public.hackathon_team_members m ON m.team_id = s.team_id
  WHERE m.id = v_member_id;
  IF v_finalized IS NOT NULL THEN
    RAISE EXCEPTION 'This team already submitted and its roster is locked.';
  END IF;

  v_srn := nullif(btrim(coalesce(p_member->>'srn', '')), '');

  UPDATE public.hackathon_team_members
  SET name = coalesce(nullif(btrim(p_member->>'name'), ''), name),
      gender = coalesce(p_member->>'gender', gender),
      phone = nullif(btrim(coalesce(p_member->>'phone', '')), ''),
      usn = v_srn,
      branch = nullif(btrim(coalesce(p_member->>'branch', '')), ''),
      year = nullif(btrim(coalesce(p_member->>'year', '')), '')
  WHERE id = v_member_id;

  IF v_srn IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.hackathon_team_members
    WHERE team_id = (SELECT team_id FROM public.hackathon_team_members WHERE id = v_member_id)
      AND id <> v_member_id
      AND lower(usn) = v_srn
  ) THEN
    RAISE EXCEPTION 'That SRN is already on this team.';
  END IF;
END;
$$;

-- A teammate leaves voluntarily (blocked for the lead and after final submit).
CREATE OR REPLACE FUNCTION public.leave_sih_team(p_member_token text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_member public.hackathon_team_members;
  v_finalized timestamptz;
BEGIN
  SELECT * INTO v_member
  FROM public.hackathon_team_members
  WHERE member_token_hash = encode(sha256(('vertex:member:' || p_member_token)::bytea), 'hex');
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Member key is not valid.';
  END IF;

  IF v_member.is_lead THEN
    RAISE EXCEPTION 'The team lead cannot leave. Ask an administrator instead.';
  END IF;

  SELECT finalized_at INTO v_finalized
  FROM public.hackathon_submissions
  WHERE team_id = v_member.team_id;
  IF v_finalized IS NOT NULL THEN
    RAISE EXCEPTION 'This team already submitted and its roster is locked.';
  END IF;

  DELETE FROM public.hackathon_team_members WHERE id = v_member.id;

  INSERT INTO public.hackathon_activities (team_id, activity_type, summary)
  VALUES (v_member.team_id, 'member_left', v_member.name || ' left the team.');
END;
$$;

-- ============================================================
-- 4. Key recovery + submission review (staff, via service role)
-- ============================================================

-- Admin re-issues the private team key for a lead who lost theirs.
CREATE OR REPLACE FUNCTION public.reissue_sih_management_token(p_team_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_token text;
BEGIN
  v_token := replace(gen_random_uuid()::text, '-', '');
  UPDATE public.hackathon_teams
  SET management_token_hash = encode(sha256(('vertex:' || v_token)::bytea), 'hex')
  WHERE id = p_team_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Team not found.';
  END IF;
  RETURN v_token;
END;
$$;

-- Admin reopens a finalized submission for edits.
CREATE OR REPLACE FUNCTION public.reopen_sih_submission(p_team_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.hackathon_submissions
  SET finalized_at = NULL,
      finalized_by_token_hash = NULL,
      status = 'draft',
      submitted_at = NULL,
      reopened_at = now()
  WHERE team_id = p_team_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Submission not found.';
  END IF;

  INSERT INTO public.hackathon_activities (team_id, activity_type, summary)
  VALUES (p_team_id, 'submission_reopened', 'Submission reopened by the SIH desk.');
END;
$$;

-- Admin publishes a final submission to the public showcase.
CREATE OR REPLACE FUNCTION public.set_sih_showcase(p_team_id uuid, p_published boolean)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.hackathon_submissions
  SET published = p_published
  WHERE team_id = p_team_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Submission not found.';
  END IF;
END;
$$;

-- Admin assigns/updates the team mentor.
CREATE OR REPLACE FUNCTION public.assign_sih_mentor(
  p_team_id uuid,
  p_mentor_name text,
  p_mentor_email text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.hackathon_teams
  SET mentor_name = nullif(btrim(p_mentor_name), ''),
      mentor_email = nullif(lower(btrim(p_mentor_email)), '')
  WHERE id = p_team_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Team not found.';
  END IF;
END;
$$;

-- ============================================================
-- 5. Judging
-- ============================================================

-- Scored, weighted criteria for the SIH event (seeded once, admin-editable).
DO $seed$
DECLARE event uuid;
BEGIN
  SELECT id INTO event FROM public.events WHERE slug = 'sih-internal-hackathon';
  IF event IS NOT NULL THEN
    INSERT INTO public.evaluation_criteria (event_id, name, description, max_score, weight, sort_order)
    VALUES
      (event, 'Innovation & Originality', 'Novelty of the approach and idea.', 10, 1.5, 1),
      (event, 'Technical Feasibility', 'Does the build actually work and scale?', 10, 1.25, 2),
      (event, 'Impact & Benefits', 'Real-world value for the stated problem.', 10, 1.25, 3),
      (event, 'User Experience & Design', 'Clarity, usability, and craft of the solution.', 10, 1.0, 4),
      (event, 'Presentation & Pitch', 'Deck, demo, and delivery.', 10, 1.0, 5)
    ON CONFLICT DO NOTHING;
  END IF;
END
$seed$;

-- Upsert one judge's score for one criterion, bounded by the criterion max.
CREATE OR REPLACE FUNCTION public.upsert_evaluation_score(
  p_team_id uuid,
  p_criterion_id uuid,
  p_judge_id uuid,
  p_score numeric,
  p_feedback text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_max numeric;
BEGIN
  SELECT max_score INTO v_max FROM public.evaluation_criteria WHERE id = p_criterion_id;
  IF v_max IS NULL THEN
    RAISE EXCEPTION 'Unknown criterion.';
  END IF;
  IF p_score < 0 OR p_score > v_max THEN
    RAISE EXCEPTION 'Score must be between 0 and %.', v_max;
  END IF;

  INSERT INTO public.evaluation_scores (team_id, criterion_id, judge_id, score, feedback)
  VALUES (p_team_id, p_criterion_id, p_judge_id, p_score, nullif(btrim(coalesce(p_feedback, '')), ''))
  ON CONFLICT (team_id, criterion_id, judge_id)
  DO UPDATE SET score = EXCLUDED.score, feedback = EXCLUDED.feedback, updated_at = now();
END;
$$;

REVOKE ALL ON FUNCTION public.update_sih_member_own(text, jsonb) FROM public, anon, authenticated;
REVOKE ALL ON FUNCTION public.leave_sih_team(text) FROM public, anon, authenticated;
REVOKE ALL ON FUNCTION public.reissue_sih_management_token(uuid) FROM public, anon, authenticated;
REVOKE ALL ON FUNCTION public.reopen_sih_submission(uuid) FROM public, anon, authenticated;
REVOKE ALL ON FUNCTION public.set_sih_showcase(uuid, boolean) FROM public, anon, authenticated;
REVOKE ALL ON FUNCTION public.assign_sih_mentor(uuid, text, text) FROM public, anon, authenticated;
REVOKE ALL ON FUNCTION public.upsert_evaluation_score(uuid, uuid, uuid, numeric, text) FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.update_sih_member_own(text, jsonb) TO service_role;
GRANT EXECUTE ON FUNCTION public.leave_sih_team(text) TO service_role;
GRANT EXECUTE ON FUNCTION public.reissue_sih_management_token(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.reopen_sih_submission(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.set_sih_showcase(uuid, boolean) TO service_role;
GRANT EXECUTE ON FUNCTION public.assign_sih_mentor(uuid, text, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.upsert_evaluation_score(uuid, uuid, uuid, numeric, text) TO service_role;

-- Backfill member tokens for any pre-overhaul teammates (lead keeps team key).
UPDATE public.hackathon_team_members
SET member_token_hash = encode(sha256(('vertex:member:' || replace(gen_random_uuid()::text, '-', ''))::bytea), 'hex')
WHERE member_token_hash IS NULL AND is_lead = false;

-- Dedupe guard for criteria seeding.
CREATE UNIQUE INDEX IF NOT EXISTS evaluation_criteria_event_name_key ON public.evaluation_criteria (event_id, lower(name));
