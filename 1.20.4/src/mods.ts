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
  {
    slug: "distanthorizons",
    previewUrl: "https://modrinth.com/mod/distanthorizons",
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
  {
    slug: "voice-chat-interaction",
    previewUrl: "https://modrinth.com/mod/voice-chat-interaction",
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
    slug: "jei",
    previewUrl: "https://modrinth.com/mod/jei",
  },
  {
    slug: "nerb",
    previewUrl: "https://modrinth.com/mod/nerb",
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
  {
    slug: "travelers-titles",
    previewUrl: "https://modrinth.com/mod/travelers-titles",
  },

  // QoL
  {
    slug: "corpse",
    previewUrl: "https://modrinth.com/mod/corpse",
  },
  {
    slug: "corpse-x-curios-api-compat",
    previewUrl: "https://modrinth.com/mod/corpse-x-curios-api-compat",
  },
  {
    slug: "enchantment-descriptions",
    previewUrl: "https://modrinth.com/mod/enchantment-descriptions",
  },
  {
    slug: "legendary-tooltips",
    previewUrl: "https://modrinth.com/mod/legendary-tooltips",
  },
  {
    slug: "death-knell",
    previewUrl: "https://modrinth.com/mod/death-knell",
  },
  {
    slug: "smarter-farmers-farmers-replant",
    previewUrl: "https://modrinth.com/mod/smarter-farmers-farmers-replant",
  },
  {
    slug: "elytra-slot",
    previewUrl: "https://modrinth.com/mod/elytra-slot",
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
  {
    slug: "macaws-doors",
    previewUrl: "https://modrinth.com/mod/macaws-doors",
  },
  {
    slug: "macaws-fences-and-walls",
    previewUrl: "https://modrinth.com/mod/macaws-fences-and-walls",
  },
  {
    slug: "macaws-furniture",
    previewUrl: "https://modrinth.com/mod/macaws-furniture",
  },
  {
    slug: "macaws-windows",
    previewUrl: "https://modrinth.com/mod/macaws-windows",
  },
  {
    slug: "macaws-roofs",
    previewUrl: "https://modrinth.com/mod/macaws-roofs",
  },
  {
    slug: "macaws-bridges",
    previewUrl: "https://modrinth.com/mod/macaws-bridges/gallery",
  },
  {
    slug: "macaws-trapdoors",
    previewUrl: "https://modrinth.com/mod/macaws-trapdoors",
  },
  {
    slug: "macaws-paths-and-pavings",
    previewUrl: "https://modrinth.com/mod/macaws-paths-and-pavings",
  },
  {
    slug: "macaws-lights-and-lamps",
    previewUrl: "https://modrinth.com/mod/macaws-lights-and-lamps",
  },
  {
    slug: "macaws-paintings",
    previewUrl: "https://modrinth.com/mod/macaws-paintings",
  },
  {
    slug: "supplementaries",
    previewUrl: "https://modrinth.com/mod/supplementaries",
  },
  {
    slug: "artifacts",
    previewUrl: "https://modrinth.com/mod/artifacts",
  },
  {
    slug: "better-archeology",
    previewUrl: "https://modrinth.com/mod/better-archeology",
  },
  {
    slug: "beautify",
    previewUrl: "https://modrinth.com/mod/beautify",
  },
  {
    slug: "immersive-melodies",
    previewUrl: "https://modrinth.com/mod/immersive-melodies",
  },
  {
    slug: "amendments",
    previewUrl: "https://modrinth.com/mod/amendments",
  },
  {
    slug: "mmmmmmmmmmmm",
    previewUrl: "https://modrinth.com/mod/mmmmmmmmmmmm",
  },
  {
    slug: "bountiful",
    previewUrl: "https://modrinth.com/mod/bountiful",
  },
  {
    slug: "nightlights",
    previewUrl: "https://modrinth.com/mod/nightlights",
  },
  {
    slug: "more-totems-of-undying",
    previewUrl: "https://modrinth.com/mod/more-totems-of-undying",
  },
  {
    slug: "immersive-armors",
    previewUrl: "https://modrinth.com/mod/immersive-armors"
  },

  // media
  {
    slug: "waterframes",
    previewUrl: "https://modrinth.com/mod/waterframes",
  },
  {
    slug: "exposure",
    previewUrl: "https://modrinth.com/mod/exposure",
  },

  // Farmer's Delight
  {
    slug: "farmers-delight",
    previewUrl: "https://modrinth.com/mod/farmers-delight",
  },
  {
    slug: "chefs-delight",
    previewUrl: "https://modrinth.com/mod/chefs-delight",
  },
  {
    slug: "ends-delight",
    previewUrl: "https://modrinth.com/mod/ends-delight",
  },
  {
    slug: "oceans-delight",
    previewUrl: "https://modrinth.com/mod/oceans-delight",
  },

  // Create
  {
    slug: "create",
    previewUrl: "https://modrinth.com/mod/create",
  },
  {
    slug: "create-steam-n-rails",
    previewUrl: "https://modrinth.com/mod/create-steam-n-rails",
  },
  {
    slug: "createaddition",
    previewUrl: "https://modrinth.com/mod/createaddition",
  },
  {
    slug: "slice-and-dice",
    previewUrl: "https://modrinth.com/mod/slice-and-dice",
  },
  {
    slug: "copycats",
    previewUrl: "https://modrinth.com/mod/copycats",
  },
  {
    slug: "create-deco",
    previewUrl: "https://modrinth.com/mod/create-deco",
  },
  {
    slug: "create-new-age",
    previewUrl: "https://modrinth.com/mod/create-new-age",
  },
  {
    slug: "create-goggles",
    previewUrl: "https://modrinth.com/mod/create-goggles",
  },
  {
    slug: "bellsandwhistles",
    previewUrl: "https://modrinth.com/mod/bellsandwhistles",
  },
  {
    slug: "create-enchantment-industry",
    previewUrl: "https://modrinth.com/mod/create-enchantment-industry",
  },
  {
    slug: "extended-cogwheels",
    previewUrl: "https://modrinth.com/mod/extended-cogwheels",
  },

  // AE2
  {
    slug: "ae2",
    previewUrl: "https://modrinth.com/mod/ae2",
  },
  {
    slug: "applied-energistics-2-wireless-terminals",
    previewUrl:
      "https://modrinth.com/mod/applied-energistics-2-wireless-terminals",
  },
  {
    slug: "ae2-qol-recipes",
    previewUrl: "https://modrinth.com/mod/ae2-qol-recipes",
  },
  {
    slug: "ae2-import-export-card",
    previewUrl: "https://modrinth.com/mod/ae2-import-export-card"
  },

  // Mekanism
  {
    slug: "mekanism",
    previewUrl: "https://modrinth.com/mod/mekanism"
  },

  {
    slug: "applied-mekanistics",
    previewUrl: "https://modrinth.com/mod/applied-mekanistics"
  },
  {
    slug: "mekanism-generators",
    previewUrl: "https://modrinth.com/mod/mekanism-generators"
  },

  // CC: Tweaked
  {
    slug: "cc-tweaked",
    previewUrl: "https://modrinth.com/mod/cc-tweaked"
  },
  {
    slug: "cccbridge",
    previewUrl: "https://modrinth.com/mod/cccbridge"
  },
  {
    slug: "advancedperipherals",
    previewUrl: "https://modrinth.com/mod/advancedperipherals"
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
  {
    slug: "regions-unexplored",
    previewUrl: "https://modrinth.com/mod/regions-unexplored",
  },
  {
    slug: "totw-modded",
    previewUrl: "https://modrinth.com/mod/totw-modded",
  },
  {
    slug: "towers-of-the-wild-additions",
    previewUrl: "https://modrinth.com/mod/towers-of-the-wild-additions",
  },
  {
    slug: "when-dungeons-arise",
    previewUrl: "https://modrinth.com/mod/when-dungeons-arise",
  },
  {
    slug: "hopo-better-ruined-portals",
    previewUrl: "https://modrinth.com/datapack/hopo-better-ruined-portals",
  },
  {
    slug: "villages-and-pillages",
    previewUrl: "https://modrinth.com/mod/villages-and-pillages",
  },
  {
    slug: "towns-and-towers",
    previewUrl: "https://modrinth.com/mod/towns-and-towers",
  },
  {
    slug: "yungs-better-mineshafts",
    previewUrl: "https://modrinth.com/mod/yungs-better-mineshafts",
  },

  // Nether
  {
    slug: "betternether",
    previewUrl: "https://modrinth.com/mod/betternether",
  },
  {
    slug: "yungs-better-nether-fortresses",
    previewUrl: "https://modrinth.com/mod/yungs-better-nether-fortresses",
  },
  {
    slug: "bygone-nether",
    previewUrl: "https://modrinth.com/mod/bygone-nether",
  },
  {
    slug: "formations-nether",
    previewUrl: "https://modrinth.com/mod/formations-nether",
  },

  // End
  {
    slug: "betterend",
    previewUrl: "https://modrinth.com/mod/betterend",
  },
  {
    slug: "better-end-cities-for-betterend",
    platform: "fabric",
    previewUrl: "https://modrinth.com/mod/better-end-cities-for-betterend",
  },
  {
    slug: "nullscape",
    previewUrl: "https://modrinth.com/datapack/nullscape",
  },
  {
    slug: "yungs-better-end-island",
    previewUrl: "https://modrinth.com/mod/yungs-better-end-island",
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
    slug: "creeper-overhaul",
    previewUrl: "https://modrinth.com/mod/creeper-overhaul",
  },
  {
    slug: "more-mob-variants",
    previewUrl: "https://modrinth.com/mod/more-mob-variants",
  },
  {
    name: "Comforsts",
    environment: "both",
    previewUrl: "https://modrinth.com/mod/comforts",
    fileUrl:
      "https://cdn.modrinth.com/data/SaCpeal4/versions/eXcBRSHm/comforts-neoforge-7.2.2%2B1.20.4.jar",
  },
  {
    slug: "alexs-mobs",
    previewUrl: "https://modrinth.com/mod/alexs-mobs",
  },
  {
    slug: "guard-villagers",
    previewUrl: "https://modrinth.com/mod/guard-villagers",
  },
  {
    slug: "fish-of-thieves",
    previewUrl: "https://modrinth.com/mod/fish-of-thieves"
  },

  // Optimization mods
  {
    name: "Noisium",
    environment: "server",
    previewUrl: "https://modrinth.com/mod/noisium",
    fileUrl:
      "https://cdn.modrinth.com/data/KuNKN7d2/versions/rjcZ5G3m/noisium-neoforge-2.3.0%2Bmc1.20.2-1.20.4.jar",
  },
  {
    slug: "ferrite-core",
    previewUrl: "https://modrinth.com/mod/ferrite-core",
  },
  {
    slug: "modernfix",
    previewUrl: "https://modrinth.com/mod/modernfix",
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
  {
    slug: "curios",
    previewUrl: "https://modrinth.com/mod/curios",
  },
  {
    slug: "cristel-lib",
    previewUrl: "https://modrinth.com/mod/cristel-lib",
  },
  {
    slug: "supermartijn642s-config-lib",
    previewUrl: "https://modrinth.com/mod/supermartijn642s-config-lib",
  },
  {
    slug: "moonlight",
    previewUrl: "https://modrinth.com/mod/moonlight",
  },
  {
    slug: "formations",
    previewUrl: "https://modrinth.com/mod/formations",
  },
  {
    slug: "caelus",
    previewUrl: "https://modrinth.com/mod/caelus",
  },
  {
    slug: "watermedia",
    previewUrl: "https://modrinth.com/mod/watermedia",
  },

  // Fabric support
  {
    slug: "forgified-fabric-api",
    previewUrl: "https://modrinth.com/mod/forgified-fabric-api",
  },
  {
    slug: "connector",
    previewUrl: "https://modrinth.com/mod/connector",
  },
  {
    slug: "connector-extras",
    previewUrl: "https://modrinth.com/mod/connector-extras",
  },
];
