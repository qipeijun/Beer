import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

import { beers } from "../src/data.js";
import {
  filterBeers,
  derivePriceBand,
  pickActiveBeer,
  summarizeSelection,
} from "../src/app.js";

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

test("index.html boots with classic scripts so it can open directly from the filesystem", () => {
  const html = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8");

  assert.doesNotMatch(html, /type="module"/);
  assert.match(html, /src="\.\/data\.global\.js"/);
  assert.match(html, /src="\.\/app\.global\.js"/);
});
