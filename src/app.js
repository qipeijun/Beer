const DEFAULT_FILTERS = {
  crowd: "全部",
  taste: "全部",
  country: "全部",
  style: "全部",
  priceBand: "全部",
  search: ""
};

export function derivePriceBand(priceCny) {
  if (priceCny <= 10) return "平价";
  if (priceCny <= 18) return "日常";
  if (priceCny <= 30) return "进阶";
  return "尝鲜";
}

function includesFilter(value, selected) {
  return selected === "全部" || value === selected;
}

function includesTag(tags, selected) {
  return selected === "全部" || tags.includes(selected);
}

function matchesSearch(beer, search) {
  const keyword = search.trim().toLowerCase();
  if (!keyword) return true;

  const haystack = [
    beer.brand,
    beer.name,
    beer.country,
    beer.style,
    beer.tagline,
    beer.description,
    beer.pairing,
    ...beer.tasteTags,
    ...beer.crowdTags,
    ...beer.sceneTags,
    ...beer.highlightTags
  ]
    .join(" ")
    .toLowerCase();

  return keyword
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => haystack.includes(term));
}

export function filterBeers(beers, filters = DEFAULT_FILTERS) {
  return beers.filter((beer) => {
    if (!includesTag(beer.crowdTags, filters.crowd ?? "全部")) return false;
    if (!includesTag(beer.tasteTags, filters.taste ?? "全部")) return false;
    if (!includesFilter(beer.country, filters.country ?? "全部")) return false;
    if (!includesFilter(beer.style, filters.style ?? "全部")) return false;
    if (
      (filters.priceBand ?? "全部") !== "全部" &&
      derivePriceBand(beer.priceCny) !== filters.priceBand
    ) {
      return false;
    }
    return matchesSearch(beer, filters.search ?? "");
  });
}

export function summarizeSelection(filters = DEFAULT_FILTERS) {
  const segments = [
    filters.crowd,
    filters.taste,
    filters.country,
    filters.style,
    filters.priceBand
  ].filter((value) => value && value !== "全部");

  if (filters.search?.trim()) {
    segments.push(`关键词“${filters.search.trim()}”`);
  }

  return segments.length
    ? `当前关注：${segments.join(" / ")}`
    : "从人群、口感、产地和价格带切入，快速找到适合夏天的那一杯。";
}

export function pickActiveBeer(results, currentId) {
  if (!results.length) return null;
  return results.find((beer) => beer.id === currentId) ?? results[0];
}

function uniqueOptions(beers, key) {
  return [...new Set(beers.flatMap((beer) => beer[key]))].sort((a, b) =>
    a.localeCompare(b, "zh-Hans-CN"),
  );
}

function uniqueFieldOptions(beers, key) {
  return [...new Set(beers.map((beer) => beer[key]))].sort((a, b) =>
    a.localeCompare(b, "zh-Hans-CN"),
  );
}

function formatAbv(abv) {
  return `${abv.toFixed(1)}% vol`;
}

