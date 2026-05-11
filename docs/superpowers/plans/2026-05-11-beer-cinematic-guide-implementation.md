# Beer Apple-Style Guide Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将夏日啤酒指南重构为更接近 Apple 产品页气质的高端导购页面，同时保留当前真实筛选、结果和详情能力。

**Architecture:** 继续沿用当前静态站点架构，不引入新依赖，不改动数据结构。`index.html` 负责页面骨架与语义锚点，`styles.css` 负责浅暖高端视觉系统、响应式和微交互，`src/app.js` 负责场景入口、状态摘要、结果文案与详情联动，`tests/beer-guide.test.mjs` 负责锁定结构和关键导购行为。

**Tech Stack:** HTML、CSS、原生 JavaScript、Node test runner (`node --test`)、构建脚本 (`npm run build`)

---

## File Map

- Modify: `/Users/qipeijun/Downloads/Beer/index.html`
  - 收束为 Apple 式首屏、场景入口、控制台和结果区语义骨架
- Modify: `/Users/qipeijun/Downloads/Beer/styles.css`
  - 重建浅暖产品页视觉、玻璃重点材质、响应式与动效节奏
- Modify: `/Users/qipeijun/Downloads/Beer/src/app.js`
  - 调整场景文案、摘要文案、结果状态与交互同步逻辑
- Modify: `/Users/qipeijun/Downloads/Beer/tests/beer-guide.test.mjs`
  - 锁住新结构、真实场景映射、状态摘要和页面文案
- Regenerate: `/Users/qipeijun/Downloads/Beer/app.global.js`
  - 从 `src/app.js` 重新生成浏览器加载产物

## Task 1: 锁定 Apple 风格页面契约

**Files:**
- Modify: `/Users/qipeijun/Downloads/Beer/tests/beer-guide.test.mjs`
- Test: `/Users/qipeijun/Downloads/Beer/tests/beer-guide.test.mjs`

- [ ] **Step 1: 先写失败测试，锁住首屏和控制台语义结构**

```js
test("index.html exposes apple-style hero and decision-layer anchors", () => {
  const html = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8");

  assert.match(html, /data-hero-stage/);
  assert.match(html, /Scene Picks/);
  assert.match(html, /Decision Layer/);
  assert.match(html, /Curated Catalogue/);
  assert.match(html, /data-filter-summary/);
  assert.match(html, /data-catalogue-status/);
});
```

- [ ] **Step 2: 再写失败测试，锁住真实场景映射和结果文案**

```js
test("scene presets map to real beers and exact filters", () => {
  const presets = getScenePresets(beers);
  const beerIds = new Set(beers.map((beer) => beer.id));

  assert.deepEqual(
    presets.map((preset) => preset.id),
    ["easy-drinking", "party-crate", "fruity-social", "ipa-upgrade"],
  );
  assert.ok(presets.every((preset) => beerIds.has(preset.beer.id)));
  assert.ok(presets.every((preset) => Object.keys(preset.filters).length > 0));
});

test("catalogue status copy stays guide-like and stateful", () => {
  const copy = summarizeCatalogueStatus(
    {
      crowd: "入门友好",
      taste: "清爽",
      country: "全部",
      style: "全部",
      priceBand: "全部",
      search: "",
    },
    3,
    beers.length,
  );

  assert.match(copy, /3/);
  assert.match(copy, /入门友好/);
  assert.match(copy, /清爽/);
});
```

- [ ] **Step 3: 运行测试，确认当前实现先真实失败**

Run: `node --test tests/beer-guide.test.mjs --test-name-pattern="apple-style hero|scene presets|catalogue status"`

Expected: FAIL，指出结构标记、文案或行为与新契约不符

- [ ] **Step 4: 保持失败结果作为实施起点，不做空实现兜底**

```txt
不新增临时空函数或占位返回值，直接进入后续真实实现任务。
```

- [ ] **Step 5: Commit**

```bash
git add tests/beer-guide.test.mjs
git commit -m "测试锁定苹果风导购页契约"
```

## Task 2: 重构 HTML 为发布页骨架

**Files:**
- Modify: `/Users/qipeijun/Downloads/Beer/index.html`
- Modify: `/Users/qipeijun/Downloads/Beer/tests/beer-guide.test.mjs`
- Test: `/Users/qipeijun/Downloads/Beer/tests/beer-guide.test.mjs`

- [ ] **Step 1: 补结构断言，锁住 Hero、Scene Picks 和 Decision Layer 文案**

```js
test("index.html contains product-page style section copy", () => {
  const html = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8");

  assert.match(html, /Summer Beer Guide 2026/);
  assert.match(html, /先找到适合今晚的那一支/);
  assert.match(html, /Decision Layer/);
  assert.match(html, /按你真正会用的维度筛/);
});
```

