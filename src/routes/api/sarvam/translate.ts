import { createFileRoute } from "@tanstack/react-router";

// This endpoint is intentionally limited to text translation. Do not proxy arbitrary URLs.
export const Route = createFileRoute("/api/sarvam/translate")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const reply = (message: string, status: number) =>
          Response.json({ error: message }, { status, headers: { "Cache-Control": "no-store" } });
        if (process.env.SARVAM_GATEWAY_ENABLED !== "true" || !process.env.SARVAM_API_KEY)
          return reply("Gateway is not enabled.", 503);
        const key = request.headers
          .get("authorization")
          ?.match(/^Bearer (vx_[A-Za-z0-9_-]{43})$/)?.[1];
        if (!key) return reply("Invalid team key.", 401);
        if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json"))
          return reply("Expected JSON.", 415);
        const contentLength = Number(request.headers.get("content-length"));
        if (!Number.isFinite(contentLength) || contentLength <= 0 || contentLength > 16000)
          return reply("Content-Length must be between 1 and 16000 bytes.", 413);
        let body: any;
        try {
          const buffer = await request.arrayBuffer();
          if (buffer.byteLength > 16000) return reply("Request too large.", 413);
          body = JSON.parse(new TextDecoder().decode(buffer));
        } catch {
          return reply("Invalid JSON.", 400);
        }
        if (
          !body ||
          typeof body !== "object" ||
          Array.isArray(body) ||
          typeof body.input !== "string" ||
          !body.input.trim() ||
          body.input.length > 1000 ||
          typeof body.source_language_code !== "string" ||
          typeof body.target_language_code !== "string" ||
          !/^[a-z]{2}-[A-Z]{2}$/.test(body.source_language_code) ||
          !/^[a-z]{2}-[A-Z]{2}$/.test(body.target_language_code)
        )
          return reply(
            "Provide input (up to 1000 characters), source_language_code and target_language_code.",
            400,
          );
        const { createHash } = await import("node:crypto");
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const hash = createHash("sha256").update(key).digest("hex");
        // Charge the UTF-8 byte count at the published pay-as-you-go rate of ₹2/1000
        // characters. This is a conservative allowance debit, not an invoice.
        const amount = Buffer.byteLength(body.input, "utf8") * 2000;
        const db = supabaseAdmin as any;
        const { data: reservation, error } = await db.rpc("reserve_sarvam_gateway", {
          p_hash: hash,
          p_amount: amount,
        });
        if (error) return reply("Gateway accounting unavailable.", 503);
        if (!reservation)
          return reply("Key inactive, team not approved, or allowance exhausted.", 403);
        let response: Response;
        try {
          response = await fetch("https://api.sarvam.ai/translate", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "api-subscription-key": process.env.SARVAM_API_KEY,
            },
            body: JSON.stringify({
              input: body.input,
              source_language_code: body.source_language_code,
              target_language_code: body.target_language_code,
              mode: "formal",
            }),
            signal: AbortSignal.timeout(25000),
          });
        } catch {
          await db
            .from("sarvam_gateway_requests")
            .update({ status: "upstream_error" })
            .eq("id", reservation);
          return reply("Sarvam did not respond. The reserved allowance is held for review.", 502);
        }
        await db
          .from("sarvam_gateway_requests")
          .update({ status: response.ok ? "completed" : "upstream_error" })
          .eq("id", reservation);
        const payload = await response.text();
        return new Response(payload, {
          status: response.status,
          headers: {
            "Content-Type": response.headers.get("content-type") ?? "application/json",
            "Cache-Control": "no-store",
          },
        });
      },
    },
  },
});
