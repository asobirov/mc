import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import {
  categorizeMod,
  enrichModCatalog,
  prettifyModName,
  readModCatalog,
} from "./mod-catalog";

describe("mod catalog", () => {
  it("turns mod filenames into readable labels", () => {
    expect(prettifyModName("FarmersDelight-1.21.1-1.3.2.jar")).toBe(
      "Farmers Delight",
    );
    expect(prettifyModName("voicechat-neoforge-1.21.1-2.6.21.jar")).toBe(
      "Voicechat",
    );
  });

  it("maps technical tags and familiar names to friendly groups", () => {
    expect(
      categorizeMod({
        categories: ["technology"],
        fileName: "create.jar",
        name: "Create",
      }),
    ).toBe("technology");
    expect(
      categorizeMod({
        categories: ["utility"],
        fileName: "voicechat.jar",
        name: "Simple Voice Chat",
      }),
    ).toBe("multiplayer");
    expect(
      categorizeMod({
        categories: ["optimization"],
        fileName: "faster.jar",
        name: "Faster Things",
      }),
    ).toBe("performance");
  });

  it("reads the published Friends MC pack", () => {
    const catalog = readModCatalog(
      resolve(
        process.cwd(),
        "../../modpacks/aeronautics-1.21.1/pack/Friends-MC-1.1.3.mrpack",
      ),
    );

    expect(catalog.minecraft).toBe("1.21.1");
    expect(catalog.version).toBe("1.1.3");
    expect(catalog.mods.length).toBe(200);
    expect(catalog.mods.some((mod) => mod.name === "Farmers Delight")).toBe(
      true,
    );
    expect(catalog.mods.some((mod) => mod.name === "Voicechat")).toBe(true);
    expect(catalog.mods.some((mod) => mod.name === "Xaero's Minimap")).toBe(
      true,
    );
    expect(catalog.mods.some((mod) => mod.name === "The Twilight Forest")).toBe(
      true,
    );
    expect(
      catalog.mods.some((mod) => mod.name === "Twilight Flavors & Delight"),
    ).toBe(true);
    expect(
      catalog.mods.some(
        (mod) => mod.name === "TwilightForest Thread Safety Addon",
      ),
    ).toBe(true);
    const refurbishedFurniture = catalog.mods.find((mod) =>
      mod.fileName.startsWith("refurbished_furniture-"),
    );
    expect(refurbishedFurniture?.category).toBe("building");
    expect(refurbishedFurniture?.description).toContain("furniture");
  });

  it("adds author descriptions and presentation metadata from Modrinth", async () => {
    const catalog = readModCatalog(
      resolve(
        process.cwd(),
        "../../modpacks/aeronautics-1.21.1/pack/Friends-MC-1.1.3.mrpack",
      ),
    );
    const farmersDelight = catalog.mods.find(
      (mod) => mod.name === "Farmers Delight",
    );
    const projectId = farmersDelight?.projectId;
    expect(projectId).toBeTruthy();
    if (!projectId) throw new Error("Farmer's Delight has no project ID");

    const fetchProjects: typeof fetch = (input) => {
      const requestedUrl =
        typeof input === "string"
          ? input
          : input instanceof URL
            ? input.href
            : input.url;
      expect(requestedUrl).toContain("api.modrinth.com/v2/projects");
      return Promise.resolve(
        new Response(
          JSON.stringify([
            {
              additional_categories: ["game-mechanics"],
              categories: ["food"],
              description:
                "Adds farming, cooking, and thoughtfully prepared meals.",
              icon_url: "https://cdn.modrinth.com/farmers-delight.png",
              id: projectId,
              slug: "farmers-delight",
              title: "Farmer's Delight",
            },
          ]),
        ),
      );
    };

    const enriched = await enrichModCatalog(catalog, fetchProjects);
    expect(
      enriched.mods.find((mod) => mod.projectId === projectId),
    ).toMatchObject({
      category: "food",
      description: "Adds farming, cooking, and thoughtfully prepared meals.",
      iconUrl: "https://cdn.modrinth.com/farmers-delight.png",
      name: "Farmer's Delight",
      slug: "farmers-delight",
    });
  });
});
