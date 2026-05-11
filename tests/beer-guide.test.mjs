import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

import { beers, pageSections, pageMeta } from "../src/data.js";
import {
  filterBeers,
  derivePriceBand,
  pickActiveBeer,
  summarizeSelection,
  summarizeCatalogueStatus,
  getScenePresets,
} from "../src/app.js";

const DEFAULT_FILTERS = {
  crowd: "全部",
  taste: "全部",
  country: "全部",
  style: "全部",
  priceBand: "全部",
  search: "",
};

test("beer dataset contains enough curated entries with required fields", () => {
  assert.ok(
    beers.length >= 30 && beers.length <= 60,
    "expected 30-60 curated beer entries",
  );

  for (const beer of beers) {
    assert.ok(beer.id, "beer.id is required");
    assert.ok(beer.brand, "beer.brand is required");
    assert.ok(beer.name, "beer.name is required");
    assert.ok(beer.country, "beer.country is required");
    assert.ok(beer.style, "beer.style is required");
    assert.equal(typeof beer.abv, "number", "beer.abv must be numeric");
    assert.ok(Array.isArray(beer.tasteTags) && beer.tasteTags.length > 0);
    assert.ok(Array.isArray(beer.crowdTags) && beer.crowdTags.length > 0);
    assert.ok(Array.isArray(beer.sceneTags) && beer.sceneTags.length > 0);
    assert.equal(typeof beer.priceCny, "number", "beer.priceCny must be numeric");
    assert.equal(typeof beer.ingredientsSummary, "string");
    assert.equal(typeof beer.spec, "string");
    assert.equal(typeof beer.priceSource, "string");
    assert.equal(typeof beer.updatedAt, "string");
    assert.equal(typeof beer.image, "string", "beer.image is required");
    assert.match(beer.imageKind, /^(real|generated)$/);
    assert.equal(typeof beer.tagline, "string", "beer.tagline is required");
    assert.equal(typeof beer.description, "string", "beer.description is required");
    assert.equal(typeof beer.pairing, "string", "beer.pairing is required");
    assert.equal(typeof beer.serveTemp, "string", "beer.serveTemp is required");
    assert.ok(
      Array.isArray(beer.highlightTags) && beer.highlightTags.length >= 2,
      "beer.highlightTags should have multiple entries",
    );
  }
});

