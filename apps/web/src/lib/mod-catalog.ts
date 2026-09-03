export const MOD_CATEGORIES = [
  {
    description: "Machines, contraptions, vehicles, and automation.",
    id: "technology",
    label: "Create & technology",
  },
  {
    description: "Crops, recipes, kitchens, fishing, and better meals.",
    id: "food",
    label: "Food, farming & fishing",
  },
  {
    description: "Spells, rituals, artifacts, and supernatural systems.",
    id: "magic",
    label: "Magic & fantasy",
  },
  {
    description: "Biomes, structures, dimensions, and reasons to wander.",
    id: "exploration",
    label: "Exploration & worldgen",
  },
  {
    description: "Furniture, blocks, storage, and visual building tools.",
    id: "building",
    label: "Building & decoration",
  },
  {
    description: "Mobs, equipment, combat systems, and player abilities.",
    id: "gameplay",
    label: "Creatures, combat & gear",
  },
  {
    description: "Voice, social features, and shared-server tools.",
    id: "multiplayer",
    label: "Multiplayer & social",
  },
  {
    description: "World maps, minimaps, waypoints, and navigation aids.",
    id: "navigation",
    label: "Maps & navigation",
  },
  {
    description: "Conveniences and interface improvements for everyday play.",
    id: "quality-of-life",
    label: "Quality of life",
  },
  {
    description: "Faster loading, steadier ticks, and lighter rendering.",
    id: "performance",
    label: "Performance",
  },
  {
    description: "Shared code and compatibility layers used by other mods.",
    id: "libraries",
    label: "Libraries & integrations",
  },
] as const;

export type ModCategory = (typeof MOD_CATEGORIES)[number]["id"];

export type ModCatalogItem = {
  category: ModCategory;
  description: string;
  fileName: string;
  iconUrl: string | null;
  name: string;
  projectId: string | null;
  slug: string | null;
  source: "bundled" | "modrinth";
};

export type ModCatalogResponse = {
  loader: string;
  minecraft: string;
  mods: ModCatalogItem[];
  name: string;
  version: string;
};
