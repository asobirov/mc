import { readFileSync } from "node:fs";
import { inflateRawSync } from "node:zlib";
import { z } from "zod";

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

type ZipEntry = {
  compressedSize: number;
  compressionMethod: number;
  fileName: string;
  localHeaderOffset: number;
};

export type ModCatalogItem = {
  fileName: string;
  name: string;
  projectId: string | null;
  source: "bundled" | "modrinth";
};

export type ModCatalog = {
  loader: string;
  minecraft: string;
  mods: ModCatalogItem[];
  name: string;
  version: string;
};

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
    mods.set(fileName.toLowerCase(), {
      fileName,
      name: prettifyModName(fileName),
      projectId: projectIdFromDownloads(file.downloads),
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
      mods.set(key, {
        fileName,
        name: prettifyModName(fileName),
        projectId: null,
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
