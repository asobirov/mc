# Client pack artifact

`Friends-MC-1.1.3.mrpack` is the current client and server pack. It is tracked
with Git LFS so a normal clone stays lightweight until pack content is pulled.

- Source: public community mirror of Michael Reeves' August 2026 pack
- Google Drive file ID: `1gRW9r_tR2GAFPpcyJtW4wrB7-UYcokco`
- Friends MC version: `1.1.3`
- SHA-256: `3fd930f1cc059a63334acb750b8d1f4bcf35711be59427afc4cda1e630efda3b`
- Minecraft: `1.21.1`
- NeoForge: `21.1.248`

This Friends MC build configures the bundled Xaero's Minimap `26.4.2` to show
MCA villagers and other dynamically rendered MCA entities as clean radar dots
instead of magenta fallback icons. Player tracking and supported mob icons are
unchanged. It retains the upstream mod list, The Twilight Forest `4.8.3345`,
Twilight Flavors & Delight `3.2.2`, and the TwilightForest Thread Safety Addon
`0.1.3`. It also adds the server to the multiplayer screen and uses the Friends
MC name and description. The installer verifies the hashes declared for all
186 downloaded files.

Rebuild this release from 1.1.2 and the checked-in client override with:

```sh
./scripts/build-client-pack.sh
```

The bundled `servers.dat` uses the uncompressed NBT format expected by Minecraft
1.21.1. This was corrected after the September 3 client smoke test found that a
gzip-compressed server list was ignored by the game.
