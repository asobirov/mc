# Friends MC web

Private landing page for `mc.xpr.im`, built with the same core stack as
`~/dev/timeline`: Vite, React, TanStack Router, Tailwind CSS, Hono, Better Auth,
and Zod. It stays on the Minecraft repo's existing pnpm/Turborepo toolchain.

## Authentication

The app supports Google and Discord OAuth only. New accounts must have a
provider-verified email present in `AUTH_ALLOWED_EMAILS`. Removing an email from
that comma-separated list also blocks its existing sessions from protected app
resources after the service is restarted.

Sessions last 30 days, refresh daily while active, and are stored in the
persistent SQLite volume. The cookie is HTTP-only, SameSite=Lax, and Secure in
production.

OAuth callback URLs:

- `https://mc.xpr.im/api/auth/callback/google`
- `https://mc.xpr.im/api/auth/callback/discord`

Copy `.env.example` to `.env`, generate `BETTER_AUTH_SECRET` with
`openssl rand -base64 48`, then fill in both providers and the invited emails.

## Local development

```sh
pnpm dev:web
```

The Vite frontend runs on port 5173 and proxies `/api` to the Hono server on
port 3001.

## Deployment

Set `MODPACK_FILE` in `.env` to the absolute host path of the `.mrpack` file.
Then, from this directory:

```sh
docker compose up -d --build
```

Caddy reuses the existing `portal_caddy_data` and `portal_caddy_config` volumes,
so replacing the old portal does not discard its TLS state.
