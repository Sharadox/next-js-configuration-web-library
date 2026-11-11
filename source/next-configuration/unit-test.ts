import { fileURLToPath } from "node:url";
import { describe, expect, test } from "vitest";
import { defineLocales } from "@sharadox/internationalization-web-library/locale";
import { defineNextConfiguration } from "@sharadox/next-js-configuration-web-library/next-configuration";
import { SECURITY_HEADERS } from "@sharadox/next-js-configuration-web-library/security-header";

const root = new URL("file:///site/");
const LOCALES = defineLocales({ locales: ["en", "pt"], defaultLocale: "en" });

describe("defineNextConfiguration", () => {
  test("puts the site library's design helpers and src/ on the Sass load path", () => {
    expect(defineNextConfiguration({ root, styleLibrary: "@sharadox/sharadox-web-library" }).sassOptions).toEqual({
      loadPaths: [
        fileURLToPath("file:///site/node_modules/@sharadox/sharadox-web-library/distribution"),
        fileURLToPath("file:///site/src"),
      ],
    });
    expect(defineNextConfiguration({ root: "file:///other/" }).sassOptions).toEqual({
      loadPaths: [fileURLToPath("file:///other/src")],
    });
  });

  test("redirects vercel.app to the real domain, then / to the visitor's language", async () => {
    const redirects = await defineNextConfiguration({ root, locales: LOCALES, productionDomain: "sharadox.com" })
      .redirects!();
    expect(redirects[0]).toEqual({
      source: "/:path*",
      has: [{ type: "host", value: ".*\\.vercel\\.app" }],
      destination: "https://sharadox.com/:path*",
      permanent: true,
    });
    expect(redirects.at(-1)).toEqual({ source: "/", destination: "/en", permanent: false });
    expect(redirects).toHaveLength(5);
  });

  test("adds no redirects for a site without locales or a domain yet", async () => {
    expect(await defineNextConfiguration({ root }).redirects!()).toEqual([]);
  });

  test("sends security headers on every page", async () => {
    expect(await defineNextConfiguration({ root }).headers!()).toEqual([
      { source: "/:path*", headers: [...SECURITY_HEADERS] },
    ]);
  });

  test("keeps the application's own settings, redirects and headers", async () => {
    const configuration = defineNextConfiguration({
      root,
      next: {
        poweredByHeader: false,
        sassOptions: { silenceDeprecations: ["import"] },
        redirects: async () => [{ source: "/old", destination: "/new", permanent: true }],
        headers: async () => [{ source: "/a", headers: [{ key: "X-A", value: "1" }] }],
      },
    });
    expect(configuration.poweredByHeader).toBe(false);
    expect(configuration.sassOptions).toMatchObject({ silenceDeprecations: ["import"] });
    expect(await configuration.redirects!()).toEqual([{ source: "/old", destination: "/new", permanent: true }]);
    expect((await configuration.headers!())[1]).toEqual({ source: "/a", headers: [{ key: "X-A", value: "1" }] });
  });
});
