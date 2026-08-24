// In-memory sliding-window rate limiter.
// Vercel may run multiple instances, so this caps per-instance burst load; the
// database's unique constraints remain the hard backstop against duplicates.

type Bucket = { hits: number[] };

const buckets = new Map<string, Bucket>();
let lastSweep = Date.now();

function sweep(now: number) {
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  for (const [key, bucket] of buckets) {
    bucket.hits = bucket.hits.filter((t) => now - t < 3_600_000);
    if (bucket.hits.length === 0) buckets.delete(key);
  }
}

export class RateLimitError extends Error {
  constructor(public retryAfterSeconds: number) {
    super("Too many requests. Please slow down and try again shortly.");
  }
}

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  sweep(now);
  const bucket = buckets.get(key) ?? { hits: [] };
  bucket.hits = bucket.hits.filter((t) => now - t < windowMs);
  if (bucket.hits.length >= limit) {
    const oldest = bucket.hits[0] ?? now;
    buckets.set(key, bucket);
    throw new RateLimitError(Math.max(1, Math.ceil((windowMs - (now - oldest)) / 1000)));
  }
  bucket.hits.push(now);
  buckets.set(key, bucket);
}

export async function clientKey(scope: string, salt: string) {
  const { getRequest } = await import("@tanstack/react-start/server");
  const request = getRequest();
  const forwarded = request?.headers?.get("x-forwarded-for") ?? "";
  const ip = forwarded.split(",")[0]?.trim() || request?.headers?.get("x-real-ip") || "unknown";
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(`${salt}:${ip}`),
  );
  const ipHash = Array.from(new Uint8Array(digest))
    .slice(0, 12)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `${scope}:${ipHash}`;
}
