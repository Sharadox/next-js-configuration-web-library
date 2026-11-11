import type { DomainRedirect } from "@sharadox/next-js-configuration-web-library/domain-redirect/type";

/**
 * Sends every `*.vercel.app` address (the project's alias and each deployment's own address) to the same path on
 * the real domain, permanently, so the site is reachable only on its own domain.
 *
 * @example
 * vercelAppRedirect("sharadox.com"); // [{ source: "/:path*", has: [{ type: "host", value: ".*\\.vercel\\.app" }], destination: "https://sharadox.com/:path*", permanent: true }]
 */
export function vercelAppRedirect(productionDomain: string): DomainRedirect[] {
  return [
    {
      source: "/:path*",
      has: [{ type: "host", value: ".*\\.vercel\\.app" }],
      destination: `https://${productionDomain}/:path*`,
      permanent: true,
    },
  ];
}
