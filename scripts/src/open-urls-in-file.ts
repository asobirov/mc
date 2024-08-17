import axios from "axios";
import { promises as fs, createWriteStream } from "fs";

/**
 * Function to parse a markdown file and extract URLs
 */
export const parseMarkdownFile = async (filePath: string) => {
  const fileContent = await fs.readFile(filePath, "utf-8");
  const urlPattern = /(https?:\/\/[^\s]+)/g;
  const urls = fileContent.match(urlPattern);
  return urls || [];
};

// Function to download a file
export const downloadFile = async (url: string, outputPath: string) => {
  const writer = createWriteStream(outputPath);
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
