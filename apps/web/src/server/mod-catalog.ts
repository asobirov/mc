import { readFileSync } from "node:fs";
import { inflateRawSync } from "node:zlib";
import { z } from "zod";

import type {
  ModCatalogItem,
  ModCatalogResponse,
  ModCategory,
} from "../lib/mod-catalog";

const EOCD_SIGNATURE = 0x06054b50;
const CENTRAL_FILE_SIGNATURE = 0x02014b50;
const LOCAL_FILE_SIGNATURE = 0x04034b50;

const modrinthIndexSchema = z.object({
  dependencies: z.record(z.string(), z.string()),
  files: z.array(
    z.object({
      downloads: z.array(z.string()).optional(),
      path: z.string(),
    }),
  ),
  name: z.string(),
  versionId: z.string(),
});

const modrinthProjectSchema = z.object({
  additional_categories: z.array(z.string()),
  categories: z.array(z.string()),
  description: z.string(),
  icon_url: z.string().nullable(),
  id: z.string(),
  slug: z.string().nullable(),
  title: z.string(),
});

const modrinthProjectsSchema = z.array(modrinthProjectSchema);

type ZipEntry = {
  compressedSize: number;
  compressionMethod: number;
  fileName: string;
  localHeaderOffset: number;
};

export type ModCatalog = ModCatalogResponse;

type CatalogClassifierInput = {
  categories?: string[];
  description?: string;
  fileName: string;
  name: string;
};

type BundledMetadata = {
  category: ModCategory;
  description: string;
  matches: RegExp;
  name: string;
};

const bundledMetadata: BundledMetadata[] = [
  {
    category: "libraries",
    description: "Shared utilities used by several other mods in the pack.",
    matches: /^cupboard-/i,
    name: "Cupboard",
  },
  {
    category: "performance",
    description:
      "Moves world-saving work off the main tick to reduce save-time stutters.",
    matches: /^fastasyncworldsave-/i,
    name: "Fast Async World Save",
  },
  {
    category: "libraries",
    description:
      "MrCrayfish's shared framework for configuration, networking, and data.",
    matches: /^framework-/i,
    name: "Framework",
  },
  {
    category: "libraries",
    description: "Adds compatible modded loot to Towns and Towers structures.",
    matches: /^lootintegration_townsandtowers-/i,
    name: "Loot Integrations: Towns and Towers",
  },
  {
    category: "libraries",
    description:
      "Adds compatible modded loot to When Dungeons Arise structures.",
    matches: /^lootintegration_wda-/i,
    name: "Loot Integrations: When Dungeons Arise",
  },
  {
    category: "libraries",
    description:
      "Connects structure loot tables with useful items from other installed mods.",
    matches: /^lootintegrations-\d/i,
    name: "Loot Integrations",
  },
  {
    category: "libraries",
    description:
      "Adds compatible modded loot to ChoiceTheorem's Overhauled Village.",
    matches: /^lootintegrations_ctov-/i,
    name: "Loot Integrations: Overhauled Village",
  },
  {
    category: "libraries",
    description:
      "Adds compatible modded loot to Integrated Dungeons and Structures.",
    matches: /^lootintegrations_integrated-/i,
    name: "Loot Integrations: Integrated Structures",
  },
  {
    category: "libraries",
    description: "Adds compatible modded loot to Moog's structure collection.",
    matches: /^lootintegrations_moog-/i,
    name: "Loot Integrations: Moog's Structures",
  },
  {
    category: "libraries",
    description: "Adds pack-aware loot to Minecraft's vanilla structures.",
    matches: /^lootintegrations_vanilla-/i,
    name: "Loot Integrations: Vanilla",
  },
  {
    category: "libraries",
    description:
      "Adds compatible modded loot throughout YUNG's redesigned structures.",
    matches: /^lootintegrations_yungs-/i,
    name: "Loot Integrations: YUNG's Structures",
  },
  {
    category: "building",
    description:
      "Adds functional, animated furniture and appliances for lived-in builds.",
    matches: /^refurbished_furniture-/i,
    name: "MrCrayfish's Furniture Mod: Refurbished",
  },
  {
    category: "performance",
    description:
      "Reduces structure-generation bottlenecks and prevents common worldgen stalls.",
    matches: /^structureessentials-/i,
    name: "Structure Essentials",
  },
];

