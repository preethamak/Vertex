import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const listSarvamGateway = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { assertAdmin } = await import("@/lib/roles.server");
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // The generated database types predate this migration.
    const db = supabaseAdmin as any;
    const { data, error } = await db
      .from("sarvam_gateway_teams")
      .select("registration_id, key_prefix, allowance, spent, active, created_at");
    if (error) throw new Error("Gateway database is not configured.");
    return data as {
      registration_id: string;
      key_prefix: string;
      allowance: number;
      spent: number;
      active: boolean;
      created_at: string;
    }[];
  });

export const issueSarvamGatewayKey = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ registrationId: z.string().uuid() }).parse(input))
  .handler(async ({ context, data }) => {
    const { assertAdmin } = await import("@/lib/roles.server");
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { randomBytes, createHash } = await import("node:crypto");
    const { data: registration, error: re } = await supabaseAdmin
      .from("event_registrations")
      .select("id,status,events!inner(slug)")
      .eq("id", data.registrationId)
      .eq("events.slug", "build-with-sarvam")
      .maybeSingle();
    if (re || !registration || registration.status !== "approved")
      throw new Error("Only approved Build With Sarvam teams can receive a key.");
    const key = `vx_${randomBytes(32).toString("base64url")}`;
    const hash = createHash("sha256").update(key).digest("hex");
    const db = supabaseAdmin as any;
    const { data: existing, error: readError } = await db
      .from("sarvam_gateway_teams")
      .select("registration_id")
      .eq("registration_id", data.registrationId)
      .maybeSingle();
    if (readError) throw new Error("Could not check the gateway account.");
    const result = existing
      ? await db
          .from("sarvam_gateway_teams")
          .update({ key_hash: hash, key_prefix: key.slice(0, 10), active: true })
          .eq("registration_id", data.registrationId)
      : await db
          .from("sarvam_gateway_teams")
          .insert({
            registration_id: data.registrationId,
            key_hash: hash,
            key_prefix: key.slice(0, 10),
          });
    if (result.error) throw new Error("Could not issue a gateway key.");
    return { key };
  });

export const disableSarvamGatewayKey = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ registrationId: z.string().uuid() }).parse(input))
  .handler(async ({ context, data }) => {
    const { assertAdmin } = await import("@/lib/roles.server");
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await (supabaseAdmin as any)
      .from("sarvam_gateway_teams")
      .update({ active: false })
      .eq("registration_id", data.registrationId);
    if (error) throw new Error("Could not revoke the key.");
    return { ok: true };
  });
