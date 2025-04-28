import * as fs from "fs";
import { createWriteStream } from "fs";
import chalk from "chalk";

import * as path from "path";
import axios from "axios";

type DownloadStatus = "skipped" | "downloaded";

export const downloadModByUrl = async ({
  filename,
  outputDirs,
  slug,
  url,
}: {
  slug: string;
  filename: string;
  url: string;
  outputDirs: string[];
}): Promise<{
  status: DownloadStatus;
}> => {
  const outputPaths = outputDirs.map(dir => path.join(dir, filename));

  // make sure output dirs exist
  for (const dir of outputDirs) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Check if file exists in any of the directories
  if (outputPaths.some(path => fs.existsSync(path))) {
    console.log(
      `${chalk.cyan(`SKIP (${chalk.cyan.dim(slug)}):`)} File ${chalk.italic(
        filename
      )} already exists.`
    );
    return {
      status: "skipped",
    };
  }

  console.log(
    chalk.dim(
      `Downloading ${slug} - ${chalk.italic(url)} to ${chalk.blueBright.bold(
        outputDirs.join(", ")
      )}...`
    )
  );
  await downloadFile(url, outputPaths);

  console.log(`${chalk.green(`DOWNLOAD COMPLETE (${slug}):`)} ${filename}`);

  return {
    status: "downloaded",
  };
};

const downloadFile = async (url: string, outputPaths: string[]) => {
  const promises: Promise<void>[] = [];

  for (const outputPath of outputPaths) {
    const writer = createWriteStream(outputPath);
    const response = await axios({
      url,
      method: "GET",
      responseType: "stream",
    });

    response.data.pipe(writer);

    promises.push(
      new Promise<void>((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      })
    );
  }

  await Promise.all(promises);
};
