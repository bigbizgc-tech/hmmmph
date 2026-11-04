// Pure helpers for X (Twitter) Conversion API events. No Astro/Wix imports, so they run in the
// Wix server bundle and under `node --test` alike. Server-side use only: the pixel token never
// leaves the server, and nothing here logs a token or raw PII.
export const X_PIXEL_ID = "rhx35";
export const X_EVENT_ID = "tw-rhx35-rid9b"; // the Lead event
export const X_ENDPOINT = `https://ads-api.x.com/12/measurement/conversions/${X_PIXEL_ID}`;

/** Trim + lowercase; null when it cannot be an email address. */
export function normalizeEmail(email) {
  if (typeof email !== "string") return null;
  const e = email.trim().toLowerCase();
  return e.length > 0 && e.length <= 254 && /^[^\s@]+@[^\s@]+$/.test(e) ? e : null;
}

/**
 * E.164 with a US default: 10 digits -> +1XXXXXXXXXX; 11 digits starting 1 -> +1XXXXXXXXXX;
 * an input starting with "+" keeps its digits (8-15 of them); anything else -> null (dropped).
 */
export function toE164(phone) {
  if (typeof phone !== "string") return null;
  const raw = phone.trim();
  const digits = raw.replace(/\D/g, "");
  if (raw.startsWith("+")) return digits.length >= 8 && digits.length <= 15 ? `+${digits}` : null;
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits[0] === "1") return `+${digits}`;
  return null;
}

/** Lowercase hex SHA-256 of a UTF-8 string (WebCrypto: Node and the Wix/workerd runtime). */
export async function sha256Hex(value) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(String(value)));
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
}

const IPV4 = /^(?:(?:25[0-5]|2[0-4]\d|1?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|1?\d?\d)$/;
const IPV6 = /^[0-9a-f:.]{2,45}$/i;
export const isIp = (s) => typeof s === "string" && (IPV4.test(s) || (s.includes(":") && IPV6.test(s)));

/**
 * The Conversion API request body for one Lead.
 * { conversionId, email, phone, twclid, ip, userAgent, pageUrl, now } - all optional but at
 * least one identifier must result: twclid, hashed_email, hashed_phone_number, or the PAIR
 * ip_address + user_agent (never one without the other).
 * Returns { body, identifiers: [names] } or null when no identifier is available.
 */
export async function buildConversion({ conversionId, email, phone, twclid, ip, userAgent, pageUrl, now = new Date() } = {}) {
  const id = {};
  if (typeof twclid === "string" && /^[A-Za-z0-9_.-]{1,256}$/.test(twclid)) id.twclid = twclid;
  const e = normalizeEmail(email);
  if (e) id.hashed_email = await sha256Hex(e);
  const p = toE164(phone);
  if (p) id.hashed_phone_number = await sha256Hex(p);
  const ua = typeof userAgent === "string" ? userAgent.trim().slice(0, 512) : "";
  if (isIp(ip) && ua) {
    id.ip_address = ip;
    id.user_agent = ua;
  }
  if (Object.keys(id).length === 0) return null;

  const conversion = { conversion_time: now.toISOString(), event_id: X_EVENT_ID };
  if (typeof pageUrl === "string" && /^https?:\/\//i.test(pageUrl)) conversion.event_source_url = pageUrl.slice(0, 2048);
  if (typeof conversionId === "string" && conversionId) conversion.conversion_id = conversionId;
  conversion.identifiers = [id];
  return { body: { conversions: [conversion] }, identifiers: Object.keys(id) };
}

/**
 * POSTs the body to X. Returns { ok, status, text } or { ok:false, status:0, text:"" } on
 * network error/timeout. The token only goes into the X-Pixel-Token header; it is never logged.
 */
export async function sendConversion(body, token, fetchImpl = fetch, { url = X_ENDPOINT, timeoutMs = 4000 } = {}) {
  try {
    const res = await fetchImpl(url, {
      method: "POST",
      headers: { "X-Pixel-Token": token, "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(timeoutMs),
    });
    const text = await res.text().catch(() => "");
    return { ok: res.status >= 200 && res.status < 300, status: res.status, text: text.slice(0, 2000) };
  } catch {
    return { ok: false, status: 0, text: "" };
  }
}
