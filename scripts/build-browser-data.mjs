import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { beers, pageSections, pageMeta } from "../src/data.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const outputPath = path.join(projectRoot, "data.global.js");

const contents = `window.BeerGuideData = ${JSON.stringify({ beers, pageSections, pageMeta }, null, 2)};\n`;

await fs.writeFile(outputPath, contents, "utf8");
console.log(`wrote ${outputPath}`);
