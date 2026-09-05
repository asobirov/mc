# Friends MC client setup for agents

Use this runbook when an agent has access to a player's desktop and is asked to
install or update the Friends MC client. Complete as much as the machine allows;
the only expected user interaction is operating-system approval and Microsoft
sign-in/MFA.

## Target state

- Launcher: SKlauncher, in a dedicated instance named `Friends MC 1.2.0`.
- Pack: `Friends-MC-1.2.0.mrpack`.
- Pack SHA-256:
  `ee30130d1f384b82264113d117b25fb80429c9e9b910d83a6f3d6db127f7f587`.
- Minecraft: 1.21.1.
- NeoForge: 21.1.248.
- Java: 64-bit Java 21, preferably SKlauncher's managed runtime.
- Memory on a machine with at least 16 GB RAM: 1 GB initial, 10 GB maximum.
- Server: `mc.xpr.im` (default Minecraft port 25565).
- Voice Chat: UDP 24454.

The pack already contains the mods, dependencies, configs, resources, and
multiplayer server entry. Do not download individual mods or install NeoForge
separately unless pack import itself is broken and the user agrees to a manual
recovery.

## Safety and privacy

1. Do not read or expose launcher account files, browser cookies, keychains,
   credential stores, process command lines, Microsoft tokens, or refresh
   tokens. Never paste a token into a command or chat.
2. Have the player complete the official Microsoft browser flow. The account
   must own Minecraft: Java Edition and must have launched it at least once.
3. Download SKlauncher only from `https://skmedix.pl` (stable) or
   `https://next.skmedix.pl` (4.0 beta). Fake launcher sites are common.
4. Do not disable antivirus, Gatekeeper, SmartScreen, quarantine, or signature
   checks. Ask the user to approve the genuine installer through the normal OS
   UI if the operating system requires it.
5. Use a separate instance directory. Never drop the Friends MC mods into the
   global `.minecraft/mods` directory, where they can corrupt other profiles.
6. Do not delete an older instance during an update. Keep it until the new
   instance has successfully joined the server, then ask before cleanup.
7. Game logs can contain session or access data. Search for relevant error
   lines and redact tokens, home paths, email addresses, UUIDs, and IPs before
   sharing. Never enable launcher debug mode unless ordinary logs are
   insufficient.

## 1. Inspect the computer

Record the OS, CPU architecture, RAM, free disk, and GPU. Check whether
SKlauncher and a Friends MC instance already exist before downloading.

Recommended minimum for this pack:

| Computer RAM    | Client maximum heap | Guidance                                                     |
| --------------- | ------------------: | ------------------------------------------------------------ |
| 24 GB or more   |               10 GB | Preferred and validated                                      |
| 16 GB           |             8–10 GB | Start at 10 GB; lower to 8 GB if the OS is pressured         |
| 12 GB           |                7 GB | Marginal; close other apps and warn about join-time OOM risk |
| Less than 12 GB |                   — | Do not promise a smooth experience; recommend an upgrade     |

Keep at least 15 GB of free disk before import. Do not allocate nearly all
system RAM to Java; the OS, launcher, native rendering, and integrated GPU may
need several gigabytes outside the heap.

On SKlauncher 3.2, installations normally live under the standard Minecraft
directory. Common roots are `%APPDATA%\.minecraft` on Windows,
`~/.minecraft` on Linux, and `~/Library/Application Support/minecraft` on
macOS. Paths may be customized. In every version, prefer the launcher's “Open
installation/instance directory” action instead of guessing a path.

## 2. Obtain and verify the pack

Preferred source for a player is the Download button at
`https://mc.xpr.im`, after their portal account is approved. An agent working
from this repository may instead run `git lfs pull` and use:

```text
modpacks/aeronautics-1.21.1/pack/Friends-MC-1.2.0.mrpack
```

Verify before import:

- macOS/Linux: `shasum -a 256 <file>` or `sha256sum <file>`.
- Windows PowerShell: `Get-FileHash -Algorithm SHA256 <file>`.

Stop if the checksum differs, the file is a small Git LFS pointer, or it does
not open as a ZIP archive. Redownload from the trusted source; do not repair or
silently substitute files.

## 3. Install SKlauncher

Use stable SKlauncher when it can import the local `.mrpack`. Use SKlauncher 4
only when the user chose it or the stable import path is unavailable; 4.0 is
currently a beta.

- Windows: use the official Setup installer. It includes the launcher runtime.
- macOS: use the official `.dmg`/app for the machine architecture.
- Linux: use the official build for the architecture. SKlauncher 4 provides an
  x86_64 AppImage; do not assume it runs on ARM Linux.

Launch it once. If Java must be selected manually, use a trusted 64-bit Java 21
runtime. SKlauncher 4 manages the correct game Java per instance by default.

Do not install Prism Launcher as a fallback without asking—the owner prefers
SKlauncher. Do not uninstall an existing launcher unless explicitly requested.

