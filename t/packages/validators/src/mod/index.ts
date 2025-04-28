import { z } from "zod";

import { FileMod } from "./file-mod";
import { ProviderMod } from "./provider-mod";

export type Mod = z.infer<typeof Mod>;
export const Mod = z.union([FileMod, ProviderMod]);
