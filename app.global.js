(function () {
  "use strict";

const DEFAULT_FILTERS = {
  crowd: "全部",
  taste: "全部",
  country: "全部",
  style: "全部",
  priceBand: "全部",
  search: ""
};

const DEFAULT_SUMMARY = "从人群、口感、产地和价格带切入，快速找到适合夏天的那一杯。";

const SCENE_PRESET_CONFIG = [
  {
    id: "easy-drinking",
    title: "清爽解暑",
    description: "先从干净、好入口的路线开始，适合今晚只想轻松开喝。",
    beerId: "asahi-super-dry",
    filters: {
      crowd: "入门友好",
      taste: "清爽",
    },
  },
  {
    id: "party-crate",
    title: "朋友聚会",
    description: "锁定好买、好拼单、开场不会出错的聚会型选择。",
    beerId: "tsingtao-classic",
    filters: {
      crowd: "聚会囤货",
      priceBand: "平价",
    },
  },
  {
    id: "fruity-social",
    title: "果香轻松喝",
    description: "给下午茶、露台和轻社交准备一组更友好的果香入口。",
    beerId: "hoegaarden-white",
    filters: {
      crowd: "女生聚会",
      taste: "果香",
    },
  },
  {
    id: "ipa-upgrade",
    title: "IPA 进阶",
    description: "已经不满足于基础清爽，就直接切进更明确的啤酒花表达。",
    beerId: "goose-island-ipa",
    filters: {
      crowd: "IPA爱好者",
      style: "IPA",
    },
  },
];

function derivePriceBand(priceCny) {
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

function filterBeers(beers, filters = DEFAULT_FILTERS) {
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

function summarizeSelection(filters = DEFAULT_FILTERS, defaultSummary = DEFAULT_SUMMARY) {
  const segments = [
    filters.crowd,
    filters.taste,
    filters.country,
    filters.style,
    filters.priceBand
  ].filter((value) => value && value !== "全部");

  if (filters.search?.trim()) {
    segments.push(`关键词"${filters.search.trim()}"`);
  }

  return segments.length ? `当前关注：${segments.join(" / ")}` : defaultSummary;
}

function getScenePresets(beers) {
  const beerById = new Map(beers.map((beer) => [beer.id, beer]));

  return SCENE_PRESET_CONFIG.map((preset) => {
    const beer = beerById.get(preset.beerId);

    if (!beer) {
      throw new Error(`Scene preset "${preset.id}" references missing beer "${preset.beerId}".`);
    }

    return {
      ...preset,
      beer,
    };
  });
}

function summarizeCatalogueStatus(filters = DEFAULT_FILTERS, count, totalCount = null) {
  const activeSegments = [];

  if (filters.crowd !== "全部") activeSegments.push(filters.crowd);
  if (filters.taste !== "全部") activeSegments.push(filters.taste);
  if (filters.country !== "全部") activeSegments.push(filters.country);
  if (filters.style !== "全部") activeSegments.push(filters.style);
  if (filters.priceBand !== "全部") activeSegments.push(filters.priceBand);
  if (filters.search?.trim()) activeSegments.push(`搜索“${filters.search.trim()}”`);

  if (!count) {
    return activeSegments.length
      ? `按 ${activeSegments.join(" / ")} 这条线索暂时还没命中，放宽一个条件再看看。`
      : "精选库暂时没有可展示结果，稍后再回来看看。";
  }

  if (!activeSegments.length) {
    if (typeof totalCount === "number" && totalCount > count) {
      return `从 ${totalCount} 支夏日啤酒里，先替你摊开这 ${count} 支值得先看的选择。`;
    }

    return `已展开 ${count} 支夏日啤酒，先从一个场景入口开始也很顺手。`;
  }

  return `根据 ${activeSegments.join(" / ")}，当前替你收拢出 ${count} 支值得先看的选择。`;
}

function isDefaultFilterValue(value) {
  return !value || value === "全部";
}

function getActiveScenePresetId(presets, filters) {
  return (
    presets.find((preset) => {
      const presetKeys = Object.keys(preset.filters);
      const presetMatches = presetKeys.every((key) => filters[key] === preset.filters[key]);

      if (!presetMatches) return false;

      return ["crowd", "taste", "country", "style", "priceBand"].every((key) => {
        if (presetKeys.includes(key)) return true;
        return isDefaultFilterValue(filters[key]);
      }) && !filters.search.trim();
    })?.id ?? ""
  );
}

function renderScenePicks(presets, activePresetId = "") {
  return presets
    .map((preset) => {
      const isActive = preset.id === activePresetId;

      return `
        <button
          class="quick-pick ${isActive ? "is-active" : ""}"
          type="button"
          data-scene-preset="${escapeHtml(preset.id)}"
          aria-pressed="${isActive}"
          aria-current="${isActive ? "true" : "false"}"
        >
          <img src="${escapeHtml(preset.beer.image)}" alt="${escapeHtml(`${preset.beer.brand} ${preset.beer.name}`)}" loading="lazy" decoding="async" />
          <strong>${escapeHtml(preset.title)}</strong>
          <span>${escapeHtml(preset.description)}</span>
        </button>
      `;
    })
    .join("");
}

function pickActiveBeer(results, currentId) {
  if (!results.length) return null;
  return results.find((beer) => beer.id === currentId) ?? results[0];
}

function uniqueOptions(beers, key) {
  return [...new Set(beers.flatMap((beer) => beer[key]))].sort((left, right) =>
    left.localeCompare(right, "zh-Hans-CN"),
  );
}

function uniqueFieldOptions(beers, key) {
  return [...new Set(beers.map((beer) => beer[key]))].sort((left, right) =>
    left.localeCompare(right, "zh-Hans-CN"),
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

function renderBeerCard(beer, isActive, index, animate) {
  const priceBand = derivePriceBand(beer.priceCny);
  const tags = beer.highlightTags.slice(0, 3);
  const imageBadge = beer.imageKind === "real" ? "真实图" : "生成图";
  const animAttr = animate ? ` data-animate style="animation-delay: ${(index || 0) * 50}ms"` : "";

  return `
    <article class="beer-card ${isActive ? "is-active" : ""}" data-beer-id="${escapeHtml(beer.id)}" tabindex="0" role="button" aria-pressed="${isActive}"${animAttr}>
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
    ? `真实产品图${beer.imageSourcePage ? ` · <a href="${escapeHtml(beer.imageSourcePage)}" target="_blank" rel="noreferrer">来源页</a>` : ""}`
    : "项目生成海报图，用于补齐未获得真实授权图的产品。";
  const quickFacts = [
    { label: "风格", value: `${beer.country} / ${beer.style}` },
    { label: "参考价格", value: `¥${beer.priceCny} / ${beer.spec}` },
    { label: "酒精度", value: formatAbv(beer.abv) },
    { label: "适饮温度", value: beer.serveTemp }
  ];
  const serveFacts = [
    { label: "推荐搭配", value: beer.pairing },
    { label: "适合场景", value: beer.sceneTags.join(" / ") }
  ];
  const supportFacts = [
    { label: "规格", value: beer.spec },
    { label: "配料摘要", value: beer.ingredientsSummary },
    { label: "图片说明", value: imageMeta, isHtml: true }
  ];
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
        <div class="detail-media-frame">
          <img class="detail-image" src="${escapeHtml(beer.image)}" alt="${escapeHtml(`${beer.brand} ${beer.name}`)}" decoding="async" />
        </div>
        ${gallery ? `<section class="detail-gallery-section" aria-label="场景补图"><p class="detail-kicker">Scene Notes</p>${gallery}</section>` : ""}
      </div>
      <div class="detail-copy">
        <header class="detail-head">
          <p class="eyebrow">Editor Detail</p>
          <p class="detail-kicker">${escapeHtml(beer.style)} · ${escapeHtml(beer.country)}</p>
          <h3 id="detail-title"><span class="detail-brand">${escapeHtml(beer.brand)}</span><span class="detail-name">${escapeHtml(beer.name)}</span></h3>
          <p class="detail-lede">${escapeHtml(beer.tagline)}</p>
          <div class="detail-tags">
            ${beer.highlightTags.slice(0, 3).map((tag) => `<span class="detail-chip">${escapeHtml(tag)}</span>`).join("")}
          </div>
        </header>
        <section class="detail-block detail-block-story" aria-label="推荐理由">
          <p class="detail-block-label">Why It Works</p>
          <h4>为什么这支值得喝</h4>
          <p class="detail-story-copy">${escapeHtml(beer.description)}</p>
          <p class="detail-story-note">${escapeHtml(beer.story)}</p>
        </section>
        <section class="detail-block detail-block-primary" aria-label="快速判断">
          <p class="detail-block-label">Quick Read</p>
          <h4>快速判断</h4>
          <dl class="detail-facts detail-facts-primary">
            ${quickFacts
              .map(
                (fact) => `<div><dt>${escapeHtml(fact.label)}</dt><dd>${escapeHtml(fact.value)}</dd></div>`,
              )
              .join("")}
          </dl>
        </section>
        <section class="detail-block detail-block-serve" aria-label="怎么喝更对">
          <p class="detail-block-label">How To Drink</p>
          <h4>怎么喝更对</h4>
          <dl class="detail-facts detail-facts-secondary">
            ${serveFacts
              .map(
                (fact) => `<div><dt>${escapeHtml(fact.label)}</dt><dd>${escapeHtml(fact.value)}</dd></div>`,
              )
              .join("")}
          </dl>
        </section>
        <section class="detail-block detail-block-support" aria-label="补充信息">
          <p class="detail-block-label">Details</p>
          <h4>补充信息</h4>
          <dl class="detail-facts detail-facts-secondary">
            ${supportFacts
              .map((fact) => {
                const value = fact.isHtml ? fact.value : escapeHtml(fact.value);
                return `<div><dt>${escapeHtml(fact.label)}</dt><dd>${value}</dd></div>`;
              })
              .join("")}
          </dl>
        </section>
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

function renderSectionCard(item) {
  const body = item.body ? `<p>${escapeHtml(item.body)}</p>` : "";
  const links = item.links?.length
    ? item.links
      .map(
        (link) =>
          `<p><a href="${escapeHtml(link.href)}" target="_blank" rel="noreferrer">${escapeHtml(link.label)}</a></p>`,
      )
      .join("")
    : "";

  return `
    <article class="note-card">
      <h3>${escapeHtml(item.title)}</h3>
      ${body}
      ${links}
    </article>
  `;
}

function renderInfoSection(section) {
  const intro = section.intro ? `<p class="section-copy">${escapeHtml(section.intro)}</p>` : "";
  const items = section.items?.length
    ? `<div class="notes">${section.items.map(renderSectionCard).join("")}</div>`
    : "";

  return `
    <p class="eyebrow">${escapeHtml(section.eyebrow)}</p>
    <h2>${escapeHtml(section.title)}</h2>
    ${intro}
    ${items}
  `;
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

function renderInfoSections(sections) {
  sections.forEach((section) => {
    const node = document.querySelector(`[data-section="${section.id}"]`);
    if (node) node.innerHTML = renderInfoSection(section);
  });
}

function updateView(beers, filters, state, nodes, meta = {}, options = {}) {
  const results = filterBeers(beers, filters);
  const activeBeer = pickActiveBeer(results, state.activeId);
  state.activeId = activeBeer?.id ?? null;

  nodes.count.textContent = `${results.length}`;
  if (nodes.mobileCount) nodes.mobileCount.textContent = `${results.length}`;
  nodes.filterSummary.textContent = summarizeSelection(filters, meta.defaultSummary ?? DEFAULT_SUMMARY);
  nodes.catalogueStatus.textContent = summarizeCatalogueStatus(filters, results.length, beers.length);

  if (nodes.scenePicks) {
    const activePresetId = getActiveScenePresetId(state.scenePresets, filters);
    nodes.scenePicks.innerHTML = renderScenePicks(state.scenePresets, activePresetId);
  }

  const renderGrid = () => {
    const animate = !state.rendered && !options.disableGridAnimation;
    state.rendered = true;
    nodes.grid.innerHTML = results.length
      ? results.map((beer, index) => renderBeerCard(beer, beer.id === state.activeId, index, animate)).join("")
      : `
        <article class="empty-state">
          <h3>这组条件下还没有匹配结果</h3>
          <p>试试先放宽一个条件，或者搜索"白啤""IPA""日本"等关键词。</p>
        </article>
      `;
  };

  const renderDetail = () => {
    nodes.detail.innerHTML = activeBeer
      ? renderBeerDetail(activeBeer)
      : `
        <article class="empty-state">
          <h3>暂无可展示详情</h3>
          <p>调整一下筛选条件，重新选择一支更适合当前场景的啤酒。</p>
        </article>
      `;
  };

  if (options.instant || options.disableGridAnimation || state.isDetailOpen) {
    renderGrid();
  } else {
    nodes.grid.classList.add("is-updating");
    requestAnimationFrame(() => {
      setTimeout(() => {
        renderGrid();
        nodes.grid.classList.remove("is-updating");
      }, 100);
    });
  }

  if (options.instantDetail) {
    renderDetail();
  } else {
    nodes.detail.classList.add("is-updating");
    requestAnimationFrame(() => {
      setTimeout(() => {
        renderDetail();
        nodes.detail.classList.remove("is-updating");
      }, 100);
    });
  }
}

function normalizeConfig(config) {
  if (Array.isArray(config)) {
    return { beers: config, sections: [], meta: {} };
  }

  return {
    beers: Array.isArray(config?.beers) ? config.beers : [],
    sections: Array.isArray(config?.sections) ? config.sections : [],
    meta: config?.meta && typeof config.meta === "object" ? config.meta : {}
  };
}

function showStatus(statusNode, message) {
  if (!statusNode) return;
  statusNode.hidden = false;
  statusNode.textContent = message;
}

function hideStatus(statusNode) {
  if (!statusNode) return;
  statusNode.hidden = true;
  statusNode.textContent = "";
}

function isDialogOpen(dialog) {
  return Boolean(dialog?.open || dialog?.hasAttribute("open"));
}

function focusWithoutScroll(node) {
  if (!node || typeof node.focus !== "function") return;

  try {
    node.focus({ preventScroll: true });
  } catch {
    node.focus();
  }
}

function restoreWindowScroll(scrollY) {
  if (typeof window === "undefined" || typeof scrollY !== "number") return;
  window.scrollTo({ top: scrollY, behavior: "auto" });
}

function syncCardInteractionState(grid, nextCard, className) {
  const currentCard = grid.querySelector(`.beer-card.${className}`);
  if (currentCard && currentCard !== nextCard) currentCard.classList.remove(className);
  if (nextCard) {
    nextCard.classList.add(className);
  } else if (currentCard) {
    currentCard.classList.remove(className);
  }
}

function initBeerGuide(config) {
  if (typeof document === "undefined") return false;

  const { beers, sections, meta } = normalizeConfig(config);
  const form = document.querySelector("[data-filter-form]");
  const grid = document.querySelector("[data-results]");
  const detail = document.querySelector("[data-detail]");
  const count = document.querySelector("[data-count]");
  const filterSummary = document.querySelector("[data-filter-summary]");
  const catalogueStatus = document.querySelector("[data-catalogue-status]");
  const scenePicks = document.querySelector("[data-scene-picks]");
  const editorials = document.querySelector("[data-editorials]");
  const reset = document.querySelector("[data-reset]");
  const total = document.querySelector("[data-total-count]");
  const countryCount = document.querySelector("[data-country-count]");
  const dimensionCount = document.querySelector("[data-dimension-count]");
  const filterToggle = document.querySelector("[data-filter-toggle]");
  const mobileCount = document.querySelector("[data-mobile-count]");
  const detailDialog = document.querySelector("[data-detail-dialog]");
  const detailClose = document.querySelector("[data-detail-close]");
  const statusNode = document.querySelector("[data-app-status]");
  const scrollTriggers = document.querySelectorAll("[data-scroll-target]");

  if (
    !form ||
    !grid ||
    !detail ||
    !count ||
    !filterSummary ||
    !catalogueStatus ||
    !scenePicks ||
    !editorials ||
    !reset ||
    !detailDialog
  ) {
    return false;
  }

  if (!beers.length) {
    showStatus(statusNode, meta.bootErrorMessage ?? "页面数据暂时不可用，请稍后再试。");
    return false;
  }

  hideStatus(statusNode);
  renderInfoSections(sections);
  populateFilters(beers, form);
  editorials.innerHTML = renderEditorials(beers);

  if (total) total.textContent = `${beers.length}`;
  if (countryCount) {
    const resolvedCountryCount = meta.countryCount ?? new Set(beers.map((beer) => beer.country)).size;
    countryCount.textContent = `${resolvedCountryCount}`;
  }
  if (dimensionCount) {
    dimensionCount.textContent = `${meta.decisionDimensions ?? 5}`;
  }

  const state = {
    activeId: beers[0]?.id ?? null,
    rendered: false,
    isDetailOpen: false,
    scenePresets: getScenePresets(beers),
    lastTrigger: null,
    detailTransitionState: "closed",
    detailCloseTimer: null,
    pageScrollY: 0
  };

  const applyFilters = (options = {}) =>
    updateView(
      beers,
      readFilters(form),
      state,
      { grid, detail, count, filterSummary, catalogueStatus, scenePicks, mobileCount },
      meta,
      options,
    );

  const applyScenePreset = (presetId) => {
    const preset = state.scenePresets.find((item) => item.id === presetId);

    if (!preset) return;

    form.reset();
    form.elements.crowd.value = preset.filters.crowd ?? "全部";
    form.elements.taste.value = preset.filters.taste ?? "全部";
    form.elements.country.value = preset.filters.country ?? "全部";
    form.elements.style.value = preset.filters.style ?? "全部";
    form.elements.priceBand.value = preset.filters.priceBand ?? "全部";
    form.elements.search.value = "";
    state.activeId = preset.beerId;
    applyFilters();
    document.querySelector("#catalogue")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const setDetailTransitionState = (value) => {
    state.detailTransitionState = value;
    detailDialog.dataset.state = value;
    document.body.dataset.detailState = value;
    document.body.classList.toggle("has-detail-open", value === "opening" || value === "open");
    document.body.classList.toggle("has-detail-transition", value === "opening" || value === "closing");
    grid.classList.toggle("is-detail-active", value === "opening" || value === "open");
  };

  const closeDetail = ({ returnFocus = true } = {}) => {
    if (!isDialogOpen(detailDialog)) return;

    state.isDetailOpen = false;
    setDetailTransitionState("closing");

    window.clearTimeout(state.detailCloseTimer);
    detailDialog.classList.remove("is-open");

    state.detailCloseTimer = window.setTimeout(() => {
      if (typeof detailDialog.close === "function" && detailDialog.open) {
        detailDialog.close();
      } else {
        detailDialog.removeAttribute("open");
      }

      setDetailTransitionState("closed");

      if (returnFocus && state.lastTrigger?.isConnected) {
        focusWithoutScroll(state.lastTrigger);
        state.lastTrigger.scrollIntoView({ block: "nearest", inline: "nearest" });
      }
    }, 180);
  };

  const openDetail = (beerId, trigger) => {
    state.pageScrollY = window.scrollY;

    if (beerId) state.activeId = beerId;

    if (trigger instanceof HTMLElement) {
      state.lastTrigger = trigger;
    }

    applyFilters({ instantDetail: true, disableGridAnimation: true });

    if (!state.activeId) return;

    window.clearTimeout(state.detailCloseTimer);

    if (typeof detailDialog.showModal === "function" && !detailDialog.open) {
      detailDialog.showModal();
    } else {
      detailDialog.setAttribute("open", "");
    }

    restoreWindowScroll(state.pageScrollY);

    state.isDetailOpen = true;
    setDetailTransitionState("opening");

    requestAnimationFrame(() => {
      restoreWindowScroll(state.pageScrollY);
      detailDialog.classList.add("is-open");
      requestAnimationFrame(() => {
        restoreWindowScroll(state.pageScrollY);
        setDetailTransitionState("open");
        focusWithoutScroll(detailClose);
      });
    });
  };

  form.addEventListener("input", applyFilters);
  reset.addEventListener("click", () => {
    form.reset();
    state.activeId = beers[0]?.id ?? null;
    applyFilters();
  });
  scenePicks.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-scene-preset]");
    if (!trigger) return;

    applyScenePreset(trigger.dataset.scenePreset);
  });
  grid.addEventListener("click", (event) => {
    const card = event.target.closest("[data-beer-id]");
    if (!card) return;
    openDetail(card.dataset.beerId, card);
  });
  grid.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;

    const card = event.target.closest("[data-beer-id]");
    if (!card) return;

    event.preventDefault();
    openDetail(card.dataset.beerId, card);
  });

  detailClose?.addEventListener("click", () => closeDetail());
  detailDialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeDetail();
  });
  detailDialog.addEventListener("click", (event) => {
    if (event.target === detailDialog) closeDetail();
  });

  if (filterToggle) {
    if (window.innerWidth <= 720) {
      form.classList.add("is-collapsed");
      filterToggle.setAttribute("aria-expanded", "false");
    } else {
      filterToggle.setAttribute("aria-expanded", "true");
    }

    filterToggle.addEventListener("click", () => {
      const isCollapsed = form.classList.toggle("is-collapsed");
      filterToggle.setAttribute("aria-expanded", String(!isCollapsed));

      if (!isCollapsed) {
        form.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  scrollTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const targetId = trigger.dataset.scrollTarget;
      if (!targetId) return;
      document.querySelector(`#${targetId}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  grid.addEventListener("pointerover", (event) => {
    const card = event.target.closest("[data-beer-id]");
    syncCardInteractionState(grid, card, "is-hovered");
  });
  grid.addEventListener("pointerout", (event) => {
    if (event.relatedTarget && grid.contains(event.relatedTarget)) return;
    syncCardInteractionState(grid, null, "is-hovered");
  });
  grid.addEventListener("focusin", (event) => {
    const card = event.target.closest("[data-beer-id]");
    syncCardInteractionState(grid, card, "is-hovered");
  });
  grid.addEventListener("focusout", (event) => {
    if (event.relatedTarget && grid.contains(event.relatedTarget)) return;
    syncCardInteractionState(grid, null, "is-hovered");
  });
  grid.addEventListener("pointerdown", (event) => {
    const card = event.target.closest("[data-beer-id]");
    syncCardInteractionState(grid, card, "is-pressed");
  });
  grid.addEventListener("pointerup", () => {
    syncCardInteractionState(grid, null, "is-pressed");
  });
  grid.addEventListener("pointercancel", () => {
    syncCardInteractionState(grid, null, "is-pressed");
  });

  const revealSections = document.querySelectorAll("[data-reveal]");
  if (revealSections.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealSections.forEach((element) => observer.observe(element));
  }

  let touchStartX = 0;
  grid.addEventListener(
    "touchstart",
    (event) => {
      touchStartX = event.changedTouches[0].screenX;
    },
    { passive: true },
  );
  grid.addEventListener(
    "touchend",
    (event) => {
      const diff = event.changedTouches[0].screenX - touchStartX;
      if (Math.abs(diff) < 60) return;

      const cards = [...grid.querySelectorAll("[data-beer-id]")];
      const currentIndex = cards.findIndex((card) => card.dataset.beerId === state.activeId);
      const nextIndex = diff < 0
        ? Math.min(currentIndex + 1, cards.length - 1)
        : Math.max(currentIndex - 1, 0);

      if (cards[nextIndex]) {
        state.activeId = cards[nextIndex].dataset.beerId;
        applyFilters();
        cards[nextIndex].scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      }
    },
    { passive: true },
  );

  applyFilters();
  setDetailTransitionState("closed");
  return true;
}

function bootBeerGuide(payload = window.BeerGuideData) {
  if (typeof document === "undefined") return false;

  const statusNode = document.querySelector("[data-app-status]");
  const config = normalizeConfig({
    beers: payload?.beers,
    sections: payload?.pageSections ?? payload?.sections,
    meta: payload?.pageMeta ?? payload?.meta
  });

  if (!config.beers.length) {
    showStatus(
      statusNode,
      config.meta.bootErrorMessage ?? "页面数据暂时不可用，请稍后刷新，或检查本地数据文件是否完整。",
    );
    return false;
  }

  try {
    return initBeerGuide(config);
  } catch (error) {
    console.error(error);
    showStatus(
      statusNode,
      config.meta.bootErrorMessage ?? "页面初始化失败，请稍后刷新后重试。",
    );
    return false;
  }
}

if (typeof window !== "undefined" && typeof document !== "undefined") {
  const start = () => bootBeerGuide(window.BeerGuideData);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
}


  window.BeerGuideApp = { initBeerGuide, bootBeerGuide };
})();
