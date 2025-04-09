import { Mod } from "./types";

export const INCOMPATIBLE_MODS = [
  "Choice Theorem's Overhauled Villages",
] as const;

export const mods: Mod[] = [
  {
    name: "Visual Workbench",
    environment: "both",
    previewUrl: "https://modrinth.com/mod/visual-workbench",
    fileUrl:
      "https://cdn.modrinth.com/data/kfqD1JRw/versions/e78502KA/VisualWorkbench-v21.1.0-1.21.1-NeoForge.jar",
  },
  {
    name: "Sit",
    environment: "both",
    previewUrl: "https://modrinth.com/mod/bl4cks-sit",
    fileUrl:
      "https://cdn.modrinth.com/data/VKXzIykF/versions/m7X4wswO/sit-1.21-1.3.5.jar",
  },

  // Client-side only
  {
    name: "3D Skin Layers",
    environment: "client",
    previewUrl: "https://modrinth.com/mod/3dskinlayers",
    fileUrl:
      "https://cdn.modrinth.com/data/zV5r3pPn/versions/IRvSpWaX/skinlayers3d-neoforge-1.7.5-mc1.21.jar",
  },
  {
    name: "Sound Physics Remastered",
    environment: "client",
    previewUrl: "https://modrinth.com/mod/sound-physics-remastered",
    fileUrl:
      "https://cdn.modrinth.com/data/qyVF9oeo/versions/xhIsCIPl/sound-physics-remastered-neoforge-1.21.1-1.4.12.jar",
  },
  {
    name: "Chat Heads",
    environment: "client",
    previewUrl: "https://modrinth.com/mod/chat-heads",
    fileUrl:
      "https://cdn.modrinth.com/data/Wb5oqrBJ/versions/iSJZlVit/chat_heads-0.13.13-neoforge-1.21.jar",
  },
  {
    name: "Legendary Tooltips",
    environment: "client",
    previewUrl: "https://modrinth.com/mod/legendary-tooltips",
    fileUrl:
      "https://cdn.modrinth.com/data/atHH8NyV/versions/BabRJO04/LegendaryTooltips-1.21.1-neoforge-1.5.5.jar",
  },

  // Simple Voice Chat mods
  {
    name: "Simple Voice Chat",
    environment: "both",
    previewUrl: "https://modrinth.com/plugin/simple-voice-chat",
    fileUrl:
      "https://cdn.modrinth.com/data/9eGKb6K1/versions/XIkkFeGA/voicechat-neoforge-1.21.1-2.5.29.jar",
  },

  // HUD stuff
  {
    name: "AppleSkin",
    environment: "both",
    previewUrl: "https://modrinth.com/mod/appleskin",
    fileUrl:
      "https://cdn.modrinth.com/data/EsAfCjCV/versions/oy4bhPTN/appleskin-neoforge-mc1.21-3.0.5.jar",
  },
  {
    name: "Roughly Enough Items (REI)",
    environment: "client",
    previewUrl: "https://modrinth.com/mod/rei",
    fileUrl:
      "https://cdn.modrinth.com/data/nfn13YXA/versions/b8gfS9Je/RoughlyEnoughItems-16.0.799-neoforge.jar",
  },
  {
    name: "Jade 🔍",
    environment: "both",
    previewUrl: "https://modrinth.com/mod/jade",
    fileUrl:
      "https://cdn.modrinth.com/data/nvQzSEkH/versions/jBPaSUDN/Jade-1.21.1-NeoForge-15.10.0.jar",
  },

  // Collective mods
  {
    name: "Collective",
    environment: "both",
    previewUrl: "https://modrinth.com/mod/collective",
    fileUrl:
      "https://cdn.modrinth.com/data/e0M1UDsY/versions/1Zu68XS4/collective-1.21.1-8.1.jar",
  },
  {
    name: "Softer Hay Bales",
    environment: "server",
    previewUrl: "https://modrinth.com/mod/softer-hay-bales",
    fileUrl:
      "https://cdn.modrinth.com/data/RtmujAUl/versions/RnWSv8yZ/softerhaybales-1.21.1-3.4.jar",
  },
  {
    name: "Fish On The Line",
    environment: "server",
    previewUrl: "https://modrinth.com/mod/fish-on-the-line",
    fileUrl:
      "https://cdn.modrinth.com/data/R6PYx1PW/versions/yiFf7cwg/fishontheline-1.21.1-3.5.jar",
  },
  {
    name: "Grabby Mobs",
    environment: "server",
    previewUrl: "https://modrinth.com/mod/grabby-mobs",
    fileUrl:
      "https://cdn.modrinth.com/data/O6Sh7btX/versions/a40un6os/grabbymobs-1.21.1-1.6.jar",
  },
  {
    name: "Villager Names",
    environment: "server",
    previewUrl: "https://modrinth.com/mod/villager-names-serilum",
    fileUrl:
      "https://cdn.modrinth.com/data/gqRXDo8B/versions/MTjxRIUz/villagernames-1.21.1-8.2.jar",
  },

  {
    name: "NetherPortalFix",
    environment: "server",
    previewUrl: "https://modrinth.com/mod/netherportalfix",
    fileUrl:
      "https://cdn.modrinth.com/data/nPZr02ET/versions/O09BGtgh/netherportalfix-neoforge-1.21.1-21.1.1.jar",
  },

  // Items
  {
    name: "Nature's Compass",
    environment: "both",
    previewUrl: "https://modrinth.com/mod/natures-compass",
    fileUrl:
      "https://cdn.modrinth.com/data/fPetb5Kh/versions/AqEmYPpi/NaturesCompass-1.21.1-3.0.3-neoforge.jar",
  },
  {
    name: "More Music Discs",
    environment: "both",
    previewUrl: "https://modrinth.com/mod/more-music-discs",
    fileUrl:
      "https://cdn.modrinth.com/data/pXYChc1a/versions/DUONjFPB/morediscs-1.21.1-0-neoforge.jar",
  },
  {
    name: "Traveler's Backpack",
    environment: "both",
    previewUrl: "https://modrinth.com/mod/travelersbackpack",
    fileUrl:
      "https://cdn.modrinth.com/data/rlloIFEV/versions/vXgcqcJk/travelersbackpack-neoforge-1.21.1-10.1.17.jar",
  },
  {
    name: "Waystones",
    environment: "both",
    previewUrl: "https://modrinth.com/mod/waystones",
    fileUrl:
      "https://cdn.modrinth.com/data/LOpKHB2A/versions/UsjWHpLD/waystones-neoforge-1.21.1-21.1.13.jar",
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
      "https://cdn.modrinth.com/data/lWDHr9jE/versions/W3PK2UDI/tectonic-neoforge-1.21.1-2.4.3.jar",
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
      "https://cdn.modrinth.com/data/KuNKN7d2/versions/nJBE6tif/noisium-neoforge-2.3.0%2Bmc1.21-1.21.1.jar",
  },

  // Utility mods
  {
    name: "Chunky",
    environment: "server",
    previewUrl: "https://modrinth.com/plugin/chunky",
    fileUrl:
      "https://cdn.modrinth.com/data/fALzjamp/versions/LuFhm4eU/Chunky-NeoForge-1.4.23.jar",
  },

  // Core/Dev API mods
  {
    name: "Architectury API",
    environment: "both",
    previewUrl: "https://modrinth.com/mod/architectury-api",
    fileUrl:
      "https://cdn.modrinth.com/data/lhGA9TYQ/versions/ZxYGwlk0/architectury-13.0.8-neoforge.jar",
  },
  {
    name: "Cloth Config API",
    environment: "both",
    previewUrl: "https://modrinth.com/mod/cloth-config",
    fileUrl:
      "https://cdn.modrinth.com/data/9s6osm5g/versions/izKINKFg/cloth-config-15.0.140-neoforge.jar",
  },
  {
    name: "Balm",
    environment: "both",
    previewUrl: "https://modrinth.com/mod/balm",
    fileUrl:
      "https://cdn.modrinth.com/data/MBAkmtvl/versions/lKZ9zlPP/balm-neoforge-1.21.1-21.0.38.jar",
  },
  {
    name: "Puzzles Lib",
    environment: "both",
    previewUrl: "https://modrinth.com/mod/puzzles-lib",
    fileUrl:
      "https://cdn.modrinth.com/data/QAGBst4M/versions/8XnxRpeZ/PuzzlesLib-v21.1.33-1.21.1-NeoForge.jar",
  },
];
