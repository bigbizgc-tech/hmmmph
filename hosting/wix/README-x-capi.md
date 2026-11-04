# X Conversion API (server-side Lead event)

`POST /x-conversion` takes a small JSON body from the page and sends one **Lead** event
(`event_id` `tw-rhx35-rid9b`, pixel `rhx35`) to
`https://ads-api.x.com/12/measurement/conversions/rhx35` from the Wix server. The browser never
calls X and never sees the token (`X-Pixel-Token`).

Code: `src/x-capi.mjs` (hashing, E.164, payload, send), `src/x-conversion.mjs` (handler),
`src/x-conversion-route.mjs` (token lookup), `src/site-routing.mjs` + `src/pages/x-conversion.js`
(routing). Tests: `npm test`.

## Browser contract

Call it after the lead form (FormSubmit) reports success, with the **same id the X pixel used
as `conversion_id`** so X de-duplicates browser and server events:

```js
fetch("/x-conversion", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  keepalive: true,
  body: JSON.stringify({
    conversion_id: "<same value as the pixel's conversion_id>", // required, /^[A-Za-z0-9_-]{1,64}$/
    email: "person@example.com",   // optional, raw: hashed on the server (trim, lowercase, SHA-256)
    phone: "(415) 555-2671",       // optional, raw: E.164 then SHA-256 (US default; unusable numbers dropped)
    twclid: "…",                   // optional, from the ?twclid= landing URL
    page: location.href            // optional, sent as event_source_url
  })
}).catch(() => {});  // ignore failures; a 404 (not released yet) is fine too
```

Rules: JSON only, 4 KB max, same-origin only (`Sec-Fetch-Site: same-origin`, else `Origin` must
match the host). At least one identifier is needed: `twclid`, email, phone, or the server-read
client IP plus User-Agent (always sent together, taken from the request headers, not the body).
Responses: `200 {sent:true}`, `200 {sent:false,reason:"duplicate"}`, `202 {sent:false,reason:"no token"|"no identifiers"}`,
`400/403/405/413/415`, `502 {sent:false}` (X refused or timed out). Each `conversion_id` is sent
once per server instance (in-memory, 1000 most recent); X's own `conversion_id` de-dupe covers the rest.

## How the token is read (`X_PIXEL_TOKEN`)

1. **Confirmed** (Wix docs, "Manage Environment Variables in the CLI"): a secret declared in
   `astro.config.mjs` `env.schema` (done: `X_PIXEL_TOKEN`, server/secret/optional) and imported
   from `astro:env/server`. The Wix hosting adapter feeds the runtime env to Astro, so the live
   binding holds the value on each request. Then `locals.env.X_PIXEL_TOKEN` and `process.env`
   (inferred, harmless extras for local runs).
2. **Inferred, unverified**: if none of those has it, the page route calls Wix Secrets Manager:
   `auth.elevate(secrets.getSecretValue)("X_PIXEL_TOKEN")` (`@wix/secrets`, `@wix/essentials`).
   This may additionally need the secrets-read permission on the project's app. No token found
   anywhere gives `202 {sent:false,reason:"no token"}` and X is not called.

The value is never logged or returned; errors log only X's HTTP status.

## Owner steps

1. Wix dashboard: open the headless project, **Developer Tools > Secrets Manager > Add Secret**.
   Name `X_PIXEL_TOKEN`, value = the pixel token from X Ads Manager, save. (CLI alternative:
   `wix env set --key=X_PIXEL_TOKEN --value=…`; those do not show in Secrets Manager.)
2. **Build and release again** (`node hosting/wix/release.mjs`, then release the zip). Per Wix docs,
   secret changes apply on the next release.
3. Local runs only: copy `.env.example` to `.env.local` and fill it (gitignored).

## Test once released

```sh
curl -i https://<site>/x-conversion -H 'Content-Type: application/json' \
  -H 'Origin: https://<site>' \
  -d '{"conversion_id":"test_001","email":"you@example.com"}'
```

Expect `HTTP 200 {"sent":true}` (X replied 2xx). `202 no token` means the secret was not found
(check name and that you released after adding it); `502` means X rejected the call. Use a fresh
`conversion_id` each try (a repeat answers `duplicate`). Then check the pixel's Events Manager /
conversion diagnostics in X Ads Manager.

## Unverified here

The sandbox cannot reach Wix or X: real Wix runtime secret injection, the Secrets Manager fallback,
which client-IP header Wix's edge sets (`cf-connecting-ip`, `x-real-ip`, `x-forwarded-for` are tried
in that order), and X's actual reply were not exercised. Tests use a local fake X server.
