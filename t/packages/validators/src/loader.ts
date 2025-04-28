import { z } from "zod";

export enum GameLoader {
  FORGE = "forge",
  NEOFORGE = "neoforge",
  FABRIC = "fabric",
}

export const GameLoaderEnum = z.nativeEnum(GameLoader);
export type GameLoaderEnum = z.infer<typeof GameLoaderEnum>;