- [ ] **Step 2: 运行测试，确认结构断言失败**

Run: `node --test tests/beer-guide.test.mjs --test-name-pattern="product-page style section copy"`

Expected: FAIL

- [ ] **Step 3: 修改 `index.html`，把首屏和控制台头部收成产品页骨架**

```html
<section class="hero hero-stage" data-hero-stage aria-labelledby="hero-title">
  <div class="hero-backdrop" aria-hidden="true"></div>
  <div class="hero-content">
    <p class="eyebrow">Summer Beer Guide 2026</p>
    <h1 id="hero-title">先找到适合今晚的那一支。</h1>
    <p class="hero-lede">
      从清爽解暑到 IPA 进阶，用更像产品页的方式，帮你更快收拢值得开的那一瓶酒。
    </p>
    <div class="hero-actions">...</div>
    <div class="hero-stats" aria-label="数据概览">...</div>
  </div>
</section>

<section id="scenes" class="section scene-band" data-reveal>
  <div class="section-heading">
    <div>
      <p class="eyebrow">Scene Picks</p>
      <h2>先按今晚的场景进。</h2>
    </div>
  </div>
  <div class="scene-picks" data-scene-picks></div>
</section>

<div class="filters-header">
  <div>
    <p class="eyebrow">Decision Layer</p>
    <h2>按你真正会用的维度筛</h2>
  </div>
  <button type="button" class="button-secondary" data-reset>清空条件</button>
</div>
```

- [ ] **Step 4: 再跑结构测试，确认 HTML 契约通过**

Run: `node --test tests/beer-guide.test.mjs --test-name-pattern="product-page style section copy|apple-style hero"`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add index.html tests/beer-guide.test.mjs
git commit -m "重构苹果风导购页骨架"
```

## Task 3: 调整场景入口和状态文案逻辑

**Files:**
- Modify: `/Users/qipeijun/Downloads/Beer/src/app.js`
- Modify: `/Users/qipeijun/Downloads/Beer/tests/beer-guide.test.mjs`
- Test: `/Users/qipeijun/Downloads/Beer/tests/beer-guide.test.mjs`

- [ ] **Step 1: 写失败测试，锁住更克制的场景文案和结果摘要**

```js
test("scene preset copy stays concise and product-like", () => {
  const presets = getScenePresets(beers);

  assert.equal(presets[0].title, "清爽解暑");
  assert.match(presets[0].description, /轻松|入口|开喝/);
  assert.match(presets[3].description, /啤酒花|表达|进阶/);
});

test("summarizeSelection and status copy stay concise", () => {
  assert.match(
    summarizeSelection({
      crowd: "入门友好",
      taste: "清爽",
      country: "全部",
      style: "全部",
      priceBand: "全部",
      search: "",
    }),
    /当前关注：入门友好 \/ 清爽/,
  );

  assert.match(
    summarizeCatalogueStatus({
      crowd: "全部",
      taste: "全部",
      country: "全部",
      style: "全部",
      priceBand: "全部",
      search: "",
    }, 12, beers.length),
    /值得先看|先从一个场景入口开始/,
  );
});
```

- [ ] **Step 2: 跑测试，确认当前文案不完全符合新计划**

Run: `node --test tests/beer-guide.test.mjs --test-name-pattern="scene preset copy|stay concise"`

Expected: FAIL

- [ ] **Step 3: 修改 `src/app.js`，只基于真实字段调整 preset 和文案**

```js
export const SCENE_PRESET_CONFIG = [
  {
    id: "easy-drinking",
    title: "清爽解暑",
    description: "先从干净、好入口的路线开始，适合今晚只想轻松开喝。",
    beerId: "asahi-super-dry",
    filters: { crowd: "入门友好", taste: "清爽" },
  },
  {
    id: "party-crate",
    title: "朋友聚会",
    description: "锁定好买、好拼单、开场不会出错的聚会型选择。",
    beerId: "tsingtao-classic",
    filters: { crowd: "聚会囤货", priceBand: "平价" },
  },
];
```

```js
export function summarizeCatalogueStatus(filters = DEFAULT_FILTERS, count, totalCount = null) {
  if (!count) return "按当前线索暂时还没命中，放宽一个条件再看看。";
  if (!hasActiveFilters(filters)) return `已展开 ${count} 支夏日啤酒，先从一个场景入口开始也很顺手。`;
  return `根据 ${buildActiveSegments(filters).join(" / ")}，当前替你收拢出 ${count} 支值得先看的选择。`;
}
```

- [ ] **Step 4: 运行测试，确认导购文案和场景映射通过**

Run: `node --test tests/beer-guide.test.mjs --test-name-pattern="scene preset copy|scene presets|stay concise|catalogue status"`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/app.js tests/beer-guide.test.mjs
git commit -m "收束苹果风导购文案与场景逻辑"
```

