// X Conversion API: helpers, the handler against a local fake X server, and the built worker's
// routing for /x-conversion.  npm test
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { createServer } from "node:http";
import { after, before, test } from "node:test";
import { buildConversion, normalizeEmail, sendConversion, sha256Hex, toE164, X_EVENT_ID } from "../src/x-capi.mjs";
import { handleConversion } from "../src/x-conversion.mjs";
import { startServer } from "../scripts/serve.mjs";

const sha = (s) => createHash("sha256").update(s).digest("hex");
const TOKEN = "tok_SECRET_do_not_leak_123";

test("normalizeEmail / toE164 / sha256Hex vectors", async () => {
  assert.equal(normalizeEmail("  Foo@Example.COM "), "foo@example.com");
  assert.equal(normalizeEmail("nope"), null);
  assert.equal(toE164("(415) 555-2671"), "+14155552671");
  assert.equal(toE164("1 415 555 2671"), "+14155552671");
  assert.equal(toE164("+44 20 7946 0958"), "+442079460958");
  assert.equal(toE164("12345"), null);
  assert.equal(toE164("21 415 555 2671"), null);
  assert.equal(await sha256Hex("abc"), "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");
  assert.equal(await sha256Hex("foo@example.com"), sha("foo@example.com"));
});

test("buildConversion: payload shape and hashing", async () => {
  const now = new Date("2026-01-02T03:04:05.678Z");
  const r = await buildConversion({
    conversionId: "abc-1", email: " Foo@Example.com", phone: "415-555-2671", twclid: "tw.abc_1",
    ip: "203.0.113.9", userAgent: "UA/1", pageUrl: "https://x.test/getstarted.html", now,
  });
  assert.deepEqual(r.body, { conversions: [{
    conversion_time: "2026-01-02T03:04:05.678Z", event_id: X_EVENT_ID, event_source_url: "https://x.test/getstarted.html",
    conversion_id: "abc-1",
    identifiers: [{ twclid: "tw.abc_1", hashed_email: sha("foo@example.com"), hashed_phone_number: sha("+14155552671"), ip_address: "203.0.113.9", user_agent: "UA/1" }],
  }] });
  assert.match(r.body.conversions[0].conversion_time, /^\d{4}-\d\d-\d\dT[\d:]+\.\d{3}Z$/);
});

test("buildConversion: identifier rules", async () => {
  assert.equal(await buildConversion({ conversionId: "a" }), null);
  assert.equal(await buildConversion({ ip: "203.0.113.9" }), null, "ip without user agent");
  assert.equal(await buildConversion({ userAgent: "UA" }), null, "user agent without ip");
  assert.equal(await buildConversion({ ip: "not-an-ip", userAgent: "UA" }), null);
  const pair = await buildConversion({ ip: "2001:db8::1", userAgent: "UA" });
  assert.deepEqual(pair.identifiers, ["ip_address", "user_agent"]);
  const solo = await buildConversion({ email: "a@b.co", ip: "203.0.113.9" });
  assert.deepEqual(solo.identifiers, ["hashed_email"], "lone ip dropped");
  assert.deepEqual((await buildConversion({ phone: "12345", twclid: "bad id!" })), null);
});

// ---- handler against a fake X server ----
let fake, fakeUrl, hits, xStatus, logs, origError;
before(async () => {
  fake = createServer((req, res) => {
    let b = "";
    req.on("data", (c) => (b += c));
    req.on("end", () => {
      hits.push({ method: req.method, url: req.url, headers: req.headers, body: b });
      res.writeHead(xStatus, { "Content-Type": "application/json" });
      res.end(xStatus === 200 ? '{"ok":true}' : `{"error":"boom ${TOKEN}"}`);
    });
  });
  await new Promise((ok) => fake.listen(0, "127.0.0.1", ok));
  fakeUrl = `http://127.0.0.1:${fake.address().port}/12/measurement/conversions/rhx35`;
  origError = console.error;
  console.error = (...a) => logs.push(a.join(" "));
});
after(() => { fake.close(); console.error = origError; });
const reset = (status = 200) => { hits = []; xStatus = status; logs = []; };

const HOST = "https://site.test";
const call = (body, { headers = {}, method = "POST", token = TOKEN, seen = new Set(), raw } = {}) =>
  handleConversion(
    new Request(`${HOST}/x-conversion`, {
      method,
      headers: { "content-type": "application/json", origin: HOST, "user-agent": "UA/1", "cf-connecting-ip": "203.0.113.9", ...headers },
      body: method === "GET" ? undefined : (raw ?? JSON.stringify(body)),
    }),
    { getToken: async () => token, seen, xUrl: fakeUrl },
  );

test("sends the Lead to X with the token header only", async () => {
  reset();
  const res = await call({ conversion_id: "cid_1", email: "A@b.co", phone: "4155552671", twclid: "tw1", page: "https://site.test/x" });
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { sent: true });
  assert.equal(hits.length, 1);
  assert.equal(hits[0].method, "POST");
  assert.equal(hits[0].headers["x-pixel-token"], TOKEN);
  assert.equal(hits[0].headers["content-type"], "application/json");
  const c = JSON.parse(hits[0].body).conversions[0];
  assert.equal(c.event_id, X_EVENT_ID);
  assert.equal(c.conversion_id, "cid_1");
  assert.equal(c.identifiers[0].ip_address, "203.0.113.9");
  assert.equal(c.identifiers[0].user_agent, "UA/1");
  assert.ok(!hits[0].body.includes("a@b.co") && !hits[0].body.includes("4155552671"), "no raw PII sent");
});

