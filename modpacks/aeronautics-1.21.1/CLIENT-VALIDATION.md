# Client validation

Last run: September 3, 2026

## Tested configuration

- Apple Silicon Mac mini (M4, 24 GB RAM)
- SKlauncher 3.2.18 with a licensed Microsoft/Minecraft account
- Minecraft 1.21.1
- NeoForge 21.1.248
- Friends MC 1.0.1 with 196 mod JARs
- 1 GB initial / 8 GB maximum Java heap
- Server: `mc.xpr.im:25565`

## Passed

- The client pack installs into an isolated launcher instance.
- NeoForge and all required libraries download successfully.
- The game reaches the main menu in about 55 seconds on the first launch.
- The client completes the full mod registry/config synchronization with the
  production server.
- The licensed player authenticates and enters the production world.
- Simple Voice Chat completes its UDP authentication and connection check on
  port 24454.
- The server remains healthy during login and uses about 9.8 GiB of its 14 GiB
  maximum Java heap.

## Fixes made during validation

- Changed the bundled `servers.dat` from gzip-compressed NBT to the uncompressed
  format Minecraft 1.21.1 reads. The Friends MC server now appears without
  requiring Direct Connect.
- Configured the local SKlauncher instance to honor an 8 GB maximum heap instead
  of its conservative 4 GB automatic limit.
- Added a bounded idle-only Chunky runner. It waits for zero players, pauses
  within 30 seconds of a join, and pauses again when its runtime window ends.

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
- Review the 2,500-block idle Chunky run before deciding whether to expand the
  generated radius or enable ServerCore's dynamic limits.
- Keep an eye on client heap use during long exploration sessions; 8 GB is the
  recommended starting point for this pack.
- Local backup archives validate structurally, but the live backup container can
  return a `world: file changed as we read it` warning. Move to a staged-copy or
  snapshot-based backup flow before treating every archive as transactionally
  consistent.