function bundledDetails(fileName: string): BundledMetadata | null {
  return bundledMetadata.find((item) => item.matches.test(fileName)) ?? null;
}

export function categorizeMod({
  categories = [],
  description = "",
  fileName,
  name,
}: CatalogClassifierInput): ModCategory {
  const tags = new Set(categories.map((category) => category.toLowerCase()));
  const identity = `${name} ${fileName}`.toLowerCase();
  const searchable = `${name} ${fileName} ${description}`.toLowerCase();

  if (
    /\b(api|architectury|athena|bookshelf|cloth config|collective|cupboard|framework|geckolib|konkrete|kotlin|library|lib|lithostitched|moonlight lib|owo-lib|playeranimator|prickle|puzzles lib|resourceful|terrablender|zeta)\b/.test(
      identity,
    ) ||
    /loot integrations?/.test(identity)
  ) {
    return "libraries";
  }
  if (
    /\b(create|clockwork|trackwork|valkyrien|computer ?craft|steam|mechanical|aeronautics?)\b/.test(
      identity,
    )
  ) {
    return "technology";
  }
  if (
    /\b(food|farm|farmer|cooking|culinary|delight|fish|fishing)\b/.test(
      identity,
    )
  ) {
    return "food";
  }
  if (/\b(voice ?chat|no chat reports?)\b/.test(identity)) {
    return "multiplayer";
  }
  if (/\b(minimap|world ?map|waypoint|navigation)\b/.test(identity)) {
    return "navigation";
  }
  if (
    /\b(backups?|c2me|clumps|entity culling|faster|ferrite|immediatelyfast|modernfix|servercore|sodium|spark)\b/.test(
      identity,
    )
  ) {
    return "performance";
  }
  if (
    /\b(ambient sounds|advancements?|dynamic lights|emi|jade|jei|mouse tweaks|not enough animations|quark|tooltips?|totems?|zoom)\b/.test(
      identity,
    )
  ) {
    return "quality-of-life";
  }
  if (/\b(ars nouveau|magic|ritual|sorcery|spell)\b/.test(searchable)) {
    return "magic";
  }
  if (
    /\b(aether|biomes?|caves?|dungeons?|end island|explorations?|fortresses?|mineshafts?|monuments?|nether|regions|strongholds?|structures?|tectonic|temples?|terralith|villages?|worldgen)\b/.test(
      identity,
    )
  ) {
    return "exploration";
  }
  if (
    /\b(chipped|decoration|doors?|every compat|fences?|furniture|lamps?|paintings?|paving|roofs?|stairs?|storage|supplementaries|trapdoors?|windows?)\b/.test(
      identity,
    )
  ) {
    return "building";
  }
  if (
    /\b(combat|creeper|dummy|grave|illager|mob|naturalist|weapon)\b/.test(
      identity,
    )
  ) {
    return "gameplay";
  }
  if (tags.has("magic")) return "magic";
  if (tags.has("technology") || tags.has("transportation")) {
    return "technology";
  }
  if (tags.has("food")) return "food";
  if (tags.has("social")) return "multiplayer";
  if (tags.has("optimization")) return "performance";
  if (tags.has("decoration") || tags.has("storage")) return "building";
  if (tags.has("mobs") || tags.has("equipment")) return "gameplay";
  if (tags.has("worldgen") || tags.has("adventure")) return "exploration";
  if (tags.has("library")) return "libraries";
  return "quality-of-life";
}

function fallbackDescription(name: string): string {
  return `${name} is included in Friends MC. Its author description is temporarily unavailable.`;
}

