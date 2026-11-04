// Glue between the Astro/Wix runtime and src/x-conversion.mjs: where the pixel token comes from.
// Imported by the middleware and the /x-conversion page only (it uses astro:env, which plain
// Node does not have).
import { X_PIXEL_TOKEN } from "astro:env/server";
import { handleConversion } from "./x-conversion.mjs";

const NAME = "X_PIXEL_TOKEN";

// 2. Wix Secrets Manager (@wix/secrets) - INFERRED to work, unverified: needs the app to be
// allowed SECRETS_VAULT.SECRET_READ and a Wix request context (the Wix middleware's).
async function fromSecretsManager() {
  try {
    const [{ secrets }, { auth }] = await Promise.all([import("@wix/secrets"), import("@wix/essentials")]);
    const res = await auth.elevate(secrets.getSecretValue)(NAME);
    return typeof res?.value === "string" ? res.value : undefined;
  } catch {
    return undefined;
  }
}

/**
 * 1. astro:env/server secret (CONFIRMED in Wix docs: Secrets Manager / `wix env set`, declared in
 *    astro.config.mjs env.schema), then runtime env passed to the worker (locals.env) and
 *    process.env (local/Node: inferred).
 * 2. Secrets Manager API, only when `secretsApi` is true.
 */
export function makeGetToken(locals, { secretsApi }) {
  return async () => {
    const v = X_PIXEL_TOKEN || locals?.env?.[NAME] || (typeof process !== "undefined" ? process.env?.[NAME] : undefined);
    if (typeof v === "string" && v.trim()) return v.trim();
    return secretsApi ? fromSecretsManager() : undefined;
  };
}

export const answer = (request, locals, secretsApi) => handleConversion(request, { getToken: makeGetToken(locals, { secretsApi }) });
