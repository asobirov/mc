# Friends MC

The source, infrastructure, client pack, and private web portal for the Friends
MC Minecraft 1.21.1 server.

## Start here

- [Agent deployment instructions](./AGENTS.md)
- [Minecraft server runbook](./modpacks/aeronautics-1.21.1/README.md)
- [Agent/client installation runbook](./modpacks/aeronautics-1.21.1/CLIENT-SETUP.md)
- [Private portal documentation](./apps/web/README.md)
- [Client validation notes](./modpacks/aeronautics-1.21.1/CLIENT-VALIDATION.md)
- [Backup restore drill](./modpacks/aeronautics-1.21.1/RESTORE-DRILL.md)

## Production components

| Component                     | Source                        | Production endpoint      |
| ----------------------------- | ----------------------------- | ------------------------ |
| Minecraft + backups + BlueMap | `modpacks/aeronautics-1.21.1` | `mc.xpr.im:25565`        |
| Proximity voice               | Minecraft Compose stack       | `mc.xpr.im:24454/udp`    |
| Authenticated portal          | `apps/web`                    | `https://mc.xpr.im`      |
| Private browser map           | BlueMap through the portal    | `https://mc.xpr.im/map/` |

The current client/server pack is Friends MC 1.1.3. The client `.mrpack` is
stored with Git LFS. BlueMap is intentionally server-only and the browser map is
available only to approved portal users.

## Development

This repository retains its pnpm/Turborepo structure. For the production web
app:

```sh
pnpm install --frozen-lockfile
pnpm --filter @mc/web test
pnpm --filter @mc/web typecheck
pnpm --filter @mc/web build
```

Run the portal locally with `pnpm dev:web`. See `apps/web/.env.example` for its
environment variables; never commit a populated `.env` file.
