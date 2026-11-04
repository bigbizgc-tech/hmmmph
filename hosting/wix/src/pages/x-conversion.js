// POST /x-conversion (see src/x-conversion.mjs). A file route outranks the [...path] catch-all.
// src/site-routing.mjs answers it first, with the environment token only; this handler is
// reached when no env token was found, and also tries the Wix Secrets Manager.
import { answer } from "../x-conversion-route.mjs";

export const prerender = false;
export const ALL = ({ request, locals }) => answer(request, locals, true);