function normalizeDescription(description: string): string {
  return description.replace(/\s+/g, " ").trim();
}

function findEndOfCentralDirectory(zip: Buffer): number {
  const earliestOffset = Math.max(0, zip.length - 65_557);
  for (let offset = zip.length - 22; offset >= earliestOffset; offset -= 1) {
    if (zip.readUInt32LE(offset) === EOCD_SIGNATURE) return offset;
  }
  throw new Error("The modpack is not a readable ZIP archive");
}

function listZipEntries(zip: Buffer): ZipEntry[] {
  const eocdOffset = findEndOfCentralDirectory(zip);
  const entryCount = zip.readUInt16LE(eocdOffset + 10);
  let offset = zip.readUInt32LE(eocdOffset + 16);
  const entries: ZipEntry[] = [];

  for (let index = 0; index < entryCount; index += 1) {
    if (zip.readUInt32LE(offset) !== CENTRAL_FILE_SIGNATURE) {
      throw new Error("The modpack ZIP directory is malformed");
    }

    const fileNameLength = zip.readUInt16LE(offset + 28);
    const extraLength = zip.readUInt16LE(offset + 30);
    const commentLength = zip.readUInt16LE(offset + 32);
    const fileNameStart = offset + 46;
    const fileName = zip
      .subarray(fileNameStart, fileNameStart + fileNameLength)
      .toString("utf8");

    entries.push({
      compressedSize: zip.readUInt32LE(offset + 20),
      compressionMethod: zip.readUInt16LE(offset + 10),
      fileName,
      localHeaderOffset: zip.readUInt32LE(offset + 42),
    });

    offset = fileNameStart + fileNameLength + extraLength + commentLength;
  }

  return entries;
}

function extractZipEntry(zip: Buffer, entry: ZipEntry): Buffer {
  if (zip.readUInt32LE(entry.localHeaderOffset) !== LOCAL_FILE_SIGNATURE) {
    throw new Error("The modpack ZIP entry is malformed");
  }

  const fileNameLength = zip.readUInt16LE(entry.localHeaderOffset + 26);
  const extraLength = zip.readUInt16LE(entry.localHeaderOffset + 28);
  const dataOffset =
    entry.localHeaderOffset + 30 + fileNameLength + extraLength;
  const compressed = zip.subarray(
    dataOffset,
    dataOffset + entry.compressedSize,
  );

  if (entry.compressionMethod === 0) return compressed;
  if (entry.compressionMethod === 8) return inflateRawSync(compressed);
  throw new Error("The modpack uses an unsupported ZIP compression method");
}

export function prettifyModName(fileName: string): string {
  const baseName = fileName
    .replace(/^.*\//, "")
    .replace(/\.jar$/i, "")
    .replace(/^\[[^\]]+\]/, "")
    .replace(/([a-z])([A-Z])/g, "$1 $2");
  const tokens = baseName.split(/[-_+ ]+/).filter(Boolean);
  const versionIndex = tokens.findIndex((token) =>
    /^(?:mc|v)?\d+(?:\.\d+)+(?:[a-z].*)?$/i.test(token),
  );
  const nameTokens = (
    versionIndex === -1 ? tokens : tokens.slice(0, versionIndex)
  ).filter((token) => !/^(?:fabric|forge|neoforge)$/i.test(token));
  const name = nameTokens.join(" ").trim() || baseName;

  return name
    .split(" ")
    .map((word) => {
      if (/^[A-Z\d]{2,}$/.test(word)) return word;
      return `${word.charAt(0).toUpperCase()}${word.slice(1)}`;
    })
    .join(" ");
}

function projectIdFromDownloads(
  downloads: string[] | undefined,
): string | null {
  for (const download of downloads ?? []) {
    const match = /\/data\/([^/]+)\/versions\//.exec(download);
    if (match?.[1]) return match[1];
  }
  return null;
}

