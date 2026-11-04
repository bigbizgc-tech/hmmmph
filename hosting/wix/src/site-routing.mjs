// Middleware registered first (astro.config.mjs): every request Astro routes to the catch-all
// page is answered here, before the Wix integration's middleware runs. Requests for the Wix
// integration's own routes (/_wix/…, /api/auth/…, /_api/…) go on to it unchanged.
import { respond } from "./routing.mjs";
import { makeGetToken } from "./x-conversion-route.mjs";
import { handleConversion, sameOrigin } from "./x-conversion.mjs";

export const onRequest = async (context, next) => {
  if (context.routePattern === "/[...path]") return respond(context.url);
  if (context.routePattern === "/x-conversion") {
    // Fast path, skipping the Wix visitor-token call: with a token from the environment, and
    // for requests that are refused anyway (wrong method, cross-origin). Only a valid-looking
    // POST without an env token goes on to the page route, behind the Wix middleware, which
    // then also tries Secrets Manager.
    const getToken = makeGetToken(context.locals, { secretsApi: false });
    if ((await getToken()) || context.request.method !== "POST" || !sameOrigin(context.request)) {
      return handleConversion(context.request, { getToken });
    }
  }
  return next();
};
