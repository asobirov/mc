import type { ModList } from "@mc/validators/mods";

import { GameLoaders } from "@mc/validators/mods";

export const modList: ModList = {
  baseLoader: GameLoaders.FORGE,
  gameVersion: "1.20.1",
  mods: [
    {
      provider: "modrinth",
      mods: [
        {
          slug: "visual-workbench",
        },
        {
          slug: "3dskinlayers",
        },

        // Client-side only
        {
          slug: "sound-physics-remastered",
        },
        {
          slug: "immersivethunder",
        },
        {
          slug: "chat-heads",
        },
        {
          slug: "fallingleavesforge",
        },
        {
          slug: "distanthorizons",
        },
        {
          slug: "mouse-tweaks",
        },
        {
          slug: "ae2-mousetweaks-fix",
          loader: GameLoaders.FABRIC,
        },

        // Simple Voice Chat mods
        {
          slug: "simple-voice-chat",
        },
        {
          slug: "voice-chat-interaction",
        },

        // HUD stuff
        {
          slug: "appleskin",
        },
        {
          slug: "jei",
        },
        {
          slug: "nerb",
        },
        {
          slug: "jade",
        },
        {
          slug: "journeymap",
        },
        {
          slug: "travelers-titles",
        },

        // QoL
        {
          slug: "corpse",
        },
        {
          slug: "corpse-x-curios-api-compat",
        },
        {
          slug: "enchantment-descriptions",
        },
        {
          slug: "legendary-tooltips",
        },
        {
          slug: "death-knell",
        },
        {
          slug: "smarter-farmers-farmers-replant",
        },
        {
          slug: "elytra-slot",
        },
        {
          slug: "netherportalfix",
        },
        {
          slug: "dynamic-lights",
        },

        // Collective mods
        {
          slug: "collective",
        },
        {
          slug: "softer-hay-bales",
        },
        {
          slug: "fish-on-the-line",
        },
        {
          slug: "grabby-mobs",
        },
        {
          slug: "villager-names-serilum",
        },

        // Items
        {
          slug: "natures-compass",
        },
        {
          slug: "more-music-discs",
        },
        {
          slug: "travelersbackpack",
        },
        {
          slug: "waystones",
        },
        {
          slug: "macaws-doors",
        },
        {
          slug: "macaws-fences-and-walls",
        },
        {
          slug: "macaws-furniture",
        },
        {
          slug: "macaws-windows",
        },
        {
          slug: "macaws-roofs",
        },
        {
          slug: "macaws-bridges",
        },
        {
          slug: "macaws-trapdoors",
        },
        {
          slug: "macaws-paths-and-pavings",
        },
        {
          slug: "macaws-lights-and-lamps",
        },
        {
          slug: "macaws-paintings",
        },
        {
          slug: "supplementaries",
          version: "1.20-3.1.18",
        },
        {
          slug: "artifacts",
        },
        {
          slug: "better-archeology",
        },
        {
          slug: "beautify",
        },
        {
          slug: "immersive-melodies",
        },
        {
          slug: "amendments",
        },
        {
          slug: "mmmmmmmmmmmm",
        },
        {
          slug: "bountiful",
        },
        {
          slug: "nightlights",
        },
        {
          slug: "more-totems-of-undying",
        },
        {
          slug: "immersive-armors",
        },
        {
          slug: "small-ships",
        },

        // media
        {
          slug: "waterframes",
        },
        {
          slug: "exposure",
        },

        // Farmer's Delight
        {
          slug: "farmers-delight",
        },
        {
          slug: "chefs-delight",
        },
        {
          slug: "ends-delight",
        },
        {
          slug: "oceans-delight",
        },

        // Create
        {
          slug: "create",
          version: "1.20.1-0.5.1.j", // not all Create addons currently support v6
        },
        {
          slug: "create-steam-n-rails",
          version: "1.6.7+forge-mc1.20.1",
        },
        {
          slug: "createaddition",
          version: "1.20.1-1.2.5",
        },
        {
          slug: "copycats",
          version: "2.2.2+mc.1.20.1-forge",
        },
        {
          slug: "create-deco",
          version: "2.0.2-1.20.1-forge",
        },
        {
          slug: "create-new-age",
          version: "2BEeSV7E",
        },
        {
          slug: "create-goggles",
          version: "1odF7ZI7",
        },
        {
          slug: "bellsandwhistles",
          version: "0.4.3-mc1.20.x",
        },
        {
          slug: "create-enchantment-industry",
          version: "1.2.9.d",
        },
        {
          slug: "extended-cogwheels",
          version: "2.1.1-1.20.1-0.5.1.f-forge",
        },

        // AE2
        {
          slug: "ae2",
        },
        {
          slug: "applied-energistics-2-wireless-terminals",
        },
        {
          slug: "ae2-qol-recipes",
        },
        {
          slug: "ae2-import-export-card",
        },

        // Mekanism
        {
          slug: "mekanism",
        },
        {
          slug: "applied-mekanistics",
          loader: GameLoaders.NEOFORGE, // Doesn't have forge listed, however neoforge works
        },
        {
          slug: "mekanism-generators",
        },

        // CC: Tweaked
        {
          slug: "cc-tweaked",
          version: "1.115.0", // 1.115.1+ is for create v6
        },
        {
          slug: "cccbridge",
        },
        {
          slug: "advancedperipherals",
        },

        // World generation mods
        {
          slug: "terralith",
        },
        {
          slug: "tectonic",
        },
        {
          slug: "tidal-towns",
        },
        {
          slug: "ad-astra",
          version: "1.15.19", // 1.15.20+ is for create v6
        },
        {
          slug: "totw-modded",
        },
        {
          slug: "towers-of-the-wild-additions",
        },
        {
          slug: "when-dungeons-arise",
        },
        {
          slug: "hopo-better-ruined-portals",
        },
        {
          slug: "villages-and-pillages",
        },
        {
          slug: "towns-and-towers",
        },
        {
          slug: "yungs-better-mineshafts",
        },

        // Nether
        {
          slug: "betternether",
        },
        {
          slug: "yungs-better-nether-fortresses",
        },
        {
          slug: "bygone-nether",
        },
        {
          slug: "formations-nether",
        },

        // End
        {
          slug: "betterend",
        },
        {
          slug: "better-end-cities-for-betterend",
          loader: GameLoaders.FABRIC,
        },
        {
          slug: "nullscape",
        },
        {
          slug: "yungs-better-end-island",
        },

        // Mobs
        {
          slug: "enderman-overhaul",
        },
        {
          slug: "creeper-overhaul",
        },
        {
          slug: "more-mob-variants",
        },
        {
          slug: "comforts",
        },
        {
          slug: "alexs-mobs",
        },
        {
          slug: "guard-villagers",
        },
        {
          slug: "fish-of-thieves",
        },

        // Optimization mods
        {
          slug: "noisium",
        },
        {
          slug: "ferrite-core",
        },
        {
          slug: "modernfix",
        },

        // Core/Dev API mods
        {
          slug: "architectury-api",
        },
        {
          slug: "cloth-config",
        },
        {
          slug: "balm",
        },
        {
          slug: "puzzles-lib",
        },
        {
          slug: "patchouli",
        },
        {
          slug: "geckolib",
        },
        {
          slug: "resourceful-lib",
        },
        {
          slug: "resourceful-config",
        },
        {
          slug: "botarium",
        },
        {
          slug: "curios",
        },
        {
          slug: "cristel-lib",
        },
        {
          slug: "supermartijn642s-config-lib",
        },
        {
          slug: "moonlight",
        },
        {
          slug: "formations",
        },
        {
          slug: "caelus",
        },
        {
          slug: "watermedia",
        },
        {
          slug: "yungs-api",
        },
        {
          slug: "creativecore",
        },
        {
          slug: "octo-lib",
        },
        {
          slug: "citadel",
        },
        {
          slug: "kotlin-for-forge",
        },
        {
          slug: "kambrik",
        },
        {
          slug: "bclib",
        },
        {
          slug: "prism-lib",
        },
        {
          slug: "iceberg",
        },
        {
          slug: "bookshelf-lib",
        },
        {
          slug: "kubejs",
        },
        {
          slug: "rhino",
        },

        // Fabric bridge
        {
          slug: "forgified-fabric-api",
        },
        {
          slug: "connector",
        },
        {
          slug: "connector-extras",
        },
      ],
    },
    // {
    //   provider: "curseforge",
    //   mods: [
    //     {
    //       slug: "special-drops",
    //     },
    //     {
    //       slug: "useless-sword",
    //     },
    //   ],
    // },
  ],
};
