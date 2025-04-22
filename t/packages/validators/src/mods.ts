import { z } from "zod";

export enum GameLoaders {
  FORGE = "forge",
  NEOFORGE = "neoforge",
  FABRIC = "fabric",
}

const GameLoadersEnum = z.nativeEnum(GameLoaders);
type GameLoadersEnum = z.infer<typeof GameLoadersEnum>;

const FileMod = z.object({
  fileUrl: z.custom<`${string}.jar`>(
    (v: string) => v === "string" && v.toLowerCase().endsWith('.jar'),     
    { message: 'fileUrl must be a .jar file' }
  )
})

const ModProvider = z.enum(["modrinth", "curseforge"]);

const ProviderModOptions = z.object({
  loader: GameLoadersEnum.optional(),
  version: z.string().optional()
})

const ProviderMod = z.object({
  provider: ModProvider,
  slug: z.string(),
  overrides: ProviderModOptions.optional()
})

export type Mod = z.infer<typeof Mod>;
export const Mod = z.union([
  FileMod,
  ProviderMod
])

export const ProviderModList = z.object({
  provider: ModProvider,
  mods: z.array(ProviderMod.omit({
    provider: true
  }))
})

export type ModList = z.infer<typeof ModList>;
export const ModList = z.object({
  baseLoader: GameLoadersEnum,
  gameVersion: z.string(),
  mods: z.array(
    z.union([
      Mod,
      ProviderModList
    ])
  )
})