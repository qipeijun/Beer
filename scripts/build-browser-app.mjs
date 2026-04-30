import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const sourcePath = path.join(projectRoot, "src", "app.js");
const outputPath = path.join(projectRoot, "app.global.js");

const source = await fs.readFile(sourcePath, "utf8");

const transformed = source
  .replaceAll(/^export function /gm, "function ")
  .replaceAll(/^export const /gm, "const ");

const output = `(function () {\n  "use strict";\n\n${transformed}\n\n  window.BeerGuideApp = { initBeerGuide, bootBeerGuide };\n})();\n`;

await fs.writeFile(outputPath, output, "utf8");
console.log(`wrote ${outputPath}`);
