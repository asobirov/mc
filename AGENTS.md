# Friends MC agent instructions

## Mission

When the user asks to set up, deploy, migrate, repair, or upgrade Friends MC,
own the task through a verified working deployment. Do not stop after producing
a plan or a list of shell commands if the machine is accessible. Work directly
on the target, keep the user informed during long operations, and finish with a
short status report and any genuine external blockers.

This file is the deployment contract for coding agents. Read these files before
changing anything:

- `modpacks/aeronautics-1.21.1/README.md`
- `modpacks/aeronautics-1.21.1/CLIENT-SETUP.md`
- `modpacks/aeronautics-1.21.1/docker-compose.yml`
- `apps/web/README.md`
- `apps/web/docker-compose.yml`
- `modpacks/aeronautics-1.21.1/RESTORE-DRILL.md`

## Production scope and source of truth

- Minecraft: NeoForge 1.21.1, Friends MC pack 1.1.3.
- Game stack: `modpacks/aeronautics-1.21.1/`.
- Private portal: `apps/web/`, served at `https://mc.xpr.im`.
- Game address: `mc.xpr.im:25565`.
- Proximity voice: UDP 24454.
- RCON: internal Docker networking only; never publish it.
- BlueMap 5.7: server-only, proxied behind portal authorization at `/map/`.
- Shared Docker network: `friends_mc_bridge`.
- Current live-host layout is `/srv/minecraft/aeronautics` for the game and
  `/srv/minecraft/web-next` for a deploy copy of the repository. A fresh host
  may run both Compose projects directly from one clone under
  `/srv/minecraft/repo`; do not rearrange an existing working host merely to
  match that preference.

The `.mrpack` is the source of truth for client and pack mods. Server-only
utilities belong in `MODRINTH_PROJECTS` in the game Compose file. Never add
BlueMap to the client pack.

When the request is to set up a player's computer, follow `CLIENT-SETUP.md`
end-to-end. SKlauncher is the preferred launcher. “Install the mods” means
import the verified Friends MC `.mrpack` into a dedicated instance; do not
manually assemble a second mod list or put these mods in the global Minecraft
directory.

## Non-negotiable safety rules

1. Never print, commit, copy into chat, or include in logs any `.env` value,
   OAuth secret, RCON password, backup URL, session cookie, private key, or
   Minecraft access token. Inspect variable names and whether values exist,
   not the values themselves.
2. Never overwrite or delete `data/`, `world/`, auth SQLite volumes, backups,
   or Caddy volumes. If `data/world/level.dat` exists, treat the host as an
   existing server and preserve it.
3. Before a Minecraft restart, run `save-all flush`, check the online player
   count, and avoid interrupting players unless the user authorized immediate
   downtime. Portal-only changes do not require a game restart.
4. Before a risky upgrade or migration, create and verify a fresh backup. Do
   not claim backup coverage from configuration alone; confirm an archive
   exists and run the restore drill when practical.
5. Keep `25575` and `8100` unpublished. Public inbound ports are SSH, 80/443,
   Minecraft TCP 25565, and Simple Voice Chat UDP 24454 only.
6. Keep `ONLINE_MODE=true`. A licensed Minecraft: Java Edition account is
   required. Do not add offline/cracked authentication.
7. Do not grant operator access, disable the whitelist, wipe a world, or change
   a seed unless the user explicitly asks.
8. Preserve unrelated worktree changes and untracked artifacts.
9. On client machines, never inspect or print launcher account databases,
   cookies, process command lines, Microsoft tokens, or full unredacted debug
   logs. The player completes Microsoft credentials and MFA in the official
   browser flow.
10. Do not provision, connect, or send operational data to a third-party
    monitoring, analytics, alerting, or observability service without the
    owner's explicit approval for that specific service. Prefer local checks
    and system logs by default.

## Inputs and external gates

Discover existing configuration first. Generate new RCON and Better Auth
secrets locally with `openssl rand` only when they do not already exist, using
`umask 077`. Never rotate existing secrets during an ordinary deploy.

Only ask the user for inputs that cannot be discovered or generated:

- SSH/console access to the target host, if the agent is not already on it.
- DNS control if `mc.xpr.im` does not point to the target public IP.
- At least one owner email for `AUTH_ADMIN_EMAILS`.
- Google OAuth client ID and secret. Discord and Microsoft are optional but
  should be configured when credentials already exist.
- Optional OCI Object Storage write-only PAR URL.

OAuth Web redirect URIs are:

