# Friends MC web

Private landing page for `mc.xpr.im`, built with the same core stack as
`~/dev/timeline`: Vite, React, TanStack Router, Tailwind CSS, Hono, Better Auth,
and Zod. It stays on the Minecraft repo's existing pnpm/Turborepo toolchain.

## Authentication

The app supports Google, Discord, and Microsoft OAuth. A new account must have a
provider-verified email, then starts as `member / pending / unverified`. It can
sign in but cannot see the portal or download the pack until an admin approves
it. Admins can approve, block, reset, promote, and demote people from the access
panel in the portal. Blocking takes effect on the next protected request even
if the person still has a valid session cookie.

`emailVerified` means Google or Discord owns the email assertion. The custom
`verified` field separately means a server owner trusts the person. Roles are
`admin` and `member`; access states are `pending`, `approved`, and `blocked`.

`AUTH_ADMIN_EMAILS` is the break-glass owner list. Matching accounts are
bootstrapped as approved, verified admins on every startup and cannot be
blocked or demoted in the web UI.

Sessions last 30 days, refresh daily while active, and are stored in the
persistent SQLite volume. The cookie is HTTP-only, SameSite=Lax, and Secure in
production.

Signed-in users can explicitly connect additional providers from the portal.
Google and Microsoft may also link automatically when their verified email
matches an existing verified portal account, allowing either provider to be a
single-step sign-in. Discord remains explicit-only. Explicit links may use
different email addresses because a person's Microsoft/Xbox account often
differs from their Google or Discord address.

OAuth callback URLs:

- `https://mc.xpr.im/api/auth/callback/google`
- `https://mc.xpr.im/api/auth/callback/discord`
- `https://mc.xpr.im/api/auth/callback/microsoft`

Copy `.env.example` to `.env`, generate `BETTER_AUTH_SECRET` with
`openssl rand -base64 48`, then fill in Google, the owner emails, and optionally
Discord, and Microsoft. Register the Microsoft app for personal Microsoft
accounts and configure the callback above as a Web redirect URI.

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
