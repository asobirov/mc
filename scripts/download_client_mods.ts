import * as fs from "fs-extra";
import * as path from "path";

import { parseMarkdownFile, downloadFile } from "./open_urls_in_file";

const DOWNLOAD_INTO_MINECRAFT_FOLDER = true;
const MINECRAFT_MODS_DIR =
  "/Users/asobirov/Library/Application Support/minecraft/mods";

// Path to the markdown file
const mdFilePath = path.resolve(__dirname, "../1.20.1/client_mods.md");

const getOutputDir = () => {
  if (DOWNLOAD_INTO_MINECRAFT_FOLDER) {
    console.log("Downloading mods into the specified Minecraft mods folder.");
    const dir = path.resolve(__dirname, MINECRAFT_MODS_DIR);

    if (!fs.existsSync(dir)) {
      console.error(`Directory ${dir} does not exist.`);
      process.exit(1);
    }

    return dir;
  }

  return path.resolve(__dirname, "./client-mods");
};

(async () => {
  try {
    const urls = await parseMarkdownFile(mdFilePath);
    const outputDir = getOutputDir();

    fs.ensureDirSync(outputDir);

    const downloadedFiles = new Set<string>();
    let reusedCount = 0;
    let downloadedCount = 0;
    let deletedCount = 0;

    for (const url of urls) {
      const fileName = path.basename(url);
      const outputPath = path.join(outputDir, fileName);

      downloadedFiles.add(fileName);

      if (fs.existsSync(outputPath)) {
        console.log(`SKIP: File ${fileName} already exists.`);
        reusedCount++;
        continue;
      }

      console.log(`Downloading ${url} to ${outputPath}`);
      await downloadFile(url, outputPath);
      console.log(`DOWNLOAD: ${fileName}`);
      downloadedCount++;
    }

    // Delete old mods not listed in the markdown file
    const filesInOutputDir = fs.readdirSync(outputDir);
    for (const file of filesInOutputDir) {
      // ignore ".connector" folder
      if (file === ".connector") {
        console.log(`SKIP: Folder ${file} is ignored.`);
        continue;
      }

      if (!downloadedFiles.has(file) ) {
        const filePath = path.join(outputDir, file);
        console.warn(`DELETE: old mod ${file}`);
        fs.unlinkSync(filePath);
        deletedCount++;
      }
    }

    console.log("----------");
    console.log("All mods downloaded and cleaned up successfully.");
    console.log(
      `Summary: ${downloadedCount} downloaded, ${reusedCount} reused, ${deletedCount} deleted.`
    );
  } catch (error) {
    console.error("Error:", error);
  }
})();
