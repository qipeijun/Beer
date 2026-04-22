import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { beers } from "../src/data.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const outputDir = path.join(projectRoot, "assets", "beers");

const STYLE_COLORS = {
  拉格: ["#f8ca46", "#f49a36"],
  皮尔森: ["#f7d65b", "#f3b057"],
  小麦啤: ["#ffe4af", "#f6a749"],
  IPA: ["#ffad4a", "#f06a2f"],
  世涛: ["#4a3428", "#1d1716"],
  修道院啤酒: ["#704326", "#341d14"],
  "美式淡色艾尔": ["#efb65f", "#d07d31"],
  "英式艾尔": ["#bb7a45", "#7f4521"],
  "金色艾尔": ["#f2c55b", "#d58c2d"],
  酸啤: ["#8bd6d0", "#4daeb1"]
};

const COUNTRY_SYMBOLS = {
  中国: "CN",
  美国: "US",
  日本: "JP",
  比利时: "BE",
  德国: "DE",
  荷兰: "NL",
  丹麦: "DK",
  捷克: "CZ",
  爱尔兰: "IE",
  英国: "UK",
  墨西哥: "MX"
};

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function brandGradient(beer) {
  return STYLE_COLORS[beer.style] ?? ["#f7c85b", "#db7a32"];
}

function packShape(beer) {
  if (beer.spec.includes("听装")) {
    return `
      <rect x="220" y="88" width="160" height="320" rx="38" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.28)" />
      <rect x="238" y="122" width="124" height="250" rx="28" fill="rgba(255,255,255,0.9)" />
      <rect x="258" y="152" width="84" height="94" rx="20" fill="rgba(0,0,0,0.08)" />
    `;
  }

  return `
    <path d="M285 70h30c10 0 18 8 18 18v40c0 10-3 18-8 26l-6 12v220c0 17-14 31-31 31h-6c-17 0-31-14-31-31V166l-6-12c-5-8-8-16-8-26V88c0-10 8-18 18-18z" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.28)" />
    <path d="M273 118h54c6 0 10 4 10 10v243c0 18-15 33-33 33h-8c-18 0-33-15-33-33V128c0-6 4-10 10-10z" fill="rgba(255,255,255,0.9)" />
    <rect x="257" y="176" width="86" height="110" rx="16" fill="rgba(0,0,0,0.08)" />
  `;
}

function renderPoster(beer) {
  const [c1, c2] = brandGradient(beer);
  const symbol = COUNTRY_SYMBOLS[beer.country] ?? beer.country.slice(0, 2).toUpperCase();
  const tags = beer.highlightTags.slice(0, 2).map((tag, index) => {
    const x = index === 0 ? 72 : 196;
    return `<g transform="translate(${x} 420)">
      <rect width="112" height="30" rx="15" fill="rgba(255,255,255,0.18)" />
      <text x="56" y="20" text-anchor="middle" font-size="13" fill="#fff">${esc(tag)}</text>
    </g>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="640" height="520" viewBox="0 0 640 520" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="58" y1="42" x2="570" y2="478" gradientUnits="userSpaceOnUse">
      <stop stop-color="${c1}" />
      <stop offset="1" stop-color="${c2}" />
    </linearGradient>
  </defs>
  <rect x="14" y="14" width="612" height="492" rx="36" fill="url(#bg)"/>
  <circle cx="114" cy="104" r="68" fill="rgba(255,255,255,0.16)"/>
  <circle cx="540" cy="78" r="48" fill="rgba(255,255,255,0.16)"/>
  <circle cx="496" cy="426" r="94" fill="rgba(255,255,255,0.1)"/>
  <text x="70" y="92" font-size="18" fill="rgba(255,255,255,0.88)" font-family="Arial, sans-serif" letter-spacing="4">${esc(symbol)}</text>
  <text x="70" y="150" font-size="44" fill="#fff" font-family="Arial, sans-serif" font-weight="700">${esc(beer.brand)}</text>
  <text x="70" y="194" font-size="30" fill="rgba(255,255,255,0.9)" font-family="Arial, sans-serif">${esc(beer.name)}</text>
  <text x="70" y="238" font-size="16" fill="rgba(255,255,255,0.85)" font-family="Arial, sans-serif">${esc(`${beer.country} · ${beer.style} · ${beer.abv.toFixed(1)}%`)}</text>
  <text x="70" y="284" font-size="18" fill="rgba(255,255,255,0.92)" font-family="Arial, sans-serif">${esc(beer.tagline)}</text>
  ${packShape(beer)}
  <rect x="266" y="186" width="68" height="92" rx="20" fill="rgba(255,255,255,0.2)" />
  <text x="300" y="234" text-anchor="middle" font-size="16" fill="#fff" font-family="Arial, sans-serif" font-weight="700">${esc(beer.country)}</text>
  <text x="300" y="258" text-anchor="middle" font-size="14" fill="#fff" font-family="Arial, sans-serif">${esc(beer.style)}</text>
  <text x="70" y="370" font-size="15" fill="rgba(255,255,255,0.88)" font-family="Arial, sans-serif">${esc(`推荐搭配：${beer.pairing}`)}</text>
  ${tags.join("")}
</svg>`;
}

function renderScene(beer) {
  const [c1, c2] = brandGradient(beer);
  const foods = beer.pairing.split("、").slice(0, 3).join(" · ");
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="960" height="640" viewBox="0 0 960 640" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="scene" x1="80" y1="52" x2="780" y2="560" gradientUnits="userSpaceOnUse">
      <stop stop-color="${c1}" />
      <stop offset="1" stop-color="${c2}" />
    </linearGradient>
  </defs>
  <rect x="20" y="20" width="920" height="600" rx="42" fill="url(#scene)"/>
  <rect x="84" y="110" width="792" height="368" rx="28" fill="rgba(255,255,255,0.14)"/>
  <rect x="120" y="420" width="720" height="30" rx="15" fill="rgba(34,24,18,0.18)"/>
  <circle cx="224" cy="268" r="88" fill="rgba(255,255,255,0.18)"/>
  <circle cx="736" cy="220" r="58" fill="rgba(255,255,255,0.15)"/>
  <text x="120" y="170" font-size="44" fill="#fff" font-family="Arial, sans-serif" font-weight="700">${esc(`${beer.brand} ${beer.name}`)}</text>
  <text x="120" y="224" font-size="22" fill="rgba(255,255,255,0.9)" font-family="Arial, sans-serif">${esc(beer.description)}</text>
  <text x="120" y="528" font-size="22" fill="#fff" font-family="Arial, sans-serif">${esc(`适饮温度 ${beer.serveTemp} · 推荐搭配 ${foods}`)}</text>
  <text x="120" y="566" font-size="18" fill="rgba(255,255,255,0.86)" font-family="Arial, sans-serif">${esc(beer.story)}</text>
</svg>`;
}

await fs.mkdir(outputDir, { recursive: true });

for (const beer of beers) {
  await fs.writeFile(path.join(outputDir, `${beer.id}.svg`), renderPoster(beer), "utf8");
  for (const image of beer.gallery ?? []) {
    const filename = path.basename(image);
    await fs.writeFile(path.join(outputDir, filename), renderScene(beer), "utf8");
  }
}

console.log(`generated ${beers.length} poster assets in ${outputDir}`);
