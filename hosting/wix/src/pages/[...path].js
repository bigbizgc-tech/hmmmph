// Catch-all route: matches every path no file or Wix route takes. src/site-routing.mjs answers
// these requests first; this handler gives the same answer if it is ever reached.
import { respond } from "../routing.mjs";

export const prerender = false;
export const ALL = ({ url }) => respond(url);
