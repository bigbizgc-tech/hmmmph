// POST /x-conversion: the same-origin endpoint the page calls after a lead form succeeds. It
// turns the small JSON body into an X Conversion API Lead event and sends it from the server.
// Framework-free (Request in, Response out) so test/x-conversion.test.mjs drives it directly.
import { buildConversion, sendConversion } from "./x-capi.mjs";

export const MAX_BODY_BYTES = 4096;
const ID_RE = /^[A-Za-z0-9_-]{1,64}$/;
const SEEN_MAX = 1000;
const defaultSeen = new Set(); // per server instance; insertion-ordered, oldest evicted first

const json = (status, obj, extra = {}) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", ...extra },
  });

/** Client IP behind Wix's edge: cf-connecting-ip, then x-real-ip, then the first x-forwarded-for hop. */
export function clientIp(headers) {
  const h = (n) => headers.get(n)?.trim();
  return h("cf-connecting-ip") || h("x-real-ip") || h("x-forwarded-for")?.split(",")[0].trim() || undefined;
}

/** Same-origin check. Sec-Fetch-Site (browser-set) wins; otherwise Origin must match a host the request came in on. */
export function sameOrigin(request) {
  const site = request.headers.get("sec-fetch-site");
  if (site) return site === "same-origin";
  const origin = request.headers.get("origin");
  if (!origin) return false;
  let host;
  try { host = new URL(origin).host.toLowerCase(); } catch { return false; }
  const hosts = [request.headers.get("host"), request.headers.get("x-forwarded-host"), new URL(request.url).host]
    .filter(Boolean).flatMap((v) => v.split(",")).map((v) => v.trim().toLowerCase());
  return hosts.includes(host);
}

async function readBody(request) {
  const declared = Number(request.headers.get("content-length"));
  if (declared > MAX_BODY_BYTES) return null;
  const reader = request.body?.getReader();
  if (!reader) return "";
  const chunks = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.length;
    if (size > MAX_BODY_BYTES) { reader.cancel().catch(() => {}); return null; }
    chunks.push(value);
  }
  const all = new Uint8Array(size);
  let at = 0;
  for (const c of chunks) { all.set(c, at); at += c.length; }
  return new TextDecoder().decode(all);
}

/**
 * options: { getToken: async () => string|undefined, fetchImpl, seen (Set), xUrl, now }
 */
export async function handleConversion(request, { getToken, fetchImpl = fetch, seen = defaultSeen, xUrl, now } = {}) {
  if (request.method !== "POST") return json(405, { error: "method not allowed" }, { Allow: "POST" });
  if (!sameOrigin(request)) return json(403, { error: "forbidden" });
  if (!/^application\/json\b/i.test(request.headers.get("content-type") ?? "")) return json(415, { error: "json only" });

  const text = await readBody(request);
  if (text === null) return json(413, { error: "too large" });
  let data;
  try { data = JSON.parse(text); } catch { return json(400, { error: "bad json" }); }
  if (!data || typeof data !== "object" || Array.isArray(data)) return json(400, { error: "bad json" });
  const { conversion_id: conversionId, email, phone, twclid, page } = data;
  if (typeof conversionId !== "string" || !ID_RE.test(conversionId)) return json(400, { error: "bad conversion_id" });

  const token = await getToken?.();
  if (!token) return json(202, { sent: false, reason: "no token" });

  const built = await buildConversion({
    conversionId, email, phone, twclid, pageUrl: page,
    ip: clientIp(request.headers), userAgent: request.headers.get("user-agent") ?? "",
    ...(now ? { now: now() } : {}),
  });
  if (!built) return json(202, { sent: false, reason: "no identifiers" });

  if (seen.has(conversionId)) return json(200, { sent: false, reason: "duplicate" });
  seen.add(conversionId);
  if (seen.size > SEEN_MAX) seen.delete(seen.values().next().value);

  const r = await sendConversion(built.body, token, fetchImpl, xUrl ? { url: xUrl } : undefined);
  if (!r.ok) {
    seen.delete(conversionId); // let a retry through
    console.error(`x-conversion: X API answered ${r.status}`); // status only: no body, token or PII
    return json(502, { sent: false });
  }
  return json(200, { sent: true });
}
