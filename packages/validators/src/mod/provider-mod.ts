import { z } from "zod";

import { GameLoaderEnum } from "../loader";
import { Platforms } from "../platform";
import { Provider } from "../provider";

const ProviderModOptions = z.object({
  loader: GameLoaderEnum.optional(),
  version: z.string().optional(),
});

export type ProviderMod = z.infer<typeof ProviderMod>;
export const ProviderMod = z
  .object({
    type: z.literal("provider").default("provider"),
    provider: Provider,
    slug: z.string(),
    platforms: Platforms.optional(),
  })
  .merge(ProviderModOptions);