function createSelectOptions(values) {
  return ['<option value="全部">全部</option>']
    .concat(values.map((value) => `<option value="${value}">${value}</option>`))
    .join("");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function renderBeerCard(beer, isActive) {
  const priceBand = derivePriceBand(beer.priceCny);
  const tags = beer.highlightTags.slice(0, 3);
  const imageBadge = beer.imageKind === "real" ? "真实图" : "生成图";

  return `
    <article class="beer-card ${isActive ? "is-active" : ""}" data-beer-id="${escapeHtml(beer.id)}" tabindex="0" role="button" aria-pressed="${isActive}">
      <div class="card-image-wrap">
        <img class="card-image" src="${escapeHtml(beer.image)}" alt="${escapeHtml(`${beer.brand} ${beer.name}`)}" loading="lazy" decoding="async" />
        <span class="image-badge">${escapeHtml(imageBadge)}</span>
      </div>
      <div class="card-top">
        <p class="eyebrow">${escapeHtml(beer.country)} · ${escapeHtml(beer.style)}</p>
        <span class="price-band">${escapeHtml(priceBand)}</span>
      </div>
      <h3>${escapeHtml(beer.brand)}</h3>
      <p class="beer-name">${escapeHtml(beer.name)}</p>
      <p class="beer-tagline">${escapeHtml(beer.tagline)}</p>
      <dl class="beer-meta">
        <div><dt>参考价</dt><dd>¥${escapeHtml(beer.priceCny)}</dd></div>
        <div><dt>酒精度</dt><dd>${escapeHtml(formatAbv(beer.abv))}</dd></div>
        <div><dt>规格</dt><dd>${escapeHtml(beer.spec)}</dd></div>
      </dl>
      <div class="tag-row">
        ${tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}
      </div>
    </article>
  `;
}

function renderBeerDetail(beer) {
  const imageMeta = beer.imageKind === "real"
    ? `<p class="detail-image-meta">图片状态：真实产品图${beer.imageSourcePage ? ` · <a href="${escapeHtml(beer.imageSourcePage)}" target="_blank" rel="noreferrer">来源页</a>` : ""}</p>`
    : `<p class="detail-image-meta">图片状态：项目生成海报图，用于补齐未获得真实授权图的产品。</p>`;
  const gallery = beer.gallery?.length
    ? `
      <div class="detail-gallery">
        ${beer.gallery
          .map(
            (image, index) =>
              `<img src="${escapeHtml(image)}" alt="${escapeHtml(`${beer.brand} ${beer.name} 场景图 ${index + 1}`)}" loading="lazy" decoding="async" />`,
          )
          .join("")}
      </div>
    `
    : "";

  return `
    <article class="detail-card">
      <div class="detail-media">
        <img class="detail-image" src="${escapeHtml(beer.image)}" alt="${escapeHtml(`${beer.brand} ${beer.name}`)}" decoding="async" />
        ${imageMeta}
        ${gallery}
      </div>
      <div class="detail-copy">
        <p class="eyebrow">Editor Detail</p>
        <h3>${escapeHtml(beer.brand)} <span>${escapeHtml(beer.name)}</span></h3>
        <p class="detail-lede">${escapeHtml(beer.description)}</p>
        <div class="detail-tags">
          ${beer.highlightTags.map((tag) => `<span class="chip">${escapeHtml(tag)}</span>`).join("")}
        </div>
        <dl class="detail-facts">
          <div><dt>产地 / 风格</dt><dd>${escapeHtml(`${beer.country} / ${beer.style}`)}</dd></div>
          <div><dt>参考价格</dt><dd>¥${escapeHtml(beer.priceCny)} / ${escapeHtml(beer.spec)}</dd></div>
          <div><dt>推荐搭配</dt><dd>${escapeHtml(beer.pairing)}</dd></div>
          <div><dt>适饮温度</dt><dd>${escapeHtml(beer.serveTemp)}</dd></div>
          <div><dt>配料摘要</dt><dd>${escapeHtml(beer.ingredientsSummary)}</dd></div>
          <div><dt>适合场景</dt><dd>${escapeHtml(beer.sceneTags.join(" / "))}</dd></div>
        </dl>
        <div class="detail-story">
          <h4>为什么这支值得进名单</h4>
          <p>${escapeHtml(beer.story)}</p>
        </div>
      </div>
    </article>
  `;
}

function renderHighlights(beers) {
  const crowdMap = new Map();

  for (const beer of beers) {
    for (const tag of beer.crowdTags) {
      if (!crowdMap.has(tag)) crowdMap.set(tag, beer);
    }
  }

  const picks = [
    crowdMap.get("入门友好"),
    crowdMap.get("IPA爱好者"),
    crowdMap.get("女生聚会"),
    crowdMap.get("聚会囤货")
  ].filter(Boolean);

  return picks
    .map(
      (beer) => `
        <button class="quick-pick" type="button" data-crowd="${escapeHtml(beer.crowdTags[0])}">
          <strong>${escapeHtml(beer.crowdTags[0])}</strong>
          <span>${escapeHtml(`${beer.brand} ${beer.name}`)}</span>
        </button>
      `,
    )
    .join("");
}

function renderEditorials(beers) {
  const ids = ["corona-extra", "hoegaarden-white", "goose-island-ipa"];
  const picks = ids.map((id) => beers.find((beer) => beer.id === id)).filter(Boolean);

  return picks
    .map(
      (beer) => `
        <article class="feature-tile">
          <img src="${escapeHtml(beer.image)}" alt="${escapeHtml(`${beer.brand} ${beer.name}`)}" loading="lazy" decoding="async" />
          <div>
            <p class="eyebrow">${escapeHtml(beer.country)} · ${escapeHtml(beer.style)}</p>
            <h3>${escapeHtml(`${beer.brand} ${beer.name}`)}</h3>
            <p>${escapeHtml(beer.tagline)}</p>
          </div>
        </article>
      `,
    )
    .join("");
}

function populateFilters(beers, form) {
  form.elements.crowd.innerHTML = createSelectOptions(uniqueOptions(beers, "crowdTags"));
  form.elements.taste.innerHTML = createSelectOptions(uniqueOptions(beers, "tasteTags"));
  form.elements.country.innerHTML = createSelectOptions(uniqueFieldOptions(beers, "country"));
  form.elements.style.innerHTML = createSelectOptions(uniqueFieldOptions(beers, "style"));
  form.elements.priceBand.innerHTML = createSelectOptions(["平价", "日常", "进阶", "尝鲜"]);
}

function readFilters(form) {
  return {
    crowd: form.elements.crowd.value,
    taste: form.elements.taste.value,
    country: form.elements.country.value,
    style: form.elements.style.value,
    priceBand: form.elements.priceBand.value,
    search: form.elements.search.value
  };
}

function updateView(beers, filters, state, nodes) {
  const results = filterBeers(beers, filters);
  const activeBeer = pickActiveBeer(results, state.activeId);
  state.activeId = activeBeer?.id ?? null;

  nodes.count.textContent = `${results.length}`;
  nodes.summary.textContent = summarizeSelection(filters);
  nodes.grid.innerHTML = results.length
    ? results.map((beer) => renderBeerCard(beer, beer.id === state.activeId)).join("")
    : `
      <article class="empty-state">
        <h3>这组条件下还没有匹配结果</h3>
        <p>试试先放宽一个条件，或者搜索“白啤”“IPA”“日本”等关键词。</p>
      </article>
    `;
  nodes.detail.innerHTML = activeBeer
    ? renderBeerDetail(activeBeer)
    : `
      <article class="empty-state">
        <h3>暂无可展示详情</h3>
        <p>调整一下筛选条件，重新选择一支更适合当前场景的啤酒。</p>
      </article>
    `;
}

export function initBeerGuide(beers) {
  if (typeof document === "undefined") return;

  const form = document.querySelector("[data-filter-form]");
  const grid = document.querySelector("[data-results]");
  const detail = document.querySelector("[data-detail]");
  const count = document.querySelector("[data-count]");
  const summary = document.querySelector("[data-summary]");
  const quickPicks = document.querySelector("[data-quick-picks]");
  const editorials = document.querySelector("[data-editorials]");
  const reset = document.querySelector("[data-reset]");
  const total = document.querySelector("[data-total-count]");

  if (!form || !grid || !detail || !count || !summary || !quickPicks || !editorials || !reset) {
    return;
  }

  populateFilters(beers, form);
  quickPicks.innerHTML = renderHighlights(beers);
  editorials.innerHTML = renderEditorials(beers);
  if (total) total.textContent = `${beers.length}`;

  const state = { activeId: beers[0]?.id ?? null };
  const applyFilters = () => updateView(beers, readFilters(form), state, { grid, detail, count, summary });

  form.addEventListener("input", applyFilters);
  reset.addEventListener("click", () => {
    form.reset();
    state.activeId = beers[0]?.id ?? null;
    applyFilters();
  });
  quickPicks.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-crowd]");
    if (!trigger) return;
    form.elements.crowd.value = trigger.dataset.crowd;
    applyFilters();
    document.querySelector("#catalogue")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  grid.addEventListener("click", (event) => {
    const card = event.target.closest("[data-beer-id]");
    if (!card) return;
    state.activeId = card.dataset.beerId;
    applyFilters();
    detail.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
  grid.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const card = event.target.closest("[data-beer-id]");
    if (!card) return;
    event.preventDefault();
    state.activeId = card.dataset.beerId;
    applyFilters();
  });

  applyFilters();
}
