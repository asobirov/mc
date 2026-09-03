# Restore drill record

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
