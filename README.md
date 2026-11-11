# @sharadox/next-js-configuration-web-library

The Next.js configuration every Sharadox-style application shares, in one call:

- **Sass:** `src/` and the site library's `distribution/` are on the load path, so `@use "style/token"` finds the library's design helpers.
- **Languages:** `/` redirects to the language the visitor picked before, then their browser's, then the default (`@sharadox/internationalization-web-library`).
- **Security headers on every page:** `nosniff`, a strict referrer policy, no framing, no camera, microphone, geolocation or payment.
- **Real domain only:** once the site has its own domain, every `*.vercel.app` address (the project alias and each deployment) redirects to the same path on it. Every redirect is temporary (307), so browsers never keep it and any address can be used again later.

## Install

```sh
pnpm add -D @sharadox/next-js-configuration-web-library
```

## Use

```ts
// next.config.ts
import { defineNextConfiguration } from "@sharadox/next-js-configuration-web-library/next-configuration";
import { LOCALES } from "@sharadox/sharadox-web-library/content/locale";

export default defineNextConfiguration({
  root: new URL("./", import.meta.url),
  styleLibrary: "@sharadox/sharadox-web-library",
  locales: LOCALES,
  productionDomain: "sharadox.com", // leave out while the site lives on <project>.vercel.app
});
```

Anything else for Next.js goes in `next`. It's merged over these settings, and its `redirects()` and `headers()` are added after them.

## API

| Import                 | Export                                                                                 |
| ---------------------- | -------------------------------------------------------------------------------------- |
| `…/next-configuration` | `defineNextConfiguration({ root, styleLibrary?, locales?, productionDomain?, next? })` |
| `…/domain-redirect`    | `vercelAppRedirect(productionDomain)`                                                  |
| `…/security-header`    | `SECURITY_HEADERS`                                                                     |

## Develop

`pnpm verify` runs formatting, lint, type-check, tests with 100% coverage and the build. Branches follow `<feature>.development` → `development` → `index`, and releases are `v<version>` tags on `index`.

## License

Licença Sharadox de Código Aberto, versão 0.1.0. See [português](LICENCA.md) (the binding text) and the [English translation](LICENSE.md).
