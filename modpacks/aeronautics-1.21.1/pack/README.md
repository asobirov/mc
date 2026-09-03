# Client pack artifact

`Friends-MC-1.1.2.mrpack` is the current client and server pack. It is tracked
with Git LFS so a normal clone stays lightweight until pack content is pulled.

- Source: public community mirror of Michael Reeves' August 2026 pack
- Google Drive file ID: `1gRW9r_tR2GAFPpcyJtW4wrB7-UYcokco`
- Friends MC version: `1.1.2`
- SHA-256: `21092270897b3a9e42d98297d6709c4722c6fe35986286698e0661254391a4fa`
- Minecraft: `1.21.1`
- NeoForge: `21.1.248`

This Friends MC build enables the bundled Xaero's Minimap `26.4.2`, retains the
upstream mod list, and adds The Twilight Forest `4.8.3345`, Twilight Flavors &
Delight `3.2.2`, and the TwilightForest Thread Safety Addon `0.1.3`. It also adds
the server to the multiplayer screen and uses the Friends MC name and
description. The installer verifies the hashes declared for all 186 downloaded
files.

The bundled `servers.dat` uses the uncompressed NBT format expected by Minecraft
1.21.1. This was corrected after the September 3 client smoke test found that a
gzip-compressed server list was ignored by the game.