test("X errors become 502 without details; token and PII never logged or returned", async () => {
  reset(500);
  const res = await call({ conversion_id: "cid_err", email: "a@b.co" });
  const text = await res.text();
  assert.equal(res.status, 502);
  assert.deepEqual(JSON.parse(text), { sent: false });
  assert.ok(!text.includes(TOKEN));
  assert.ok(!logs.join("\n").includes(TOKEN) && !logs.join("\n").includes("a@b.co"));
  // a failed id may be retried
  reset(200);
  const seen = new Set();
  await call({ conversion_id: "cid_retry", email: "a@b.co" }, { seen });
  assert.equal(hits.length, 1);
});

test("no token: 202 and X is not called", async () => {
  reset();
  const res = await call({ conversion_id: "cid_nt", email: "a@b.co" }, { token: null });
  assert.equal(res.status, 202);
  assert.deepEqual(await res.json(), { sent: false, reason: "no token" });
  assert.equal(hits.length, 0);
});

test("duplicate conversion_id is sent once", async () => {
  reset();
  const seen = new Set();
  const a = await call({ conversion_id: "dup1", email: "a@b.co" }, { seen });
  const b = await call({ conversion_id: "dup1", email: "a@b.co" }, { seen });
  assert.equal(a.status, 200);
  assert.deepEqual(await b.json(), { sent: false, reason: "duplicate" });
  assert.equal(hits.length, 1);
});

test("origin checks: cross-origin 403, sec-fetch-site, missing origin", async () => {
  reset();
  assert.equal((await call({ conversion_id: "o1", email: "a@b.co" }, { headers: { origin: "https://evil.test" } })).status, 403);
  assert.equal((await call({ conversion_id: "o2", email: "a@b.co" }, { headers: { "sec-fetch-site": "cross-site" } })).status, 403);
  assert.equal((await call({ conversion_id: "o3", email: "a@b.co" }, { headers: { origin: "", } })).status, 403);
  assert.equal((await call({ conversion_id: "o4", email: "a@b.co" }, { headers: { "sec-fetch-site": "same-origin", origin: "https://internal.wix" } })).status, 200);
  assert.equal((await call({ conversion_id: "o5", email: "a@b.co" }, { headers: { origin: "https://www.edge.test", "x-forwarded-host": "www.edge.test" } })).status, 200);
  assert.equal(hits.length, 2);
});

test("validation: method, type, size, json, conversion_id, identifiers", async () => {
  reset();
  const get = await call(null, { method: "GET" });
  assert.equal(get.status, 405);
  assert.equal(get.headers.get("allow"), "POST");
  assert.equal((await call({}, { headers: { "content-type": "text/plain" } })).status, 415);
  assert.equal((await call(null, { raw: "{nope" })).status, 400);
  assert.equal((await call(null, { raw: "[]" })).status, 400);
  assert.equal((await call({ conversion_id: "bad id!", email: "a@b.co" })).status, 400);
  assert.equal((await call({ conversion_id: "x".repeat(65), email: "a@b.co" })).status, 400);
  assert.equal((await call({ email: "a@b.co" })).status, 400);
  assert.equal((await call({ conversion_id: "big", email: "a@b.co", pad: "x".repeat(5000) })).status, 413);
  const none = await call({ conversion_id: "noid" }, { headers: { "user-agent": "", "cf-connecting-ip": "" } });
  assert.equal(none.status, 202);
  assert.equal(hits.length, 0);
});

test("sendConversion returns status+text and never throws", async () => {
  reset(200);
  const ok = await sendConversion({ a: 1 }, TOKEN, fetch, { url: fakeUrl });
  assert.deepEqual([ok.ok, ok.status], [true, 200]);
  const bad = await sendConversion({}, TOKEN, async () => { throw new Error("net"); });
  assert.deepEqual(bad, { ok: false, status: 0, text: "" });
});

// ---- the built worker: routing reaches the endpoint ----
test("built worker serves /x-conversion ahead of the catch-all", async () => {
  // Offline: a same-origin valid POST with no env token would continue to the Wix middleware
  // (visitor-token call to wixapis.com), and with a token it would call the real X API, so
  // only refusals are exercised here; the 202 and 200 paths are covered against the fake X above.
  for (const env of [{}, { X_PIXEL_TOKEN: "t" }]) {
    const server = await startServer(0, env);
    try {
      const base = `http://127.0.0.1:${server.address().port}`;
      assert.equal((await fetch(`${base}/x-conversion`)).status, 405);
      const post = (headers, body = "{}") => fetch(`${base}/x-conversion`, { method: "POST", headers, body });
      assert.equal((await post({ "content-type": "application/json", origin: "https://evil.test" })).status, 403);
      if (env.X_PIXEL_TOKEN) {
        const h = { "sec-fetch-site": "same-origin" };
        assert.equal((await post({ ...h, "content-type": "text/plain" })).status, 415);
        assert.equal((await post({ ...h, "content-type": "application/json" }, "{bad")).status, 400);
        assert.equal((await post({ ...h, "content-type": "application/json" }, '{"conversion_id":"bad id"}')).status, 400);
      }
    } finally {
      server.close();
    }
  }
});
