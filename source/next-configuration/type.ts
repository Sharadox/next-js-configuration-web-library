import type { NextConfig } from "next";
import type { Locales } from "@sharadox/internationalization-web-library/locale/type";

export interface NextConfigurationOptions<Locale extends string> {
  /** The application folder: pass `new URL("./", import.meta.url)` from next.config.ts. */
  root: URL | string;
  /**
   * The site's library whose Sass design helpers the application `@use`s (for example
   * "@sharadox/sharadox-web-library"); its `distribution/` goes on the Sass load path, after `src/`.
   */
  styleLibrary?: string;
  /** The site's locales: `/` then redirects to the remembered, browser or default locale. */
  locales?: Locales<Locale>;
  /**
   * The real domain once the site has one (for example "sharadox.com"): every `*.vercel.app` address then
   * redirects there (temporarily, so it can be undone), so the site is only reachable on its own domain.
   */
  productionDomain?: string;
  /** Anything else for Next.js; merged over these settings. */
  next?: NextConfig;
}
