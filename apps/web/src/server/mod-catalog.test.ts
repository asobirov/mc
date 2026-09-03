import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import { prettifyModName, readModCatalog } from "./mod-catalog";

describe("mod catalog", () => {
  it("turns mod filenames into readable labels", () => {
    expect(prettifyModName("FarmersDelight-1.21.1-1.3.2.jar")).toBe(
      "Farmers Delight",
    );
    expect(prettifyModName("voicechat-neoforge-1.21.1-2.6.21.jar")).toBe(
      "Voicechat",
    );
  });

  it("reads the published Friends MC pack", () => {
    const catalog = readModCatalog(
      resolve(
        process.cwd(),
        "../../modpacks/aeronautics-1.21.1/pack/Friends-MC-1.0.1.mrpack",
      ),
    );

    expect(catalog.minecraft).toBe("1.21.1");
    expect(catalog.version).toBe("1.0.1");
    expect(catalog.mods.length).toBeGreaterThan(190);
    expect(catalog.mods.some((mod) => mod.name === "Farmers Delight")).toBe(
      true,
    );
    expect(catalog.mods.some((mod) => mod.name === "Voicechat")).toBe(true);
  });
});
