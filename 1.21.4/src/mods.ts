import { Mod } from "./types";

export const INCOMPATIBLE_MODS = ["Choice Theorem's Overhauled Villages"] as const;

// TODO: downgrade to 1.21.1, since many mods are not compatible with 1.21.4

export const mods: Mod[] = [
  {
    name: "Visual Workbench",
    environment: "both",
    previewUrl: "https://modrinth.com/mod/visual-workbench",
    fileUrl:
      "https://cdn.modrinth.com/data/kfqD1JRw/versions/R96kEpJG/VisualWorkbench-v21.4.1-1.21.4-NeoForge.jar",
  },
  {
    name: "Sit",
    environment: "both",
    previewUrl: "https://modrinth.com/mod/sit",
    fileUrl:
      "https://cdn.modrinth.com/data/VKXzIykF/versions/XtroWTJw/sit-1.21.3-1.3.5.jar",
  },

  // Client-side only
  {
    name: "3D Skin Layers",
    environment: "client",
    previewUrl: "https://modrinth.com/mod/3dskinlayers",
    fileUrl:
      "https://cdn.modrinth.com/data/zV5r3pPn/versions/5crjPbYp/skinlayers3d-neoforge-1.7.5-mc1.21.4.jar",
  },
  {
    name: "Sound Physics Remastered",
    environment: "client",
    previewUrl: "https://modrinth.com/mod/sound-physics-remastered",
    fileUrl:
      "https://cdn.modrinth.com/data/qyVF9oeo/versions/4DZBV1Tq/sound-physics-remastered-neoforge-1.21.4-1.4.10.jar",
  },
  {
    name: "Chat Heads",
    environment: "client",
    previewUrl: "https://modrinth.com/mod/chat-heads",
    fileUrl:
      "https://cdn.modrinth.com/data/Wb5oqrBJ/versions/TCClLClr/chat_heads-0.13.14-neoforge-1.21.4.jar",
  },
  {
    name: "Legendary Tooltips",
    environment: "client",
    previewUrl: "https://modrinth.com/mod/legendary-tooltips",
    fileUrl:
      "https://cdn.modrinth.com/data/atHH8NyV/versions/6KgbcZvj/LegendaryTooltips-1.21.4-neoforge-1.5.1.jar",
  },

  // Simple Voice Chat mods
  {
    name: "Simple Voice Chat",
    environment: "both",
    previewUrl: "https://modrinth.com/plugin/simple-voice-chat",
    fileUrl:
      "https://cdn.modrinth.com/data/9eGKb6K1/versions/gdyFeAlC/voicechat-neoforge-1.21.4-2.5.29.jar",
  },

  // HUD stuff
  {
    name: "AppleSkin",
    environment: "both",
    previewUrl: "https://modrinth.com/mod/appleskin",
    fileUrl:
      "https://cdn.modrinth.com/data/EsAfCjCV/versions/c3srhuUU/appleskin-neoforge-mc1.21.3-3.0.6.jar",
  },
  {
    name: "Roughly Enough Items (REI)",
    environment: "client",
    previewUrl: "https://modrinth.com/mod/rei",
    fileUrl:
      "https://cdn.modrinth.com/data/nfn13YXA/versions/H42QXltg/RoughlyEnoughItems-18.0.800-neoforge.jar",
  },
  {
    name: "Jade 🔍",
    environment: "both",
    previewUrl: "https://modrinth.com/mod/jade",
    fileUrl:
      "https://cdn.modrinth.com/data/nvQzSEkH/versions/Rpe14jmy/Jade-1.21.4-NeoForge-17.3.0.jar",
  },

  // Collective mods
  {
    name: "Collective",
    environment: "both",
    previewUrl: "https://modrinth.com/mod/collective",
    fileUrl:
      "https://cdn.modrinth.com/data/e0M1UDsY/versions/F611XL3k/collective-1.21.4-8.1.jar",
  },
  {
    name: "Softer Hay Bales",
    environment: "server",
    previewUrl: "https://modrinth.com/mod/softer-hay-bales",
    fileUrl:
      "https://cdn.modrinth.com/data/RtmujAUl/versions/qqSy16ac/softerhaybales-1.21.4-3.4.jar",
  },
  {
    name: "Fish On The Line",
    environment: "server",
    previewUrl: "https://modrinth.com/mod/fish-on-the-line",
    fileUrl:
      "https://cdn.modrinth.com/data/R6PYx1PW/versions/EmUevo2v/fishontheline-1.21.4-3.5.jar",
  },
  {
    name: "Grabby Mobs",
    environment: "server",
    previewUrl: "https://modrinth.com/mod/grabby-mobs",
    fileUrl:
      "https://cdn.modrinth.com/data/O6Sh7btX/versions/Ozaw5PBm/grabbymobs-1.21.4-1.6.jar",
  },
  {
    name: "Villager Names",
    environment: "server",
    previewUrl: "https://modrinth.com/mod/villager-names-serilum",
    fileUrl:
      "https://cdn.modrinth.com/data/gqRXDo8B/versions/iFR8gK9F/villagernames-1.21.4-8.2.jar",
  },

  {
    name: "NetherPortalFix",
    environment: "server",
    previewUrl: "https://modrinth.com/mod/netherportalfix",
    fileUrl:
      "https://cdn.modrinth.com/data/nPZr02ET/versions/Vs09Rou7/netherportalfix-neoforge-1.21.4-21.4.1.jar",
  },

  // Items
  {
    name: "Nature's Compass",
    environment: "both",
    previewUrl: "https://modrinth.com/mod/natures-compass",
    fileUrl:
      "https://cdn.modrinth.com/data/fPetb5Kh/versions/J03HgGZ8/NaturesCompass-1.21.4-3.0.4-neoforge.jar",
  },
  {
    name: "More Music Discs",
    environment: "both",
    previewUrl: "https://modrinth.com/mod/more-music-discs",
    fileUrl:
      "https://cdn.modrinth.com/data/pXYChc1a/versions/wJwHG2Qf/morediscs-1.21.4-0-neoforge.jar",
  },
  {
    name: "Traveler's Backpack",
    environment: "both",
    previewUrl: "https://modrinth.com/mod/travelersbackpack",
    fileUrl:
      "https://cdn.modrinth.com/data/rlloIFEV/versions/8VfgSYgO/travelersbackpack-neoforge-1.21.4-10.4.7.jar",
  },
  {
    name: "Waystones",
    environment: "both",
    previewUrl: "https://modrinth.com/mod/waystones",
    fileUrl:
      "https://cdn.modrinth.com/data/LOpKHB2A/versions/A0W0G71O/waystones-neoforge-1.21.4-21.4.11.jar",
  },

  // World generation mods
  {
    name: "Terallith",
    environment: "server",
    previewUrl: "https://modrinth.com/datapack/terralith",
    fileUrl:
      "https://cdn.modrinth.com/data/8oi3bsk5/versions/MuJMtPGQ/Terralith_1.21.x_v2.5.8.jar",
  },
  {
    name: "Tectonic",
    environment: "server",
    previewUrl: "https://modrinth.com/datapack/tectonic",
    fileUrl:
      "https://cdn.modrinth.com/data/lWDHr9jE/versions/SEh7nPmu/tectonic-neoforge-1.21.4-2.4.3.jar",
  },
  {
    name: "Tidal Towns",
    environment: "server",
    previewUrl: "https://modrinth.com/datapack/tidal-towns",
    fileUrl:
      "https://cdn.modrinth.com/data/EEIwvQVo/versions/qSePi5HH/tidal-towns-1.3.4.jar",
  },

  // Optimization mods
  {
    name: "Noisium",
    environment: "server",
    previewUrl: "https://modrinth.com/mod/noisium",
    fileUrl:
      "https://cdn.modrinth.com/data/KuNKN7d2/versions/5JoGTWve/noisium-neoforge-2.5.0%2Bmc1.21.4.jar",
  },

  // Utility mods
  {
    name: "Chunky",
    environment: "server",
    previewUrl: "https://modrinth.com/plugin/chunky",
    fileUrl:
      "https://cdn.modrinth.com/data/fALzjamp/versions/D99gXKQD/Chunky-NeoForge-1.4.27.jar",
  },

  // Core/Dev API mods
  {
    name: "Architectury API",
    environment: "both",
    previewUrl: "https://modrinth.com/mod/architectury-api",
    fileUrl:
      "https://cdn.modrinth.com/data/lhGA9TYQ/versions/qOJoTaPQ/architectury-15.0.3-neoforge.jar",
  },
  {
    name: "Cloth Config API",
    environment: "both",
    previewUrl: "https://modrinth.com/mod/cloth-config",
    fileUrl:
      "https://cdn.modrinth.com/data/9s6osm5g/versions/dWfheG9X/cloth-config-17.0.144-neoforge.jar",
  },
  {
    name: "Balm",
    environment: "both",
    previewUrl: "https://modrinth.com/mod/balm",
    fileUrl:
      "https://cdn.modrinth.com/data/MBAkmtvl/versions/LQNvc5wE/balm-neoforge-1.21.4-21.4.26.jar",
  },
  {
    name: "Puzzles Lib",
    environment: "both",
    previewUrl: "https://modrinth.com/mod/puzzles-lib",
    fileUrl:
      "https://cdn.modrinth.com/data/QAGBst4M/versions/PI5mXUeA/PuzzlesLib-v21.4.13-1.21.4-NeoForge.jar",
  },
];