## 4. Sign in correctly

Choose **Login with Microsoft**, which opens Microsoft's official page in the
default browser. Ask the player to complete the credentials and MFA themselves.
Use the account that owns Minecraft: Java Edition. An SKlauncher or offline
account cannot join this production server because `online-mode=true`.

Confirm only that the launcher shows a licensed Microsoft Minecraft profile.
Do not inspect how its token is stored.

## 5. Import the modpack

Create a new isolated instance by importing the verified
`Friends-MC-1.2.0.mrpack` file. Depending on the SKlauncher version, use
**Import**, **Import Modpack**, drag the `.mrpack` into the Library, or use the
Installations Manager's local-file import.

Set:

- Name: `Friends MC 1.2.0`.
- Dedicated game/instance directory: enabled.
- Java: managed Java 21 or a known 64-bit Java 21 executable.
- Initial heap: 1 GB.
- Maximum heap: follow the RAM table above; 10 GB is the validated target.

Do not copy an older instance's `mods`, `libraries`, or entire `config` folder
over the new import. That defeats the pack manifest and commonly leaves stale
mods. The pack supplies all declared files and verifies 191 downloads.

The imported client should include Xaero's Minimap and Xaero's World Map,
Simple Voice Chat, the cooking/fishing content, Create/Aeronautics content, and
Twilight Forest additions. BlueMap must not appear in the client mod directory;
it is server-side and viewed at `https://mc.xpr.im/map/`.

## 6. Preserve player settings during an update

For an existing working instance, import the new pack as a new instance first.
After it launches, copy only player-owned data that is safe and wanted:

- screenshots;
- Xaero waypoints/minimap data;
- selected keybind and accessibility settings, preferably by reproducing them
  in-game rather than replacing the whole `options.txt` blindly;
- local single-player saves only when the user asks.

Do not copy old mods, loader libraries, crash reports, caches, or bulk configs.
Keep the old instance until production login passes.

## 7. First launch

Launch the Friends MC instance and keep the launcher/game output visible. The
first run downloads libraries and compiles/loading mod resources; on the
validated Apple Silicon Mac it took about 90 seconds to reach the main menu.
Do not kill it merely because it appears quiet for a minute.

Confirm from the UI or sanitized log lines:

- Minecraft 1.21.1.
- NeoForge 21.1.248.
- Friends MC instance uses the configured heap.
- No fatal loader error, duplicate mod, missing required dependency, or
  out-of-memory error.

Known non-blocking warnings are documented in `CLIENT-VALIDATION.md`. Treat a
crash, failed dependency resolution, safe-mode data-pack prompt, registry-sync
failure, or rejected server handshake as blocking.

## 8. Configure and test

Use conservative settings for the first test: no shaders, a 10–12 chunk client
render distance, and ordinary graphics. Optimization can happen after a clean
join.

Join the preconfigured **Friends MC** multiplayer entry. If it is missing, add
`mc.xpr.im` manually. Then verify:

1. The player enters the world without a registry/mod mismatch.
2. Move and look around for several minutes; load a few nearby chunks and watch
   for stalls, graphical corruption, or memory pressure.
3. Xaero's minimap is visible. Press `M` to test the full-screen world map and
   use its in-game keybind/settings screen if `M` was changed.
4. Press `V` to open Simple Voice Chat settings. Confirm its connection icon or
   sanitized log entry reports a successful UDP connection. On macOS/Windows,
   request microphone permission through the normal OS prompt before testing
   transmission.
5. Open the inventory/recipe viewer and confirm the main content groups load.
6. If safe and authorized, briefly enter Twilight Forest or another modded area
   to exercise dimension synchronization; return the player afterward.
7. Confirm the browser BlueMap separately at `https://mc.xpr.im/map/`. It does
   not replace Xaero's in-game maps.

MCA Reborn may show first-time character/spawn dialogs after the player is
already vulnerable in-world. Complete them promptly or have another trusted
player protect the spawn area.

## 9. Log review and completion

Use the instance's `logs/latest.log` and crash reports. Prefer targeted searches
for `FATAL`, `ERROR`, `Exception`, `OutOfMemory`, `Failed to`, registry sync,
voice chat, and connection messages. Avoid printing the entire log, launcher
database, environment, or game process arguments.

Update `CLIENT-VALIDATION.md` with:

- date, OS/hardware, launcher version, pack version, Java, and heap;
- time to main menu;
- whether production join, movement, minimap, world map, voice connection, and
  Twilight/dimension checks passed;
- only relevant redacted warnings or failures and the fix applied.

The client setup is complete when the new isolated instance launches, joins the
production server with the licensed Microsoft account, renders normally, shows
the in-game maps, connects Simple Voice Chat, and retains reasonable memory
headroom. Leave SKlauncher closed or at the Friends MC instance page when done,
according to the user's preference.
