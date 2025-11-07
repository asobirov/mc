import { GameLoader } from "@mc/validators/loader";
import { ModList } from "@mc/validators/mod/list";

// TODO: fix types for modlist input
export const modList = ModList.parse({
  baseLoader: GameLoader.NEOFORGE,
  gameVersion: "1.21.10",
  mods: [
    {
      provider: "modrinth",
      mods: [
        // General
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
          slug: "chat-heads",
        },

        // Simple Voice Chat mods
        {
          slug: "simple-voice-chat",
        },

        {
          slug: "puzzles-lib",
        },
        {
          slug: "cloth-config",
        },
      ],
    },
  ],
});
