CREATE OR REPLACE FUNCTION public.guard_member_self_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF public.has_role(auth.uid(), 'admin'::app_role) THEN
    RETURN NEW;
  END IF;
  NEW.is_head := OLD.is_head;
  NEW.is_leadership := OLD.is_leadership;
  NEW.team_id := OLD.team_id;
  NEW.user_id := OLD.user_id;
  NEW.role := OLD.role;
  NEW.slug := OLD.slug;
  NEW.name := OLD.name;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS guard_member_self_update ON public.members;
CREATE TRIGGER guard_member_self_update
BEFORE UPDATE ON public.members
FOR EACH ROW EXECUTE FUNCTION public.guard_member_self_update();

REVOKE EXECUTE ON FUNCTION public.guard_member_self_update() FROM anon, authenticated;