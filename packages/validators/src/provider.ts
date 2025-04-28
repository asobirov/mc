import { z } from "zod";

export type Provider = z.infer<typeof Provider>;
export const Provider = z.enum(["modrinth", "curseforge"]);
