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
2. Pull Git LFS content so `pack/Friends-MC-1.0.1.mrpack` is present, then
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

Local backups run every six hours and retain four archives. OCI lifecycle
rules provide the separate short-retention cloud layer.

## Deliberate compatibility changes

The community `.mrpack` incorrectly marks client rendering/UI mods as required
on the server. The Compose file excludes those. It also excludes YUNG's Better
End Island because that mod and BetterEnd conflict during End generation in
the original pack.