- `https://mc.xpr.im/api/auth/callback/google`
- `https://mc.xpr.im/api/auth/callback/discord`
- `https://mc.xpr.im/api/auth/callback/microsoft`

Continue all independent setup while waiting for an external input. Local
backups and the game server must not be blocked on optional off-site backup or
OAuth providers.

## Fresh-host procedure

### 1. Preflight

Confirm the target and record non-secret facts:

```sh
uname -a
cat /etc/os-release
nproc
free -h
df -h /
ss -lntup
```

The tuned production profile expects roughly 8 fast vCPUs, 20 GB RAM, and
200 GB NVMe. If the machine is smaller, reduce the Java heap rather than
allowing the host to swap heavily. Leave at least 4 GB outside the Java heap
for the OS, Docker, BlueMap, backups, and the portal.

On a fresh Ubuntu 24.04 host, inspect and then run
`scripts/bootstrap-astrol-mc.sh` as root. It installs Docker Engine and Compose,
creates service accounts and directories, configures unattended security
updates, and opens only the intended firewall ports. Adapt the package-manager
steps on another distribution; do not blindly run an Ubuntu script there.

### 2. Prepare the repository and directories

Install `git-lfs`, run `git lfs pull`, and verify that
`modpacks/aeronautics-1.21.1/pack/Friends-MC-1.1.3.mrpack` is a real ZIP archive,
not a Git LFS pointer. Verify its SHA-256 against `pack/README.md`.

Create persistent directories owned by the chosen Minecraft service UID/GID:

```sh
install -d /srv/minecraft/aeronautics/data
install -d /srv/minecraft/aeronautics/backups
install -d /srv/minecraft/aeronautics/backup-staging
```

Copy or sync the game stack without deleting any persistent directory. On an
existing host, deploy only reviewed source/config changes and leave `.env`,
`data/`, `backups/`, and `backup-staging/` untouched.

### 3. Configure secrets

Create `modpacks/aeronautics-1.21.1/.env` from `.env.example` and
`apps/web/.env` from `.env.example`, both mode `0600`.

The game environment needs `HOST_UID`, `HOST_GID`, and `RCON_PASSWORD`. The web
environment needs the Better Auth URL/secret, admin email list, OAuth
credentials, absolute modpack/data/log paths, the Minecraft data GID, and the
same RCON password. Use `MINECRAFT_RCON_HOST=friends-mc`. The Compose file sets
the internal BlueMap URL.

Validate configuration without emitting the expanded environment:

```sh
docker compose -f modpacks/aeronautics-1.21.1/docker-compose.yml config --quiet
docker compose -f apps/web/docker-compose.yml config --quiet
```

### 4. Create shared Docker resources

These operations are idempotent:

```sh
docker network inspect friends_mc_bridge >/dev/null 2>&1 || \
  docker network create friends_mc_bridge
docker volume inspect portal_caddy_data >/dev/null 2>&1 || \
  docker volume create portal_caddy_data
docker volume inspect portal_caddy_config >/dev/null 2>&1 || \
  docker volume create portal_caddy_config
```

### 5. Start Minecraft and backups

Start the game first and wait for its health check instead of relying on a
fixed sleep:

```sh
docker compose -f modpacks/aeronautics-1.21.1/docker-compose.yml \
  up -d mc backups
docker inspect --format '{{.State.Health.Status}}' friends-mc
docker exec friends-mc rcon-cli list
```

For a truly new world using the repository seed, set the intended spawn after
the server becomes healthy:

```sh
docker exec friends-mc rcon-cli setworldspawn 305 161 875
```

Do not run that command for an existing world unless its current spawn is known
to be wrong.

### 6. Finish BlueMap

The first server boot generates `data/config/bluemap/`. Set:

- `accept-download: true` in `core.conf`.
- `render-thread-count: 1` in `core.conf`.
- `player-render-limit: 1` in `plugin.conf`.

Keep only `world.conf` and
`world_twilightforest_twilight_forest.conf` in `config/bluemap/maps/`; move the
other generated map configs to `config/bluemap/maps-disabled/` so the change is
reversible. Then run:

```sh
docker exec friends-mc rcon-cli bluemap reload
docker exec friends-mc rcon-cli bluemap
```

Wait for both maps to report updated. BlueMap warnings about missing Twilight
Forest biome registry colors are currently non-fatal; investigate only if a
map fails or terrain is absent.

### 7. Start the authenticated portal

Before deployment, run:

