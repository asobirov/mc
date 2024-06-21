import axios from "axios";
import * as fs from "fs-extra";
import * as path from "path";

// Path to the markdown file
const mdFilePath = path.resolve(__dirname, '../1.20.1/client_mods.md');
// Output directory
const outputDir = path.resolve(__dirname, './mods');

// Ensure the output directory exists
fs.ensureDirSync(outputDir);

// Function to parse the markdown file and extract mod URLs
const parseMarkdownFile = async (filePath: string) => {
  const fileContent = await fs.readFile(filePath, "utf-8");
  const urlPattern = /(https?:\/\/[^\s]+)/g;
  const urls = fileContent.match(urlPattern);
  return urls || [];
};

// Function to download a file
const downloadFile = async (url: string, outputPath: string) => {
  const writer = fs.createWriteStream(outputPath);
  const response = await axios({
    url,
    method: "GET",
    responseType: "stream",
  });

  response.data.pipe(writer);

  return new Promise<void>((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
};

// Main function to parse the markdown file and download mods
const main = async () => {
  try {
    const urls = await parseMarkdownFile(mdFilePath);

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
