# Restore drill record

## September 6, 2026 — pack 1.3.1

The newest production backup was restored with Friends MC 1.3.1 and Create
Aeronautics 1.3.2 in an isolated container before the live update.

- Archive: `friends-mc-20260906-163841.tar.zst`
- SHA-256: `d0d4d7427887fe272ebcc826d4563d96408016f1a96c9856cbfdbb3e544d1b53`
- Restored world size: `846338972` bytes
- `world/level.dat`: present
- Minecraft startup: reached `Done` in 27.824 seconds
- AutoModpack: hosted the generated payload on the Minecraft port
- RCON: responsive
- Forced save flush: passed
- Live server: remained online and unchanged during the drill

## September 6, 2026 — pack 1.3.0

The newest production backup was restored with Friends MC 1.3.0 and its
prepared AutoModpack client payload in an isolated container while the live
server remained online.

- Archive: `friends-mc-20260905-224049.tar.zst`
- SHA-256: `ee5179f0d6c02b62767c63cb7751c1a8443ab33558e3b230a49e49ac1cb85861`
- Restored world size: `840451838` bytes
- `world/level.dat`: present
- Minecraft startup: reached `Done`
- AutoModpack: hosted the generated payload on the Minecraft port
- RCON: responsive
- Forced save flush: passed
- Live server: not stopped or changed during validation

## September 5, 2026 — pack 1.2.0

The newest production backup was restored with Friends MC 1.2.0 in an isolated
container while the live server remained online.

- Archive: `friends-mc-20260905-211752.tar.zst`
- SHA-256: `46f03f47bb8ea18d9dcc2a11a7d7cb55039a27a0e6c93b6cba95fb70eb09f630`
- Restored world size: `806164454` bytes
- `world/level.dat`: present
- Minecraft startup: reached `Done` in 33.995 seconds
- Sophisticated Backpacks, its Create integration, and Waystones: loaded
- RCON: responsive
- Forced save flush: passed
- Live server: not stopped or changed during validation

## September 3, 2026

The newest production backup was restored and booted in an isolated temporary
container without stopping or modifying the live server.

- Archive: `friends-mc-20260903-221616.tar.zst`
- SHA-256: `79207c461a942d69b8e94cab88d6a2b4486b50248eb311d652492a2aacdaa925`
- Restored world size: `304496830` bytes
- `world/level.dat`: present
- Minecraft startup: reached `Done` in 29.831 seconds
- RCON: responsive
- Forced save flush: passed
- Temporary container and restored files: removed after validation

### Finding and fix

The first drill caught a real recovery defect. Earlier incremental staging kept
NeoForge install markers while JAR files were intentionally excluded, so a
restored image skipped installation and could not find BootstrapLauncher. The
backup staging command now uses `--delete-excluded` and excludes reproducible
runtime directories together with their install markers. The restore verifier
also removes those markers from legacy archives before reinstalling the pinned
pack.

The corrected archive was inspected to confirm that runtime files were absent,
then passed the complete isolated boot, RCON, and save test above.

The off-site uploader was also corrected to choose the newest archive by file
modification time instead of lexicographic filename order. The corrected
archive was uploaded to OCI after the drill, and the upload marker was checked
before monitoring was re-enabled.