```sh
pnpm install --frozen-lockfile
pnpm --filter @mc/web format
pnpm --filter @mc/web lint
pnpm --filter @mc/web typecheck
pnpm --filter @mc/web test
pnpm --filter @mc/web build
```

Then start the web Compose project with `docker compose up -d --build`. Caddy
will obtain HTTPS after DNS reaches the host. Do not expose the Hono or BlueMap
ports directly.

### 8. Backups and monitoring

Local backups are mandatory. Confirm the backup container is running and that
a recent `.tar.zst` exists. Run `scripts/verify-backup-restore.sh` after the
first archive is available.

If an OCI PAR URL exists, enable the `offsite` Compose profile and confirm the
upload marker updates without printing the URL. Install the local healthcheck
script and systemd units described in the game README, then confirm the timer
and last run in the system journal. Do not add external heartbeat or alerting
services unless the owner explicitly requests one. A missing optional backup
URL is an explicit follow-up, not a reason to leave the base server unfinished.

Chunky pre-generation must run only while the server is empty. Use the included
`chunky-idle-pregen.sh` with a bounded systemd runtime and pause immediately when
a player joins.

## Existing-host updates

1. Inspect `git status`, running containers, player count, disk, memory, and the
   newest backup before changing anything.
2. Test locally before syncing source.
3. For portal-only changes, rebuild only `web`; do not restart Minecraft.
4. For game Compose or mod changes, run `save-all flush`, then recreate only
   `mc` and wait for health. Confirm backups reconnect afterward.
5. Use RCON for whitelist, ban, operator, gamerule, and BlueMap operations; they
   do not normally require downtime.
6. After a pack release, update the `.mrpack`, its checksums/docs, Compose
   filename, portal `PACK_VERSION`, default `MODPACK_PATH`, tests, and changelog
   together. Never leave server and client versions mismatched.
7. Commit and push only reviewed project files. Never add `.env`, runtime data,
   auth databases, rendered BlueMap data, backups, logs, or temporary artifacts.

## Player-client requests

If the user asks to install or validate the client on the current computer:

1. Confirm it is a graphical Windows, macOS, or Linux machine with enough free
   disk and memory. A headless server cannot complete gameplay validation.
2. Detect an existing SKlauncher and Friends MC instance before installing
   anything. Do not delete or replace another launcher unless explicitly asked.
3. Download SKlauncher only from `skmedix.pl` or `next.skmedix.pl`. Prefer the
   stable channel unless the user asks for SKlauncher 4 beta or the stable build
   cannot import the pack. Use normal OS installation/approval flows; do not
   bypass Gatekeeper, SmartScreen, signatures, or malware protections.
4. Obtain `Friends-MC-1.1.3.mrpack` from the authenticated portal or Git LFS,
   verify the SHA-256 from `pack/README.md`, and import it into an isolated
   instance named `Friends MC 1.1.3`.
5. Use 64-bit Java 21 (SKlauncher may manage it), 1 GB initial heap and 10 GB
   maximum heap on computers with at least 16 GB RAM. Follow the lower-memory
   limits and update procedure in `CLIENT-SETUP.md` on smaller machines.
6. Let the user finish Microsoft OAuth for an account that owns Minecraft: Java
   Edition. Never use an offline account; production has online mode enabled.
7. Launch once and wait patiently through first-run downloads. Then join
   `mc.xpr.im`, test Xaero's minimap/world map, Simple Voice Chat, and a short
   movement/rendering session, and inspect only redacted log excerpts.
8. Record pass/fail evidence in `CLIENT-VALIDATION.md` without claiming checks
   that were not actually run.

## Acceptance checks

A setup is complete only after all applicable checks pass:

- `friends-mc` and `friends-mc-web` are healthy; backup and Caddy containers are
  running.
- RCON `list` succeeds and the game log has no fatal startup exception.
- TCP 25565 and UDP 24454 are listening; RCON and 8100 have no host binding.
- `https://mc.xpr.im/api/health` returns `{"ok":true}`.
- A logged-out request to `/map/` redirects to portal sign-in, while an approved
  session loads BlueMap and real map tiles.
- BlueMap reports one idle/running render thread and both intended maps.
- The portal login, modpack download, navigation, mod list, and admin access
  controls work in a real browser.
- A local backup exists and, when configured, the off-site marker is fresh.
- Disk, memory, and CPU headroom are reasonable after the initial map render.

Report the public URLs, health state, backup state, deployed Git commit, and any
optional credential/DNS follow-up. Do not include secrets in the report.
