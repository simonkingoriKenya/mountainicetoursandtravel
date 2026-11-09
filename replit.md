# Replit Setup

## Preview

The `Start application` workflow serves the site on port 5000 with local sample
data enabled:

```sh
VITE_USE_MOCK=true bun run dev -- --host 0.0.0.0 --port 5000 --strictPort
```

Vite allows the Replit proxy host so the preview iframe can load the app.

## Cloudflare Pages

Build with `bun install --frozen-lockfile && bun run build`; the output directory
is `dist`. Production requires the Cloudflare D1 binding `DB` and KV binding
`RATE_LIMIT`. Leave `VITE_USE_MOCK` unset in production to use the Worker API.
