import type { NextConfig } from "next";
import { fileURLToPath } from "node:url";
import { localeRedirects } from "@sharadox/internationalization-web-library/locale-redirect";
import { vercelAppRedirect } from "@sharadox/next-js-configuration-web-library/domain-redirect";
import { SECURITY_HEADERS } from "@sharadox/next-js-configuration-web-library/security-header";
import type { NextConfigurationOptions } from "@sharadox/next-js-configuration-web-library/next-configuration/type";

/**
 * The Next.js configuration of a Sharadox-style application: Sass finds `src/` and the site library's design
 * helpers, `/` follows the visitor's language, every page sends security headers, and once the site has its own
 * domain, `*.vercel.app` addresses redirect to it.
 *
 * @example
 * // next.config.ts
 * export default defineNextConfiguration({ root: new URL("./", import.meta.url), styleLibrary: "@sharadox/sharadox-web-library",
 *   locales: LOCALES, productionDomain: "sharadox.com" });
 */
export function defineNextConfiguration<Locale extends string>({
  root,
  styleLibrary,
  locales,
  productionDomain,
  next = {},
}: NextConfigurationOptions<Locale>): NextConfig {
  const path = (relative: string) => fileURLToPath(new URL(relative, root));
  const loadPaths = [...(styleLibrary ? [path(`node_modules/${styleLibrary}/distribution`)] : []), path("src")];
  return {
    ...next,
    sassOptions: { loadPaths, ...next.sassOptions },
    async redirects() {
      return [
        ...(productionDomain ? vercelAppRedirect(productionDomain) : []),
        ...(locales ? localeRedirects(locales) : []),
        ...((await next.redirects?.()) ?? []),
      ];
    },
    async headers() {
      return [{ source: "/:path*", headers: [...SECURITY_HEADERS] }, ...((await next.headers?.()) ?? [])];
    },
  };
}
