import { mods, INCOMPATIBLE_MODS } from "../mods";

export const hasIncompatibleMods = () => {
  return mods.some((mod) =>
    (INCOMPATIBLE_MODS as unknown as string[]).includes(mod.name)
  );
};