test("every beer image points to an existing local asset", () => {
  for (const beer of beers) {
    const relativePath = beer.image.replace(/^\.\//, "");
    const absolutePath = path.join(process.cwd(), relativePath);
    assert.ok(fs.existsSync(absolutePath), `missing image asset for ${beer.id}: ${beer.image}`);
  }
});

test("derivePriceBand maps curated beer prices into stable ranges", () => {
  assert.equal(derivePriceBand(8), "平价");
  assert.equal(derivePriceBand(15), "日常");
  assert.equal(derivePriceBand(24), "进阶");
  assert.equal(derivePriceBand(38), "尝鲜");
});

test("filterBeers supports combined crowd, taste, country, style, and price filters", () => {
  const results = filterBeers(beers, {
    crowd: "入门友好",
    taste: "清爽",
    country: "日本",
    style: "拉格",
    priceBand: "日常",
    search: "",
  });

  assert.ok(results.length > 0, "expected at least one matching beer");
  assert.ok(
    results.every((beer) => beer.crowdTags.includes("入门友好")),
    "crowd tag should match",
  );
  assert.ok(
    results.every((beer) => beer.tasteTags.includes("清爽")),
    "taste tag should match",
  );
  assert.ok(results.every((beer) => beer.country === "日本"));
  assert.ok(results.every((beer) => beer.style === "拉格"));
  assert.ok(results.every((beer) => derivePriceBand(beer.priceCny) === "日常"));
});

test("filterBeers searches across brand, name, style, and country", () => {
  const results = filterBeers(beers, {
    crowd: "全部",
    taste: "全部",
    country: "全部",
    style: "全部",
    priceBand: "全部",
    search: "比利时 小麦",
  });

  assert.ok(results.length > 0, "expected fuzzy-style search results");
  assert.ok(
    results.some(
      (beer) =>
        `${beer.country} ${beer.style} ${beer.brand} ${beer.name}`.includes("比利时") &&
        `${beer.country} ${beer.style} ${beer.brand} ${beer.name}`.includes("小麦"),
    ),
  );
});

test("summarizeSelection produces a human-readable summary for the hero panel", () => {
  const summary = summarizeSelection({
    crowd: "聚会囤货",
    taste: "麦香",
    country: "德国",
    style: "小麦啤",
    priceBand: "进阶",
    search: "白啤",
  });

  assert.match(summary, /聚会囤货/);
  assert.match(summary, /麦香/);
  assert.match(summary, /德国/);
  assert.match(summary, /小麦啤/);
  assert.match(summary, /进阶/);
  assert.match(summary, /白啤/);
});

test("pickActiveBeer preserves selection when possible and falls back to first result", () => {
  const first = beers[0];
  const second = beers[1];
  const filtered = [first, second];

  assert.equal(pickActiveBeer(filtered, second.id)?.id, second.id);
  assert.equal(pickActiveBeer(filtered, "missing-id")?.id, first.id);
  assert.equal(pickActiveBeer([], second.id), null);
});

test("content sections are data-driven and credits links are structured", () => {
  assert.equal(pageSections.length, 3);
  assert.deepEqual(
    pageSections.map((section) => section.id),
    ["notes", "about", "credits"],
  );

  const credits = pageSections.find((section) => section.id === "credits");
  assert.ok(credits, "credits section should exist");
  assert.ok(
    credits.items.some((item) => Array.isArray(item.links) && item.links.length > 0),
    "credits section should include structured source links",
  );
  assert.equal(pageMeta.countryCount, new Set(beers.map((beer) => beer.country)).size);
  assert.equal(pageMeta.decisionDimensions, 5);
});

test("index.html boots with classic scripts so it can open directly from the filesystem", () => {
  const html = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8");

  assert.doesNotMatch(html, /type="module"/);
  assert.match(html, /src="\.\/data\.global\.js"/);
  assert.match(html, /src="\.\/app\.global\.js"/);
  assert.doesNotMatch(html, /initBeerGuide\(window\.BeerGuideData\.beers\)/);
  assert.match(html, /data-section="notes"/);
  assert.match(html, /data-detail-dialog/);
});

test("global bundle stays in sync with the filesystem entry DOM contract", () => {
  const bundle = fs.readFileSync(new URL("../app.global.js", import.meta.url), "utf8");

  assert.match(bundle, /document\.querySelector\("\[data-filter-summary\]"\)/);
  assert.match(bundle, /document\.querySelector\("\[data-catalogue-status\]"\)/);
  assert.match(bundle, /document\.querySelector\("\[data-scene-picks\]"\)/);
  assert.match(bundle, /scenePresets:\s*getScenePresets\(beers\)/);
  assert.match(bundle, /window\.BeerGuideApp = \{ initBeerGuide, bootBeerGuide \}/);
  assert.doesNotMatch(bundle, /\[data-summary\]/);
  assert.doesNotMatch(bundle, /\[data-quick-picks\]/);
});

test("index.html exposes cinematic hero, scene picks, and upgraded filter shell", () => {
  const html = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8");

  assert.match(html, /data-hero-stage/);
  assert.match(html, /data-scene-picks/);
  assert.match(html, /data-scroll-target="catalogue"/);
  assert.match(html, /data-filter-summary/);
  assert.match(html, /data-catalogue-status/);
  assert.doesNotMatch(html, /hero-panel/);
});

test("index.html hero and catalogue sections expose cinematic structure", () => {
  const html = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8");

  assert.match(html, /class="hero hero-stage"/);
  assert.match(html, /data-scene-picks/);
  assert.match(html, /id="scenes"/);
  assert.match(html, /data-catalogue-status/);
  assert.match(html, /data-filter-summary/);
  assert.match(html, /data-scroll-target="scenes"/);
});

test("styles define cinematic hero, scene cards, and upgraded catalogue chrome", () => {
  const stylesSource = fs.readFileSync(new URL("../styles.css", import.meta.url), "utf8");

  assert.match(stylesSource, /:root\s*\{[\s\S]*--bg:\s*#0/i);
  assert.match(stylesSource, /\.hero-stage\b/);
  assert.match(stylesSource, /\.hero-backdrop\b/);
  assert.match(stylesSource, /\.scene-band\b/);
  assert.match(stylesSource, /\.scene-card\b/);
  assert.match(stylesSource, /\.catalogue-status\b/);
});

test("styles keep premium desktop flow and mobile ergonomics aligned", () => {
  const stylesSource = fs.readFileSync(new URL("../styles.css", import.meta.url), "utf8");

  assert.match(stylesSource, /\.section\[data-section\]\s*\{/);
  assert.match(stylesSource, /\.section\[data-section\]\s+\.note-card\b/);
  assert.match(
    stylesSource,
    /@media \(max-width: 720px\)[\s\S]*\.scene-picks\s*\{[\s\S]*grid-auto-flow:\s*column/i,
  );
  assert.match(
    stylesSource,
    /@media \(max-width: 720px\)[\s\S]*\.hero-actions\s*\{[\s\S]*grid-template-columns:\s*1fr/i,
  );
  assert.match(
    stylesSource,
    /@media \(max-width: 720px\)[\s\S]*\.filter-toggle\s*\{[\s\S]*bottom:\s*max\(/i,
  );
});

test("detail surface keeps modal entrypoints while using the new grouped detail layout", () => {
  const appSource = fs.readFileSync(new URL("../src/app.js", import.meta.url), "utf8");
  const stylesSource = fs.readFileSync(new URL("../styles.css", import.meta.url), "utf8");

  assert.match(appSource, /setDetailTransitionState/);
  assert.match(appSource, /focusWithoutScroll/);
  assert.match(appSource, /preventScroll: true/);
  assert.match(appSource, /restoreWindowScroll/);
  assert.match(appSource, /window\.scrollY/);
  assert.match(appSource, /detail-facts-primary/);
  assert.match(appSource, /detail-block-story/);
  assert.match(appSource, /detail-brand/);
  assert.match(appSource, /detail-chip/);
  assert.match(appSource, /How To Drink/);
  assert.match(stylesSource, /\.guide-grid\.is-detail-active \.beer-card/);
  assert.match(stylesSource, /\.detail-dialog \[data-detail\]/);
  assert.match(stylesSource, /\.detail-media-frame/);
  assert.match(stylesSource, /\.detail-facts-primary \{/);
});

test("detail and catalogue source keep cinematic interaction hooks", () => {
  const appSource = fs.readFileSync(new URL("../src/app.js", import.meta.url), "utf8");
  const stylesSource = fs.readFileSync(new URL("../styles.css", import.meta.url), "utf8");

  assert.match(appSource, /data-filter-summary/);
  assert.match(appSource, /data-catalogue-status/);
  assert.match(appSource, /data-scene-preset/);
  assert.match(appSource, /data-scroll-target/);
  assert.match(appSource, /filterSummary\.textContent = summarizeSelection/);
  assert.match(appSource, /catalogueStatus\.textContent = summarizeCatalogueStatus/);
  assert.match(appSource, /trigger\.dataset\.scenePreset/);
  assert.match(appSource, /detailDialog\.dataset\.state = value/);

  assert.match(stylesSource, /\.beer-card:hover/);
  assert.match(stylesSource, /\.section\[data-reveal\]\.is-visible/);
  assert.match(stylesSource, /\.detail-dialog\.is-open/);
  assert.match(stylesSource, /\.beer-card\.is-hovered/);
  assert.match(stylesSource, /\.beer-card\.is-pressed/);
  assert.match(stylesSource, /\.detail-dialog\[data-state="opening"\]/);
  assert.match(stylesSource, /\.detail-dialog\[data-state="closing"\]/);
});

test("scene presets are backed by real beers and real filters", () => {
  const presets = getScenePresets(beers);
  const beerIds = new Set(beers.map((beer) => beer.id));

  assert.deepEqual(
    presets.map((preset) => preset.id),
    ["easy-drinking", "party-crate", "fruity-social", "ipa-upgrade"],
  );
  assert.ok(presets.every((preset) => beerIds.has(preset.beerId)));
  assert.ok(
    presets.every(
      (preset) => filterBeers(beers, { ...DEFAULT_FILTERS, ...preset.filters }).length > 0,
    ),
  );
});

test("summarizeCatalogueStatus returns guide-like copy", () => {
  assert.match(summarizeCatalogueStatus(DEFAULT_FILTERS, 12), /12/);

  const filteredCopy = summarizeCatalogueStatus(
    {
      ...DEFAULT_FILTERS,
      crowd: "入门友好",
      taste: "清爽",
      search: "白啤",
    },
    2,
  );

  assert.match(filteredCopy, /2/);
  assert.match(filteredCopy, /入门友好/);
  assert.match(filteredCopy, /清爽/);
  assert.match(filteredCopy, /白啤/);
});

test("vercel deployment declares the project root as the output directory", () => {
  const vercelConfigPath = path.join(process.cwd(), "vercel.json");

  assert.ok(fs.existsSync(vercelConfigPath), "expected vercel.json to exist");

  const vercelConfig = JSON.parse(fs.readFileSync(vercelConfigPath, "utf8"));
  assert.equal(vercelConfig.outputDirectory, ".");
});
