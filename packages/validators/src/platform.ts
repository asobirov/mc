import { z } from "zod";

export type Platforms = z.infer<typeof Platforms>;
export const Platforms = z.array(z.enum(["client", "server"]));
