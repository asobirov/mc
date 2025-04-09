import { GAME_LOADER } from "@/constants";
import { Mod } from "./types";

export const INCOMPATIBLE_MODS = [
  "Choice Theorem's Overhauled Villages",
] as const;

export const mods: Mod[] = [
  {
    name: "Visual Workbench",
    slug: "visual-workbench",
    previewUrl: "https://modrinth.com/mod/visual-workbench",
  },
  {
    name: "Sit",
    previewUrl: "https://modrinth.com/mod/bl4cks-sit",
  },

  // Client-side only
  {
    name: "3D Skin Layers",
    previewUrl: "https://modrinth.com/mod/3dskinlayers",
  },
  {
    name: "Sound Physics Remastered",
    previewUrl: "https://modrinth.com/mod/sound-physics-remastered",
  },
  {
    name: "Chat Heads",
    previewUrl: "https://modrinth.com/mod/chat-heads",
  },
  {
    name: "Falling Leaves (NeoForge/Forge)",
    previewUrl: "https://modrinth.com/mod/fallingleavesforge",
  },
  {
    slug: "distanthorizons",
    previewUrl: "https://modrinth.com/mod/distanthorizons",
  },

  // Simple Voice Chat mods
  {
    name: "Simple Voice Chat",
    previewUrl: "https://modrinth.com/plugin/simple-voice-chat",
  },
  {
    slug: "voice-chat-interaction",
    previewUrl: "https://modrinth.com/mod/voice-chat-interaction",
  },

  // HUD stuff
  {
    name: "AppleSkin",
    previewUrl: "https://modrinth.com/mod/appleskin",
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
    previewUrl: "https://modrinth.com/mod/jade",
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
    previewUrl: "https://modrinth.com/mod/collective",
  },
  {
    name: "Softer Hay Bales",
    previewUrl: "https://modrinth.com/mod/softer-hay-bales",
  },
  {
    name: "Fish On The Line",
    previewUrl: "https://modrinth.com/mod/fish-on-the-line",
  },
  {
    name: "Grabby Mobs",
    previewUrl: "https://modrinth.com/mod/grabby-mobs",
  },
  {
    name: "Villager Names",
    previewUrl: "https://modrinth.com/mod/villager-names-serilum",
  },

  {
    name: "NetherPortalFix",
    previewUrl: "https://modrinth.com/mod/netherportalfix",
  },

  // Items
  {
    name: "Nature's Compass",
    previewUrl: "https://modrinth.com/mod/natures-compass",
  },
  {
    name: "More Music Discs",
    previewUrl: "https://modrinth.com/mod/more-music-discs",
  },
  {
    name: "Traveler's Backpack",
    previewUrl: "https://modrinth.com/mod/travelersbackpack",
  },
  {
    name: "Waystones",
    previewUrl: "https://modrinth.com/mod/waystones",
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
    previewUrl: "https://modrinth.com/mod/immersive-armors",
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
    previewUrl: "https://modrinth.com/mod/ae2-import-export-card",
  },

  // Mekanism
  {
    slug: "mekanism",
    previewUrl: "https://modrinth.com/mod/mekanism",
  },

  {
    slug: "applied-mekanistics",
    previewUrl: "https://modrinth.com/mod/applied-mekanistics",
    loader: GAME_LOADER.NEOFORGE,
  },
  {
    slug: "mekanism-generators",
    previewUrl: "https://modrinth.com/mod/mekanism-generators",
  },

  // CC: Tweaked
  {
    slug: "cc-tweaked",
    previewUrl: "https://modrinth.com/mod/cc-tweaked",
  },
  {
    slug: "cccbridge",
    previewUrl: "https://modrinth.com/mod/cccbridge",
  },
  {
    slug: "advancedperipherals",
    previewUrl: "https://modrinth.com/mod/advancedperipherals",
  },

  // World generation mods
  {
    name: "Terallith",
    previewUrl: "https://modrinth.com/datapack/terralith",
  },
  {
    name: "Tectonic",
    previewUrl: "https://modrinth.com/datapack/tectonic",
  },
  {
    name: "Tidal Towns",
    previewUrl: "https://modrinth.com/datapack/tidal-towns",
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
    loader: GAME_LOADER.FABRIC,
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
    previewUrl: "https://modrinth.com/mod/enderman-overhaul",
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
    previewUrl: "https://modrinth.com/mod/comforts",
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
    previewUrl: "https://modrinth.com/mod/fish-of-thieves",
  },

  // Optimization mods
  {
    name: "Noisium",
    previewUrl: "https://modrinth.com/mod/noisium",
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
    slug: "chunky",
    previewUrl: "https://modrinth.com/plugin/chunky",
  },

  // Core/Dev API mods
  {
    name: "Architectury API",
    previewUrl: "https://modrinth.com/mod/architectury-api",
  },
  {
    name: "Cloth Config API",
    previewUrl: "https://modrinth.com/mod/cloth-config",
  },
  {
    name: "Balm",
    previewUrl: "https://modrinth.com/mod/balm",
  },
  {
    name: "Puzzles Lib",
    previewUrl: "https://modrinth.com/mod/puzzles-lib",
  },
  {
    name: "Patchouli",
    previewUrl: "https://modrinth.com/mod/patchouli",
  },
  {
    name: "Geckolib",
    previewUrl: "https://modrinth.com/mod/geckolib",
  },
  {
    name: "Resourceful Lib",
    previewUrl: "https://modrinth.com/mod/resourceful-lib",
  },
  {
    name: "Resourceful Config",
    previewUrl: "https://modrinth.com/mod/resourceful-config",
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
  {
    slug: "yungs-api",
    previewUrl: "https://modrinth.com/mod/yungs-api",
  },
  {
    slug: "creativecore",
    previewUrl: "https://modrinth.com/mod/creativecore",
  },
  {
    slug: "octo-lib",
    previewUrl: "https://modrinth.com/mod/octo-lib",
  },
  {
    slug: "terrablender",
    previewUrl: "https://modrinth.com/mod/terrablender",
  },
  {
    slug: "citadel",
    previewUrl: "https://modrinth.com/mod/citadel",
  },
  {
    slug: "kotlin-for-forge",
    previewUrl: "https://modrinth.com/mod/kotlin-for-forge",
  },
  {
    slug: "kambrik",
    previewUrl: "https://modrinth.com/mod/kambrik",
  },
  {
    slug: "bclib",
    previewUrl: "https://modrinth.com/mod/bclib",
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