export function readModCatalog(modpackPath: string): ModCatalog {
  const zip = readFileSync(modpackPath);
  const entries = listZipEntries(zip);
  const indexEntry = entries.find(
    (entry) => entry.fileName === "modrinth.index.json",
  );
  if (!indexEntry) throw new Error("The modpack has no Modrinth index");

  const index = modrinthIndexSchema.parse(
    JSON.parse(extractZipEntry(zip, indexEntry).toString("utf8")),
  );
  const mods = new Map<string, ModCatalogItem>();

  for (const file of index.files) {
    if (!file.path.startsWith("mods/") || !file.path.endsWith(".jar")) {
      continue;
    }
    const fileName = file.path.replace(/^mods\//, "");
    const name = prettifyModName(fileName);
    mods.set(fileName.toLowerCase(), {
      category: categorizeMod({ fileName, name }),
      description: fallbackDescription(name),
      fileName,
      iconUrl: null,
      name,
      projectId: projectIdFromDownloads(file.downloads),
      slug: null,
      source: "modrinth",
    });
  }

  for (const entry of entries) {
    if (
      !entry.fileName.startsWith("overrides/mods/") ||
      !entry.fileName.endsWith(".jar")
    ) {
      continue;
    }
    const fileName = entry.fileName.replace(/^overrides\/mods\//, "");
    const key = fileName.toLowerCase();
    if (!mods.has(key)) {
      const bundled = bundledDetails(fileName);
      const name = bundled?.name ?? prettifyModName(fileName);
      mods.set(key, {
        category: bundled?.category ?? categorizeMod({ fileName, name }),
        description: bundled?.description ?? fallbackDescription(name),
        fileName,
        iconUrl: null,
        name,
        projectId: null,
        slug: null,
        source: "bundled",
      });
    }
  }

  return {
    loader: index.dependencies.neoforge ?? "NeoForge",
    minecraft: index.dependencies.minecraft ?? "Unknown",
    mods: [...mods.values()].sort((left, right) =>
      left.name.localeCompare(right.name, undefined, {
        numeric: true,
        sensitivity: "base",
      }),
    ),
    name: index.name,
    version: index.versionId,
  };
}

export async function enrichModCatalog(
  catalog: ModCatalog,
  fetchProjects: typeof fetch = fetch,
): Promise<ModCatalog> {
  const projectIds = catalog.mods.flatMap((mod) =>
    mod.projectId ? [mod.projectId] : [],
  );
  if (projectIds.length === 0) return catalog;

  const endpoint = new URL("https://api.modrinth.com/v2/projects");
  endpoint.searchParams.set("ids", JSON.stringify(projectIds));
  const response = await fetchProjects(endpoint, {
    headers: {
      "User-Agent": "asobirov/friends-mc (mc.xpr.im)",
    },
    signal: AbortSignal.timeout(5_000),
  });
  if (!response.ok) {
    throw new Error(`Modrinth metadata returned ${response.status}`);
  }

  const projects = modrinthProjectsSchema.parse(await response.json());
  const projectsById = new Map(
    projects.map((project) => [project.id, project]),
  );
  const mods = catalog.mods.map((mod) => {
    if (!mod.projectId) return mod;
    const project = projectsById.get(mod.projectId);
    if (!project) return mod;

    const categories = [
      ...project.categories,
      ...project.additional_categories,
    ];
    const name = project.title.trim() || mod.name;
    const description =
      normalizeDescription(project.description) || fallbackDescription(name);

    return {
      ...mod,
      category: categorizeMod({
        categories,
        description,
        fileName: mod.fileName,
        name,
      }),
      description,
      iconUrl: project.icon_url,
      name,
      slug: project.slug,
    };
  });

  return {
    ...catalog,
    mods: mods.sort((left, right) =>
      left.name.localeCompare(right.name, undefined, {
        numeric: true,
        sensitivity: "base",
      }),
    ),
  };
}
