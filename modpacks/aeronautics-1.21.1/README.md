# Friends MC — Aeronautics 1.21.1

Docker deployment for the custom NeoForge pack used as the baseline for the
friends server.

## Host sizing

- 8 fast vCores
- 20 GB RAM
- 200 GB NVMe
- Java heap: 8 GB initial / 14 GB maximum

## Start

1. Copy `.env.example` to `.env` and replace the RCON secret.
2. Pull Git LFS content so `pack/Friends-MC-1.1.3.mrpack` is present, then
   verify its SHA-256 against `pack/README.md`.
3. Set `HOST_UID` and `HOST_GID` to the host account's IDs, then create writable
   `data/` and `backups/` directories owned by that account.
4. Start the server and local backups:

   ```sh
   docker compose up -d mc backups
   ```

5. After configuring the OCI pre-authenticated upload URL, start the daily
   off-site uploader:

   ```sh
   docker compose --profile offsite up -d
   ```

Local backups run every six hours and retain four archives. Each job pauses
Minecraft saves, incrementally stages the stateful data, resumes saves, and
archives the stable staged copy. Reproducible runtime files such as mods,
libraries, and NeoForge install markers are excluded together; the restore
drill reinstalls them from the pinned modpack. This avoids inconsistent
archives and half-installed restores while keeping archives compact. OCI
lifecycle rules provide the separate short-retention cloud layer.

## Restore drill

The restore verifier extracts the newest backup into a temporary directory,
performs a clean modpack and NeoForge install, boots the restored world in an
isolated container with no published ports, checks RCON, flushes a save, then
removes the temporary container and files. It does not stop or change the live
server:

```sh
sudo ./scripts/verify-backup-restore.sh
```

## Monitoring

`friends-mc-healthcheck.sh` checks the Minecraft container, portal HTTPS,
Minecraft TCP, Voice Chat UDP listener, disk usage, local backup freshness, and
off-site upload freshness. The systemd timer runs it every five minutes and
reports start, success, or failure to an external Healthchecks.io heartbeat,
which also detects a total VPS outage by noticing missed pings.

Install the script and the two units under `systemd/`, store the private ping
URL as `HEALTHCHECKS_PING_URL=...` in
`/etc/friends-mc-healthcheck.env` with mode `0600`, then enable the timer:

```sh
sudo systemctl daemon-reload
sudo systemctl enable --now friends-mc-healthcheck.timer
```

## Idle chunk pre-generation

`scripts/chunky-idle-pregen.sh` runs the selection already configured in
Chunky only while the server is empty. It checks every 30 seconds, pauses when
a player joins, and also pauses when its runtime window ends. Run it as a
bounded systemd service so it cannot overlap a planned backup window:

```sh
systemd-run \
  --unit=friends-mc-idle-pregen \
  --property=RuntimeMaxSec=2h50m \
  /usr/local/sbin/friends-mc-idle-pregen
```

## Deliberate compatibility changes

The community `.mrpack` incorrectly marks client rendering/UI mods as required
on the server. The Compose file excludes those. It also excludes YUNG's Better
End Island because that mod and BetterEnd conflict during End generation in
the original pack.

Friends MC `1.1.3` enables Xaero's Minimap `26.4.2` alongside the existing
world map and renders MCA entities as radar dots instead of incompatible
magenta icons. It retains the Friends MC `1.1.1` additions: The Twilight Forest
`4.8.3345`, Twilight Flavors &
Delight `3.2.2`, and the TwilightForest Thread Safety Addon `0.1.3`. The
thread-safety add-on is maintained by C2ME's author and keeps Twilight
generation compatible with the pack's concurrent world-generation paths.

The live world uses seed `-6489917970872425602` with spawn moved to the scenic
Tectonic/Terralith land around `305, 161, 875`, avoiding the ocean-heavy initial
test world.

BlueMap 5.7 is pinned as a server-only Modrinth project. It is not part of the
client `.mrpack` and its port 8100 is exposed only to the private portal Docker
network. On first boot, accept the Mojang client-resource download in
`data/config/bluemap/core.conf`, set `render-thread-count: 1`, and set
`player-render-limit: 1` in `plugin.conf`. The live deployment renders the
Overworld and Twilight Forest only; the other generated map configs are kept in
`config/bluemap/maps-disabled/` to avoid unnecessary CPU and storage use. Apply
configuration changes with `docker exec friends-mc rcon-cli bluemap reload`.

Reliquified Twilight Forest was evaluated but intentionally left out: it needs
the separate original Relics mod, while this pack already includes the
unrelated Relics (RPG Series). Installing both would add a second overlapping
relic system solely to support one integration add-on.
