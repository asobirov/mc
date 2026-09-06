# Client pack artifact

`Friends-MC-1.3.1.mrpack` is the current client and server pack. It is tracked
with Git LFS so a normal clone stays lightweight until pack content is pulled.

- Source: public community mirror of Michael Reeves' August 2026 pack
- Google Drive file ID: `1gRW9r_tR2GAFPpcyJtW4wrB7-UYcokco`
- Friends MC version: `1.3.1`
- SHA-256: `45efd82f750220b845e2eb1d9f310969706583100b7c9deaecb0d7cf3110186e`
- Minecraft: `1.21.1`
- NeoForge: `21.1.248`

This release updates Create Aeronautics from `1.3.0` to `1.3.2`, whose official
release notes specifically fix JEI integration. It removes the obsolete
`silence_jei.ItemStackListFactoryMixin` that crashed clients after recipe sync
with JEI `19.51.0.418`.

Friends MC `1.3.0` added AutoModpack `4.0.6`. Players import the current pack
once, approve the `mc.xpr.im` certificate fingerprint on first connection, and
then receive only changed files on future launches. The server-side updater
remains pinned and does not self-update. Downloads require the Minecraft
server's online-mode and whitelist authorization; no public pack mirror was
added.

This Friends MC build retains Sophisticated Backpacks `3.25.78`, Waystones
`21.1.42`, and Sophisticated Backpacks Create Integration `0.1.8`. It includes
Sophisticated Core `1.4.90` and Balm `21.0.65`, updates JEI to `19.51.0.418`,
and relies on the existing Xaero and BlueMap native integrations instead of
adding redundant map compatibility mods.

The build retains the bundled Xaero's Minimap `26.4.2` configuration that shows
MCA villagers and other dynamically rendered MCA entities as clean radar dots
instead of magenta fallback icons. Player tracking and supported mob icons are
unchanged. It retains the upstream mod list, The Twilight Forest `4.8.3345`,
Twilight Flavors & Delight `3.2.2`, and the TwilightForest Thread Safety Addon
`0.1.3`. It also adds the server to the multiplayer screen and uses the Friends
MC name and description. The installer verifies the hashes declared for all
192 downloaded files.

Rebuild this release from 1.3.0, the pinned release manifest, and the checked-in
client override with:

```sh
./scripts/build-client-pack.sh
```

The bundled `servers.dat` uses the uncompressed NBT format expected by Minecraft
1.21.1. This was corrected after the September 3 client smoke test found that a
gzip-compressed server list was ignored by the game.
