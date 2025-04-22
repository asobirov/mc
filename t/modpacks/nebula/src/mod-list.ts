import type { ModList } from "@mc/validators/mods";
import { GameLoaders } from "@mc/validators/mods";


export const modList: ModList = {
  baseLoader: GameLoaders.FORGE,
  gameVersion: "1.20.1",
  mods: [{
    provider: "modrinth",
    mods: [{
      slug: "visual-workbench",
    }, {
      slug: "3dskinlayers"
    }, 
    // Client-side only    
    {
      slug: "sound-physics-remastered"
    }, {
      slug: "chat-heads"
    }, {
      slug: "fallingleavesforge"
    }, {
      slug: "distanthorizons"
    },
    // Simple Voice Chat mods
    {
      slug: "simple-voice-chat"
    }, {
      slug: "voice-chat-interaction"
    },
    // HUD stuff
    {
      slug: "appleskin",
    }, {
      slug: "jei",
    }, {
      slug: "nerb",
    }, {
      slug: "jade",
    }
  ]
  }]
}