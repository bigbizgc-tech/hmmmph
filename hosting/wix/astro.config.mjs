// @ts-check
// Wix-managed Astro wrapper around the static site in ../../docs (copied into public/ by
// scripts/sync-site.mjs). The Wix pieces follow the Wix Headless kit's managed-Astro setup
// (github.com/wix/skills, skills/wix-headless-templates/blank/project/astro.config.mjs):
// the @wix/astro integration, the Wix hosting adapter, output "server".
import { defineConfig } from "astro/config";
import wix from "@wix/astro";
import wixHostingAdapter from "@wix/astro-wix-hosting-adapter";

// The site's URL routing (src/site-routing.mjs) as the first middleware, ahead of the Wix
// integration's own, so redirects and 404s answer without the Wix visitor-token call that
// middleware makes on every server-rendered request.
const siteRouting = {
  name: "site-routing",
  hooks: {
    "astro:config:setup": ({ addMiddleware }) =>
      addMiddleware({ entrypoint: new URL("./src/site-routing.mjs", import.meta.url), order: "pre" }),
  },
};

export default defineConfig({
  // robots: false — the site ships its own robots.txt (the integration would otherwise
  // inject a /robots.txt route that proxies Wix's default one).
  integrations: [siteRouting, wix({ robots: false })],
  adapter: wixHostingAdapter(),
  output: "server",
  security: { checkOrigin: false },
  image: { domains: ["static.wixstatic.com"] },
});
