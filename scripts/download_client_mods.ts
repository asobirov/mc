import axios from "axios";
import * as fs from "fs-extra";
import * as path from "path";

import { parseMarkdownFile } from "./open_urls_in_file";

// Path to the markdown file
const mdFilePath = path.resolve(__dirname, "../1.20.1/client_mods.md");
// Output directory
const outputDir = path.resolve(__dirname, "./client-mods");

const main = async () => {
  try {
    const urls = await parseMarkdownFile(mdFilePath);

    fs.ensureDirSync(outputDir);

    for (const url of urls) {
      const fileName = path.basename(url);
      const outputPath = path.join(outputDir, fileName);
      console.log(`Downloading ${url} to ${outputPath}`);
      await downloadFile(url, outputPath);
      console.log(`Downloaded ${fileName}`);
    }

    console.log("All mods downloaded successfully.");
  } catch (error) {
    console.error("Error:", error);
  }
};

// Run the main function
main();
