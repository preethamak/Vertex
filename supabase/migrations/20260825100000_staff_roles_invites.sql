-- Staff roles with verification: judges and mentors join via admin-issued codes.

ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'judge';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'mentor';

-- Single/multi-use access codes the SIH desk hands to trusted judges and mentors.
CREATE TABLE IF NOT EXISTS public.staff_invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  role text NOT NULL CHECK (role IN ('judge', 'mentor')),
  label text,
  max_uses integer NOT NULL DEFAULT 1 CHECK (max_uses >= 1),
  used_count integer NOT NULL DEFAULT 0,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  revoked boolean NOT NULL DEFAULT false
);

ALTER TABLE public.staff_invites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage staff invites" ON public.staff_invites;
CREATE POLICY "Admins manage staff invites"
  ON public.staff_invites FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Redeeming a code: atomic, validates role/revocation/uses, grants the role.
CREATE OR REPLACE FUNCTION public.redeem_staff_invite(p_code text, p_role text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_invite public.staff_invites;
BEGIN
  IF p_role NOT IN ('judge', 'mentor') THEN
    RAISE EXCEPTION 'Only judge and mentor roles use invite codes.';
  END IF;
  IF NOT public.has_role(auth.uid(), 'member') AND auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Sign in first.';
  END IF;

  SELECT * INTO v_invite
  FROM public.staff_invites
  WHERE code = upper(btrim(p_code)) AND role = p_role AND revoked = false
  FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'That code is not valid for this role.';
  END IF;
  IF v_invite.used_count >= v_invite.max_uses THEN
    RAISE EXCEPTION 'This code has already been used.';
  END IF;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (auth.uid(), p_role::public.app_role)
  ON CONFLICT (user_id, role) DO NOTHING;

  UPDATE public.staff_invites
  SET used_count = used_count + 1
  WHERE id = v_invite.id;
END;
$$;

REVOKE ALL ON FUNCTION public.redeem_staff_invite(text, text) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.redeem_staff_invite(text, text) TO authenticated;
