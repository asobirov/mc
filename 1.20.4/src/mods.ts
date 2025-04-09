import { Mod } from "./types";

export const INCOMPATIBLE_MODS = [
  "Choice Theorem's Overhauled Villages",
] as const;

export const mods: Mod[] = [
  {
    name: "Visual Workbench",
    platform: "fabric",
    environment: "both",
    previewUrl: "https://modrinth.com/mod/visual-workbench",
    fileUrl:
      "https://cdn.modrinth.com/data/kfqD1JRw/versions/vhuwOiNO/VisualWorkbench-v8.0.0-1.20.1-Fabric.jar",
  },
  {
    name: "Sit",
    environment: "both",
    previewUrl: "https://modrinth.com/mod/bl4cks-sit",
    fileUrl:
      "https://cdn.modrinth.com/data/VKXzIykF/versions/VWROLSl8/sit-1.20.1-1.3.5.jar",
  },

  // Client-side only
  {
    name: "3D Skin Layers",
    platform: "fabric",
    environment: "client",
    previewUrl: "https://modrinth.com/mod/3dskinlayers",
    fileUrl:
      "https://cdn.modrinth.com/data/zV5r3pPn/versions/KATG2kI3/skinlayers3d-fabric-1.7.5-mc1.20.1.jar",
  },
  {
    name: "Sound Physics Remastered",
    environment: "client",
    previewUrl: "https://modrinth.com/mod/sound-physics-remastered",
    fileUrl:
      "https://cdn.modrinth.com/data/qyVF9oeo/versions/eQg3x7U0/sound-physics-remastered-neoforge-1.20.4-1.4.5.jar",
  },
  {
    name: "Chat Heads",
    environment: "client",
    previewUrl: "https://modrinth.com/mod/chat-heads",
    fileUrl:
      "https://cdn.modrinth.com/data/Wb5oqrBJ/versions/KovNg7SU/chat_heads-0.13.13-neoforge-1.20.4.jar",
  },
  {
    name: "Falling Leaves (NeoForge/Forge)",
    environment: "client",
    previewUrl: "https://modrinth.com/mod/fallingleavesforge",
    fileUrl:
      "https://cdn.modrinth.com/data/2JAUNCL4/versions/EYKnoDe8/fallingleaves-1.20.4-2.4.0.jar",
  },
  // {
  //   name: "Legendary Tooltips",
  //   environment: "client",
  //   previewUrl: "https://modrinth.com/mod/legendary-tooltips",
  //   fileUrl:
  //     "https://cdn.modrinth.com/data/atHH8NyV/versions/BabRJO04/LegendaryTooltips-1.21.1-neoforge-1.5.5.jar",
  // },

  // Simple Voice Chat mods
  {
    name: "Simple Voice Chat",
    environment: "both",
    previewUrl: "https://modrinth.com/plugin/simple-voice-chat",
    fileUrl:
      "https://cdn.modrinth.com/data/9eGKb6K1/versions/jeXYEbLA/voicechat-neoforge-1.20.4-2.5.22.jar",
  },

  // HUD stuff
  {
    name: "AppleSkin",
    environment: "both",
    previewUrl: "https://modrinth.com/mod/appleskin",
    fileUrl:
      "https://cdn.modrinth.com/data/EsAfCjCV/versions/FupqKtcB/appleskin-neoforge-mc1.20.4-2.5.1.jar",
  },
  {
    name: "Roughly Enough Items (REI)",
    environment: "client",
    previewUrl: "https://modrinth.com/mod/rei",
    fileUrl:
      "https://cdn.modrinth.com/data/nfn13YXA/versions/gkFQCCGy/RoughlyEnoughItems-14.1.786-neoforge.jar",
  },
  {
    name: "Jade 🔍",
    environment: "both",
    previewUrl: "https://modrinth.com/mod/jade",
    fileUrl:
      "https://cdn.modrinth.com/data/nvQzSEkH/versions/9rrZAORZ/Jade-1.20.4-neoforge-13.3.1.jar",
  },
  {
    slug: "bluemap",
    previewUrl: "https://modrinth.com/plugin/bluemap",
  },

  // Collective mods
  {
    name: "Collective",
    environment: "both",
    previewUrl: "https://modrinth.com/mod/collective",
    fileUrl:
      "https://cdn.modrinth.com/data/e0M1UDsY/versions/qXM06FG6/collective-1.20.4-7.64.jar",
  },
  {
    name: "Softer Hay Bales",
    environment: "server",
    previewUrl: "https://modrinth.com/mod/softer-hay-bales",
    fileUrl:
      "https://cdn.modrinth.com/data/RtmujAUl/versions/oTgLquyP/softerhaybales-1.20.4-3.2.jar",
  },
  {
    name: "Fish On The Line",
    environment: "server",
    previewUrl: "https://modrinth.com/mod/fish-on-the-line",
    fileUrl:
      "https://cdn.modrinth.com/data/R6PYx1PW/versions/KJByZJAe/fishontheline-1.20.4-3.2.jar",
  },
  {
    name: "Grabby Mobs",
    environment: "server",
    previewUrl: "https://modrinth.com/mod/grabby-mobs",
    fileUrl:
      "https://cdn.modrinth.com/data/O6Sh7btX/versions/cafS40iZ/grabbymobs-1.20.4-1.5.jar",
  },
  {
    name: "Villager Names",
    environment: "server",
    previewUrl: "https://modrinth.com/mod/villager-names-serilum",
    fileUrl:
      "https://cdn.modrinth.com/data/gqRXDo8B/versions/vZNox0vl/villagernames-1.20.4-7.3.jar",
  },

  {
    name: "NetherPortalFix",
    environment: "server",
    previewUrl: "https://modrinth.com/mod/netherportalfix",
    fileUrl:
      "https://cdn.modrinth.com/data/nPZr02ET/versions/6tDPIRKi/netherportalfix-neoforge-1.20.4-15.0.1.jar",
  },

  // Items
  {
    name: "Nature's Compass",
    environment: "both",
    previewUrl: "https://modrinth.com/mod/natures-compass",
    fileUrl:
      "https://cdn.modrinth.com/data/fPetb5Kh/versions/GfYWHTxk/NaturesCompass-1.20.4-3.0.0-neoforge.jar",
  },
  {
    name: "More Music Discs",
    environment: "both",
    previewUrl: "https://modrinth.com/mod/more-music-discs",
    fileUrl:
      "https://cdn.modrinth.com/data/pXYChc1a/versions/8TfccFsT/morediscs-1.20.4-0-neoforge.jar",
  },
  {
    name: "Traveler's Backpack",
    environment: "both",
    previewUrl: "https://modrinth.com/mod/travelersbackpack",
    fileUrl:
      "https://cdn.modrinth.com/data/rlloIFEV/versions/BNberKGE/travelersbackpack-neoforge-1.20.4-9.4.4.jar",
  },
  {
    name: "Waystones",
    environment: "both",
    previewUrl: "https://modrinth.com/mod/waystones",
    fileUrl:
      "https://cdn.modrinth.com/data/LOpKHB2A/versions/rOTAiTFe/waystones-neoforge-1.20.4-16.0.5.jar",
  },

  // World generation mods
  {
    name: "Terallith",
    environment: "server",
    previewUrl: "https://modrinth.com/datapack/terralith",
    fileUrl:
      "https://cdn.modrinth.com/data/8oi3bsk5/versions/WeYhEb5d/Terralith_1.20.x_v2.5.4.jar",
  },
  {
    name: "Tectonic",
    environment: "server",
    previewUrl: "https://modrinth.com/datapack/tectonic",
    fileUrl:
      "https://cdn.modrinth.com/data/lWDHr9jE/versions/224Rz1Y9/tectonic-neoforge-1.20-2.3.4.jar",
  },
  {
    name: "Tidal Towns",
    environment: "server",
    previewUrl: "https://modrinth.com/datapack/tidal-towns",
    fileUrl:
      "https://cdn.modrinth.com/data/EEIwvQVo/versions/aAa24NQe/tidal-towns-1.3.4.jar",
  },
  {
    slug: "ad-astra",
    previewUrl: "https://modrinth.com/mod/ad-astra",
  },

  // Mobs
  {
    name: "Enderman Overhaul",
    environment: "both",
    previewUrl: "https://modrinth.com/mod/enderman-overhaul",
    fileUrl:
      "https://cdn.modrinth.com/data/Lq6ojcWv/versions/YJg64yl5/endermanoverhaul-neoforge-1.20.4-1.1.8.jar",
  },
  {
    name: "More Mob Variants",
    platform: "fabric",
    environment: "both",
    previewUrl: "https://modrinth.com/mod/more-mob-variants",
    fileUrl:
      "https://cdn.modrinth.com/data/JiEhJ3WG/versions/NifwSjfW/moremobvariants-fabric%2B1.20.4-1.3.1.jar",
  },
  {
    name: "Comforsts",
    environment: "both",
    previewUrl: "https://modrinth.com/mod/comforts",
    fileUrl:
      "https://cdn.modrinth.com/data/SaCpeal4/versions/eXcBRSHm/comforts-neoforge-7.2.2%2B1.20.4.jar",
  },

  // Optimization mods
  {
    name: "Noisium",
    environment: "server",
    previewUrl: "https://modrinth.com/mod/noisium",
    fileUrl:
      "https://cdn.modrinth.com/data/KuNKN7d2/versions/rjcZ5G3m/noisium-neoforge-2.3.0%2Bmc1.20.2-1.20.4.jar",
  },

  // Utility mods
  {
    name: "Chunky",
    environment: "server",
    previewUrl: "https://modrinth.com/plugin/chunky",
    fileUrl:
      "https://cdn.modrinth.com/data/fALzjamp/versions/aA6rXoNB/Chunky-1.3.146.jar",
  },

  // Core/Dev API mods
  {
    name: "Architectury API",
    environment: "both",
    previewUrl: "https://modrinth.com/mod/architectury-api",
    fileUrl:
      "https://cdn.modrinth.com/data/lhGA9TYQ/versions/1ROEGmfO/architectury-11.1.17-neoforge.jar",
  },
  {
    name: "Cloth Config API",
    environment: "both",
    previewUrl: "https://modrinth.com/mod/cloth-config",
    fileUrl:
      "https://cdn.modrinth.com/data/9s6osm5g/versions/gUuDD6aJ/cloth-config-13.0.138-neoforge.jar",
  },
  {
    name: "Balm",
    environment: "both",
    previewUrl: "https://modrinth.com/mod/balm",
    fileUrl:
      "https://cdn.modrinth.com/data/MBAkmtvl/versions/Rr2heMKC/balm-neoforge-1.20.4-9.0.9.jar",
  },
  {
    name: "Puzzles Lib",
    environment: "both",
    previewUrl: "https://modrinth.com/mod/puzzles-lib",
    fileUrl:
      "https://cdn.modrinth.com/data/QAGBst4M/versions/smpYKI3H/PuzzlesLib-v20.4.52-1.20.4-NeoForge.jar",
  },
  {
    name: "Patchouli",
    environment: "both",
    previewUrl: "https://modrinth.com/mod/patchouli",
    fileUrl:
      "https://cdn.modrinth.com/data/nU0bVIaL/versions/f1ECC2xk/Patchouli-1.20.4-85-NEOFORGE.jar",
  },
  {
    name: "Geckolib",
    environment: "both",
    previewUrl: "https://modrinth.com/mod/geckolib",
    fileUrl:
      "https://cdn.modrinth.com/data/8BmcQJ2H/versions/jK2C8NsI/geckolib-neoforge-1.20.4-4.4.4.jar",
  },
  {
    name: "Resourceful Lib",
    environment: "both",
    previewUrl: "https://modrinth.com/mod/resourceful-lib",
    fileUrl:
      "https://cdn.modrinth.com/data/G1hIVOrD/versions/fEbWd9vt/resourcefullib-neoforge-1.20.4-2.4.10.jar",
  },
  {
    name: "Resourceful Config",
    environment: "both",
    previewUrl: "https://modrinth.com/mod/resourceful-config",
    fileUrl:
      "https://cdn.modrinth.com/data/M1953qlQ/versions/ny6XS6Da/resourcefulconfig-neoforge-1.20.4-2.4.8.jar",
  },
  {
    slug: "botarium",
    previewUrl: "https://modrinth.com/mod/botarium",
  },
];
