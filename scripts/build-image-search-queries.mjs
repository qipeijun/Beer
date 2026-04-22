import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { beers } from "../src/data.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const outputPath = path.join(projectRoot, "docs", "image-search-queries.json");

function normalizeTerms(beer) {
  const aliases = [];

  if (beer.brand === "乐飞") aliases.push("Leffe Blonde");
  if (beer.brand === "白熊") aliases.push("Vedett Extra White");
  if (beer.brand === "爱士堡") aliases.push("Erdinger Weissbier");
  if (beer.brand === "教士") aliases.push("Franziskaner Hefe Weissbier");
  if (beer.brand === "唯森") aliases.push("Weihenstephaner Hefeweissbier");
  if (beer.brand === "贝克格") aliases.push("Bitburger Pils");
  if (beer.brand === "富乐") aliases.push("Fuller's London Pride");
  if (beer.brand === "内华达山脉") aliases.push("Sierra Nevada Pale Ale");
  if (beer.brand === "巴拉斯特角") aliases.push("Ballast Point Sculpin IPA");
  if (beer.brand === "石头") aliases.push("Stone IPA");
  if (beer.brand === "奥瓦尔") aliases.push("Orval Trappist Ale");
  if (beer.brand === "督威") aliases.push("Duvel Golden Ale");
  if (beer.brand === "维斯特玛") aliases.push("Westmalle Dubbel");
  if (beer.brand === "常陆野猫头鹰") aliases.push("Hitachino White Ale");
  if (beer.brand === "馨和") aliases.push("Yo-Ho Brewing Yona Yona / Indo no Aooni");
  if (beer.brand === "少爷啤") aliases.push("Young Master Cha Chaan Teng Gose");
  if (beer.brand === "高大师") aliases.push("Master Gao Baby Jasmine Pils");

  const englishLikeName = [beer.brand, beer.name].join(" ");

  return [...new Set([englishLikeName, ...aliases])];
}

function buildMethods(beer) {
  const terms = normalizeTerms(beer);
  const primary = terms[0];
  const alias = terms[1] ?? primary;

  return {
    wikimedia_file_search: [
      `site:commons.wikimedia.org/wiki/File: "${primary}" beer`,
      `site:commons.wikimedia.org/wiki/File: "${primary}" bottle`,
      `site:commons.wikimedia.org/wiki/File: "${alias}" can`
    ],
    wikimedia_category_search: [
      `site:commons.wikimedia.org/wiki/Category: "${beer.brand}" beer`,
      `site:commons.wikimedia.org "${primary}" Wikimedia Commons`,
      `site:commons.wikimedia.org "${beer.country} beer ${beer.name}" Commons`
    ],
    official_brand_asset_search: [
      `"${primary}" official product image`,
      `"${primary}" media kit bottle png`,
      `"${beer.brand}" 官方 产品图 啤酒`
    ],
    structured_open_data_search: [
      `"${primary}" Wikidata image`,
      `"${primary}" Open Food Facts beer`,
      `"${primary}" Wikipedia bottle image`
    ],
    retail_reference_search: [
      `"${primary}" can bottle packshot`,
      `"${beer.brand}" ${beer.name} 电商 图`,
      `"${primary}" bottle transparent png`
    ]
  };
}

const remaining = beers
  .filter((beer) => beer.imageKind !== "real")
  .map((beer) => ({
    id: beer.id,
    brand: beer.brand,
    name: beer.name,
    country: beer.country,
    style: beer.style,
    priority:
      ["中国", "美国", "德国", "比利时", "日本"].includes(beer.country) ? "high" : "medium",
    searchMethods: buildMethods(beer)
  }));

await fs.writeFile(outputPath, `${JSON.stringify(remaining, null, 2)}\n`, "utf8");
console.log(`wrote ${outputPath}`);
