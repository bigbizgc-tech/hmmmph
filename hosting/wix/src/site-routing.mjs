// Middleware registered first (astro.config.mjs): every request Astro routes to the catch-all
// page is answered here, before the Wix integration's middleware runs. Requests for the Wix
// integration's own routes (/_wix/…, /api/auth/…, /_api/…) go on to it unchanged.
import { respond } from "./routing.mjs";

export const onRequest = (context, next) =>
  context.routePattern === "/[...path]" ? respond(context.url) : next();