## Task 4: 重建 CSS 视觉系统和响应式布局

**Files:**
- Modify: `/Users/qipeijun/Downloads/Beer/styles.css`
- Modify: `/Users/qipeijun/Downloads/Beer/tests/beer-guide.test.mjs`
- Test: `/Users/qipeijun/Downloads/Beer/tests/beer-guide.test.mjs`

- [ ] **Step 1: 写失败测试，锁住浅暖产品页核心 token 和布局类**

```js
test("styles define light premium palette and product-page layout hooks", () => {
  const css = fs.readFileSync(new URL("../styles.css", import.meta.url), "utf8");

  assert.match(css, /--bg:\s*#f4f1ea/i);
  assert.match(css, /--ink:\s*#101114/i);
  assert.match(css, /\.hero-stage/);
  assert.match(css, /\.scene-picks/);
  assert.match(css, /\.catalogue-head/);
});
```

- [ ] **Step 2: 跑测试，确认视觉 token 测试失败**

Run: `node --test tests/beer-guide.test.mjs --test-name-pattern="light premium palette"`

Expected: FAIL

- [ ] **Step 3: 修改 `styles.css`，把整页收成浅暖克制的产品页系统**

```css
:root {
  --bg: #f4f1ea;
  --ink: #101114;
  --muted: #5f6673;
  --accent: #b88447;
  --surface: rgba(255, 255, 255, 0.78);
}

body {
  background:
    radial-gradient(circle at top right, rgba(184, 132, 71, 0.12), transparent 28%),
    linear-gradient(180deg, #f8f6f2 0%, #ede7dd 100%);
  color: var(--ink);
}

.hero-stage {
  border-radius: 36px;
  background: var(--surface);
  box-shadow: 0 30px 80px rgba(20, 24, 32, 0.12);
}
```

- [ ] **Step 4: 补桌面 / 移动端断言，保证控制台和场景区在响应式下不塌**

```js
test("styles keep product-page layout responsive", () => {
  const css = fs.readFileSync(new URL("../styles.css", import.meta.url), "utf8");

  assert.match(css, /@media \(max-width: 980px\)/);
  assert.match(css, /@media \(max-width: 720px\)/);
  assert.match(css, /\.filter-toggle/);
  assert.match(css, /\.hero-stats/);
});
```

- [ ] **Step 5: 运行测试，确认视觉样式测试通过**

Run: `node --test tests/beer-guide.test.mjs --test-name-pattern="light premium palette|responsive"`

Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add styles.css tests/beer-guide.test.mjs
git commit -m "重建苹果风导购页视觉系统"
```

## Task 5: 重新生成浏览器产物并做回归验证

**Files:**
- Modify: `/Users/qipeijun/Downloads/Beer/app.global.js`
- Test: `/Users/qipeijun/Downloads/Beer/tests/beer-guide.test.mjs`

- [ ] **Step 1: 运行源码测试，确认结构、文案和样式相关断言全过**

Run: `node --test tests/beer-guide.test.mjs`

Expected: PASS

- [ ] **Step 2: 从源码重新生成浏览器脚本产物**

Run: `npm run build`

Expected: PASS，输出更新后的 `app.global.js`，如有数据侧变动则同步更新相关构建产物

- [ ] **Step 3: 运行完整校验，确认构建后没有回归**

Run: `npm run verify`

Expected: PASS

- [ ] **Step 4: 手动抽查本地页面**

Run: `python3 -m http.server 4173`

Expected: 能在 `http://127.0.0.1:4173/index.html` 打开页面，抽查以下内容：

```txt
1. 首屏是否从暗场电影感收成浅暖产品页气质
2. Scene Picks 是否可点击并驱动真实筛选
3. 控制台摘要、结果数、清空按钮是否同步
4. 桌面和移动视口下卡片、按钮、详情层是否不拥挤
```

- [ ] **Step 5: Commit**

```bash
git add index.html styles.css src/app.js tests/beer-guide.test.mjs app.global.js
git commit -m "完成啤酒指南苹果风界面重构"
```

## Self-Review

- Spec coverage:
  - Hero、场景入口、控制台、结果区、详情层文案与视觉节奏分别由 Task 2、3、4、5 覆盖
  - 响应式与验证要求由 Task 4、5 覆盖
  - 不改数据结构、不加兜底规则由 Task 3 与 Task 5 的实现和验证边界覆盖
- Placeholder scan:
  - 无 `TODO`、`TBD`、`类似 Task N`
  - 所有任务都包含明确文件、命令与期望结果
- Type consistency:
  - 统一使用 `getScenePresets`、`summarizeSelection`、`summarizeCatalogueStatus`
  - 统一使用 `data-hero-stage`、`data-scene-picks`、`data-filter-summary`、`data-catalogue-status`
