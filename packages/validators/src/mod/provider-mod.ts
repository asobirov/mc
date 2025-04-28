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
  })
  .merge(ProviderModOptions);

export const ProviderModMetadata = z.object({
  provider: Provider,
  slug: z.string(),
  dependencies: z.array(
    z.object({
      mod: z.string(),
      version: z.string(),
    }),
  ),
  platforms: Platforms,
});
