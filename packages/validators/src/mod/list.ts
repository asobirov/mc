import { z } from "zod";

import { Mod } from ".";
import { GameLoaderEnum } from "../loader";
import { Provider } from "../provider";
import { ProviderMod } from "./provider-mod";

export const ProviderModList = z.object({
  type: z.literal("provider-list").default("provider-list"),
  provider: Provider,
  mods: z.array(
    ProviderMod.omit({
      provider: true,
    }),
  ),
});

export type ModList = z.infer<typeof ModList>;
export const ModList = z.object({
  baseLoader: GameLoaderEnum,
  gameVersion: z.string(),
  mods: z.array(z.union([Mod, ProviderModList])),
});
