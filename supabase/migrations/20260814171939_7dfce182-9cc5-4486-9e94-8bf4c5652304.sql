
-- 1. Restrict media bucket reads to staff only (public images are served via signed URLs)
DROP POLICY IF EXISTS "Signed in users read media" ON storage.objects;
DROP POLICY IF EXISTS "Staff read media" ON storage.objects;
CREATE POLICY "Staff read media"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'media'
  AND (public.has_role(auth.uid(), 'admin'::public.app_role) OR public.has_role(auth.uid(), 'head'::public.app_role))
);

-- 2. Ensure no direct client access to PII tables; writes happen only through validated server functions
REVOKE ALL ON public.applications FROM anon;
REVOKE ALL ON public.event_registrations FROM anon;
GRANT ALL ON public.applications TO service_role;
GRANT ALL ON public.event_registrations TO service_role;

-- 3. Trigger-only helper should not be callable from the API
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM anon, authenticated;
