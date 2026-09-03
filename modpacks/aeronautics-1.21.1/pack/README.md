# Client pack artifact

`Friends-MC-1.0.1.mrpack` is the current client and server pack. It is tracked
with Git LFS so a normal clone stays lightweight until pack content is pulled.

- Source: public community mirror of Michael Reeves' August 2026 pack
- Google Drive file ID: `1gRW9r_tR2GAFPpcyJtW4wrB7-UYcokco`
- Friends MC version: `1.0.1`
- SHA-256: `c47a058fc6f43140ef05c7fd7be0e12f87cd8c44f124282555b965a735fb91ca`
- Minecraft: `1.21.1`
- NeoForge: `21.1.248`

This Friends MC build retains the upstream mod list, adds the server to the
multiplayer screen, and uses the Friends MC name and description. The installer
still verifies the hashes declared for all 183 Modrinth-hosted files.

The bundled `servers.dat` uses the uncompressed NBT format expected by Minecraft
1.21.1. This was corrected after the September 3 client smoke test found that a
gzip-compressed server list was ignored by the game.
