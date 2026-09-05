# Client validation

Last run: September 3, 2026

## Pack 1.2.0 compatibility validation — September 5, 2026

- All six changed Modrinth downloads were fetched and matched their pinned
  SHA-512 hashes.
- The 1.2.0 pack contains 205 client mods and a single JEI version.
- A fresh production backup was restored and booted against 1.2.0 in an
  isolated container without stopping the live server.
- The restored production world reached `Done` in 33.995 seconds, responded to
  RCON, and completed `save-all flush` with Sophisticated Backpacks, its Create
  integration, Waystones, Sophisticated Core, Balm, and updated JEI installed.
- A fresh client instance should still be imported rather than copying the new
  JARs into an existing instance manually.

## Tested configuration

- Apple Silicon Mac mini (M4, 24 GB RAM)
- SKlauncher 3.2.18 with a licensed Microsoft/Minecraft account
- Minecraft 1.21.1
- NeoForge 21.1.248
- Friends MC 1.1.1 with 199 client mod JARs
- 1 GB initial / 10 GB maximum Java heap
- Server: `mc.xpr.im:25565`

## Passed

- The client pack installs into an isolated launcher instance.
- NeoForge and all required libraries download successfully.
- The 1.1.1 client reaches the main menu in about 89 seconds on its first
  launch with The Twilight Forest, Twilight Flavors & Delight, and the
  TwilightForest Thread Safety Addon loaded.
- A clean 1.1.1 server staging install reaches `Done` in about 14 seconds.
- A forced Twilight Forest chunk loads successfully, and a 128-block Chunky
  smoke run completes 289 chunks without a crash.
- The client completes the full mod registry/config synchronization with the
  production server.
- The licensed player authenticates and enters the production world.
- The running JVM reports a 10 GiB maximum heap, and the client completes a
  production login without the 8 GiB login-time out-of-memory failure.
- Simple Voice Chat completes its UDP authentication and connection check on
  port 24454.
- The production client changes from the Overworld to
  `twilightforest:twilight_forest`, renders the dimension, and returns to the
  original Overworld position without a disconnect or crash.
- Portal chat works in both directions: an in-game player message appears on
  the authenticated website, and a website message appears in the live
  Minecraft chat overlay.
- The server remains healthy during login and uses about 9.5 GiB of its 14 GiB
  maximum Java heap.

## Fixes made during validation

- Changed the bundled `servers.dat` from gzip-compressed NBT to the uncompressed
  format Minecraft 1.21.1 reads. The Friends MC server now appears without
  requiring Direct Connect.
- Raised the recommended client maximum heap to 10 GB. An 8 GB client reached
  the main menu but ran out of memory during one production login; SKlauncher's
  per-installation memory setting must be used because it rewrites the standard
  launcher profile file.
- Added a bounded idle-only Chunky runner. It waits for zero players, pauses
  within 30 seconds of a join, and pauses again when its runtime window ends.
- Changed local backups to archive an rsync-staged copy instead of the live data
  mount, preventing the recurring `world: file changed as we read it` failure.
- Completed an isolated restore drill against a fresh production archive. The
  restored world reached `Done`, responded through RCON, and completed a forced
  save without touching the live server. See `RESTORE-DRILL.md`.

## Known, non-blocking warnings

- Initial login briefly pushed the server about three seconds behind. A later
  live exploration check with one player also produced two 10–13 second tick
  stalls while new terrain was being generated. The host retained CPU and
  memory headroom, so chunk generation—not machine-wide resource pressure—is
  the current performance watch item.
- Several content/integration mods report missing optional models, textures,
  mixin targets, or an outdated Patchouli book. They did not prevent startup or
  connection.
- Flywheel falls back to its standard instancing backend on this Mac. Rendering
  still initializes successfully.
- macOS microphone permission is still required before this client can transmit
  voice. Voice Chat itself connects successfully without it.
- MCA Reborn shows one-time character and spawn setup screens after the player
  is already live in the world. Complete them promptly because mobs can damage
  the player while those dialogs are open.

## Follow-up watch items

- Recheck join-time tick delay with several simultaneous players.
- Keep the 1,000-block spawn-radius Chunky cache current after major worldgen
  changes before deciding whether a larger generated radius is worthwhile.
- Keep an eye on client heap use during long exploration sessions; 10 GB is the
  recommended setting for machines with at least 16 GB of total RAM.
- Repeat the isolated restore drill after major pack or backup changes, and
  periodically download an OCI copy for the same test.
