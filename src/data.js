const STYLE_PROFILES = {
  拉格: {
    serveTemp: "4-6°C",
    pairing: "烧烤、海鲜、炸物",
    story:
      "拉格的优势是干净、利落、好搭餐，冰到位以后非常适合夏天大口喝。"
  },
  皮尔森: {
    serveTemp: "4-6°C",
    pairing: "炸鸡、薯条、烤肠",
    story:
      "皮尔森通常比基础拉格更有啤酒花存在感，清脆微苦，适合从淡啤向风格啤酒过渡。"
  },
  小麦啤: {
    serveTemp: "5-7°C",
    pairing: "沙拉、海鲜、德式香肠",
    story:
      "小麦啤往往拥有更蓬松的泡沫和更柔和的酒体，常见果香、香料感和顺滑口感。"
  },
  IPA: {
    serveTemp: "7-9°C",
    pairing: "炸鸡、汉堡、重口烧烤",
    story:
      "IPA 的重点是啤酒花带来的苦度和果香，适合已经不满足于单纯清爽口感的进阶饮者。"
  },
  世涛: {
    serveTemp: "8-10°C",
    pairing: "汉堡、烤肉、巧克力甜品",
    story:
      "世涛偏向烘焙、咖啡和黑巧方向，夏天更适合夜晚慢饮，而不是纯解暑路线。"
  },
  修道院啤酒: {
    serveTemp: "8-10°C",
    pairing: "炖肉、奶酪、甜品",
    story:
      "修道院风格通常层次复杂、酒感明显，适合细品和配餐，不属于快饮型夏日水啤。"
  },
  "美式淡色艾尔": {
    serveTemp: "6-8°C",
    pairing: "汉堡、披萨、炸鸡",
    story:
      "美式淡色艾尔平衡了麦香与柑橘型啤酒花，适合想尝试精酿但不想直接冲进重苦度的人。"
  },
  "英式艾尔": {
    serveTemp: "8-10°C",
    pairing: "烤肉、派、炸鱼薯条",
    story:
      "英式艾尔更讲究麦芽底味和柔和苦度，适合想喝得稳一点、慢一点的人。"
  },
  "金色艾尔": {
    serveTemp: "6-8°C",
    pairing: "海鲜、奶酪、烤鸡",
    story:
      "金色艾尔兼具香气和干爽感，入口比传统拉格更立体，但比重型修道院更容易接近。"
  },
  酸啤: {
    serveTemp: "5-7°C",
    pairing: "海鲜、沙拉、轻食",
    story:
      "酸啤在夏天很有存在感，酸爽和果香会带来近似气泡饮料的清醒感，但风味辨识度更高。"
  }
};

const FEATURED_GALLERY_IDS = new Set([
  "tsingtao-classic",
  "corona-extra",
  "hoegaarden-white",
  "paulaner-hefe",
  "guinness-draught",
  "goose-island-ipa",
  "young-master-cha-chaan",
  "master-gao-baby-jasmine"
]);

const REAL_IMAGE_OVERRIDES = {
  "corona-extra": "./assets/commons/web/corona-extra-real.png",
  "hoegaarden-white": "./assets/commons/web/hoegaarden-white-real.jpg",
  "asahi-super-dry": "./assets/commons/web/asahi-super-dry-real.jpg",
  "paulaner-hefe": "./assets/commons/web/paulaner-hefe-real.jpg",
  "guinness-draught": "./assets/commons/web/guinness-draught-real.jpg",
  "heineken-original": "./assets/commons/web/heineken-original.jpg",
  "budweiser-classic": "./assets/commons/web/budweiser-original.jpg",
  "stella-artois": "./assets/commons/web/stella-artois-original.jpg",
  "carlsberg-pilsner": "./assets/commons/web/carlsberg-original.jpg",
  "kirin-ichiban": "./assets/commons/web/kirin-ichiban-original.jpg",
  "sapporo-premium": "./assets/commons/web/sapporo-premium-original.jpg",
  "pilsner-urquell": "./assets/commons/web/pilsner-urquell-original.jpg",
  "erdinger-weissbier": "./assets/commons/web/erdinger-weissbier-original.jpg",
  "leffe-blonde": "./assets/commons/web/leffe-blonde-original.jpg",
  "bitburger-pils": "./assets/commons/web/bitburger-pils-original.jpg"
};

const REAL_IMAGE_SOURCE_PAGES = {
  "corona-extra": "https://commons.wikimedia.org/wiki/File:Corona_Extra_beer_bottle_(2019).png",
  "hoegaarden-white": "https://commons.wikimedia.org/wiki/File:Hoegaarden_bottle.JPG",
  "asahi-super-dry": "https://commons.wikimedia.org/wiki/File:Asahi_Super_Dry.jpg",
  "paulaner-hefe": "https://commons.wikimedia.org/wiki/File:Paulaner_Hefe-Weissbier.JPG",
  "guinness-draught": "https://commons.wikimedia.org/wiki/File:Guinness_Draught.jpg",
  "heineken-original": "https://commons.wikimedia.org/wiki/File:Heineken_Bottle.JPG",
  "budweiser-classic": "https://commons.wikimedia.org/wiki/File:Budweiser_Bottle.jpg",
  "stella-artois": "https://commons.wikimedia.org/wiki/File:Stella_Artois_bottle.jpg",
  "carlsberg-pilsner": "https://commons.wikimedia.org/wiki/File:Carlsberg_(bottle).jpg",
  "kirin-ichiban": "https://commons.wikimedia.org/wiki/File:Kirin_Beer.jpg",
  "sapporo-premium": "https://commons.wikimedia.org/wiki/File:A_Bottle_of_Sapporo_Beer.jpg",
  "pilsner-urquell": "https://commons.wikimedia.org/wiki/File:Pilsner_Urquell_330mL_Bottle.jpg",
  "erdinger-weissbier": "https://commons.wikimedia.org/wiki/File:Erdinger_weissbrau.jpg",
  "leffe-blonde": "https://commons.wikimedia.org/wiki/File:LeffeBlond.jpg",
  "bitburger-pils": "https://commons.wikimedia.org/wiki/File:Bitburger_Pils.jpg"
};

const CUSTOM_COPY = {
  "tsingtao-classic": {
    tagline: "冰镇后最不费脑、最适合烧烤摊的大众拉格。",
    description:
      "经典10度的优势不是复杂，而是稳定的清爽感和熟悉的麦香底。天气热、菜很重、朋友很多的时候，它是那种几乎不会出错的开场酒。",
    highlightTags: ["国民口粮", "烧烤搭子", "大口解暑"]
  },
  "corona-extra": {
    tagline: "海边、露营、清淡餐局里最有度假感的一瓶。",
    description:
      "科罗娜的魅力在于它足够轻快，带一点谷物和柑橘联想，不压食物，也不抢聊天节奏。适合想喝点酒但又不想太重的人。",
    highlightTags: ["海边友好", "度假氛围", "轻负担"]
  },
  "asahi-super-dry": {
    tagline: "如果你要的是“干净利落”，朝日通常就是答案。",
    description:
      "Super Dry 以干爽收口见长，入口快、落口快，特别适合搭配日料、炸物和炎热天气里的第一杯。它不是风味炸裂型，而是节奏干净型。",
    highlightTags: ["日料搭子", "超干路线", "清爽收口"]
  },
  "hoegaarden-white": {
    tagline: "白啤入门几乎绕不开的一支，轻松、果香、没有压力。",
    description:
      "橙皮与香料带来的清新感让它比普通拉格更有记忆点，但又不至于把门槛抬高。适合下午、早午餐、轻社交，尤其适合从普通淡啤转向风格啤酒的人。",
    highlightTags: ["白啤入门", "果香友好", "轻社交首选"]
  },
  "paulaner-hefe": {
    tagline: "想喝到典型德式小麦的香蕉丁香感，先从它开始。",
    description:
      "柏龙白啤的酒体圆润，泡沫厚，入口是很典型的德式小麦路线。它既有麦香支撑，又不会像高苦度酒那样挑人，是聚餐里很好用的升级选项。",
    highlightTags: ["德式经典", "香蕉丁香", "聚餐升级"]
  },
  "guinness-draught": {
    tagline: "不是拿来解渴的，而是给夜晚和重口食物加层次的。",
    description:
      "健力士最吸引人的并不是高度，而是氮气感带来的绵密口感和烘焙风味。配汉堡、烤肉或宵夜比单喝更能感受到它的优势。",
    highlightTags: ["黑啤入门", "绵密顺滑", "夜晚慢饮"]
  },
  "goose-island-ipa": {
    tagline: "想试 IPA 又不想一步到最猛，它是很稳的起点。",
    description:
      "鹅岛 IPA 把柑橘类香气和清晰苦度控制在比较容易接受的区间，喝起来明确、有辨识度，但还不到劝退新人的程度。",
    highlightTags: ["IPA起点", "柑橘啤酒花", "炸物搭子"]
  },
  "young-master-cha-chaan": {
    tagline: "当你想从“普通啤酒”跳到“有记忆点的夏日风格”，它很合适。",
    description:
      "这类 Gose 路线的魅力在于酸感、盐感和柑橘/香料联想交织在一起，喝起来像一杯带酒精度的海边气泡饮。喜欢猎奇又怕太苦的人通常会很买账。",
    highlightTags: ["夏日猎奇", "酸爽路线", "海边气质"]
  },
  "master-gao-baby-jasmine": {
    tagline: "茶香与啤酒的结合做得足够轻盈，特别适合下午和露台。",
    description:
      "茉莉花的香气让这支酒一上来就和传统啤酒区分开来。它不是靠重苦度取胜，而是靠轻盈、花香和很适合聊天的节奏感。",
    highlightTags: ["花香显著", "露台友好", "下午酒局"]
  }
};

function buildTagline(beer) {
  return `${beer.tasteTags[0]}导向，适合${beer.crowdTags[0]}在${beer.sceneTags[0]}场景开喝。`;
}

function buildDescription(beer) {
  return `${beer.brand}${beer.name}来自${beer.country}，属于${beer.style}路线，主轴是${beer.tasteTags
    .slice(0, 2)
    .join("、")}。它更适合${beer.crowdTags[0]}，尤其在${beer.sceneTags.join("、")}这类场景里表现自然，既能匹配夏天的节奏，也保留足够风味辨识度。`;
}

function buildHighlightTags(beer) {
  return [...new Set([beer.crowdTags[0], `${beer.sceneTags[0]}友好`, beer.tasteTags[0]])].slice(0, 3);
}

function enrichBeer(beer) {
  const styleProfile = STYLE_PROFILES[beer.style] ?? {
    serveTemp: "5-7°C",
    pairing: "烧烤、海鲜、轻食",
    story: "这是一支适合用来理解该风格基本特征的代表性啤酒。"
  };
  const custom = CUSTOM_COPY[beer.id] ?? {};

  const hasRealImage = Boolean(REAL_IMAGE_OVERRIDES[beer.id]);

  return {
    ...beer,
    image: REAL_IMAGE_OVERRIDES[beer.id] ?? `./assets/beers/${beer.id}.svg`,
    imageKind: hasRealImage ? "real" : "generated",
    imageSourcePage: REAL_IMAGE_SOURCE_PAGES[beer.id] ?? null,
    gallery: FEATURED_GALLERY_IDS.has(beer.id)
      ? [`./assets/beers/${beer.id}-scene.svg`]
      : [],
    tagline: custom.tagline ?? buildTagline(beer),
    description: custom.description ?? buildDescription(beer),
    pairing: custom.pairing ?? styleProfile.pairing,
    serveTemp: custom.serveTemp ?? styleProfile.serveTemp,
    highlightTags: custom.highlightTags ?? buildHighlightTags(beer),
    story: custom.story ?? styleProfile.story
  };
}

const rawBeers = [
  {
    id: "tsingtao-classic",
    brand: "青岛啤酒",
    name: "经典10度",
    country: "中国",
    style: "拉格",
    abv: 4.3,
    tasteTags: ["清爽", "麦香"],
    crowdTags: ["聚会囤货", "入门友好"],
    sceneTags: ["烧烤", "夜宵"],
    priceCny: 6,
    ingredientsSummary: "水、麦芽、大米、啤酒花",
    spec: "500ml 听装",
    priceSource: "中国零售参考价",
    updatedAt: "2026-04-22"
  },
  {
    id: "snow-brave",
    brand: "雪花",
    name: "勇闯天涯 SuperX",
    country: "中国",
    style: "拉格",
    abv: 4,
    tasteTags: ["清爽", "轻盈"],
    crowdTags: ["聚会囤货", "入门友好"],
    sceneTags: ["露营", "看球"],
    priceCny: 5,
    ingredientsSummary: "水、麦芽、大米、啤酒花",
    spec: "500ml 听装",
    priceSource: "中国零售参考价",
    updatedAt: "2026-04-22"
  },
  {
    id: "harbin-ice-pure",
    brand: "哈尔滨啤酒",
    name: "冰纯",
    country: "中国",
    style: "拉格",
    abv: 3.6,
    tasteTags: ["清爽", "轻盈"],
    crowdTags: ["入门友好", "聚会囤货"],
    sceneTags: ["火锅", "夜宵"],
    priceCny: 4,
    ingredientsSummary: "水、麦芽、大米、啤酒花",
    spec: "500ml 听装",
    priceSource: "中国零售参考价",
    updatedAt: "2026-04-22"
  },
  {
    id: "yanjing-u8",
    brand: "燕京",
    name: "U8",
    country: "中国",
    style: "拉格",
    abv: 4.5,
    tasteTags: ["清爽", "麦香"],
    crowdTags: ["入门友好", "聚会囤货"],
    sceneTags: ["聚餐", "烧烤"],
    priceCny: 7,
    ingredientsSummary: "水、麦芽、啤酒花",
    spec: "500ml 听装",
    priceSource: "中国零售参考价",
    updatedAt: "2026-04-22"
  },
  {
    id: "budweiser-classic",
    brand: "百威",
    name: "经典拉格",
    country: "美国",
    style: "拉格",
    abv: 4.5,
    tasteTags: ["清爽", "谷物感"],
    crowdTags: ["聚会囤货", "入门友好"],
    sceneTags: ["看球", "派对"],
    priceCny: 8,
    ingredientsSummary: "水、麦芽、大米、啤酒花",
    spec: "460ml 听装",
    priceSource: "中国零售参考价",
    updatedAt: "2026-04-22"
  },
  {
    id: "corona-extra",
    brand: "科罗娜",
    name: "Extra",
    country: "墨西哥",
    style: "拉格",
    abv: 4.5,
    tasteTags: ["清爽", "柑橘感"],
    crowdTags: ["入门友好", "海边场景"],
    sceneTags: ["海边", "露营"],
    priceCny: 10,
    ingredientsSummary: "水、麦芽、玉米、啤酒花",
    spec: "330ml 瓶装",
    priceSource: "中国零售参考价",
    updatedAt: "2026-04-22"
  },
  {
    id: "heineken-original",
    brand: "喜力",
    name: "Original",
    country: "荷兰",
    style: "拉格",
    abv: 5,
    tasteTags: ["清爽", "微苦"],
    crowdTags: ["入门友好", "聚会囤货"],
    sceneTags: ["看球", "夜生活"],
    priceCny: 9,
    ingredientsSummary: "水、麦芽、啤酒花",
    spec: "330ml 听装",
    priceSource: "中国零售参考价",
    updatedAt: "2026-04-22"
  },
  {
    id: "carlsberg-pilsner",
    brand: "嘉士伯",
    name: "Pilsner",
    country: "丹麦",
    style: "皮尔森",
    abv: 5,
    tasteTags: ["清爽", "微苦"],
    crowdTags: ["入门友好", "清爽党"],
    sceneTags: ["聚会", "晚餐"],
    priceCny: 8,
    ingredientsSummary: "水、麦芽、啤酒花",
    spec: "330ml 听装",
    priceSource: "中国零售参考价",
    updatedAt: "2026-04-22"
  },
  {
    id: "asahi-super-dry",
    brand: "朝日",
    name: "Super Dry",
    country: "日本",
    style: "拉格",
    abv: 5,
    tasteTags: ["清爽", "干净"],
    crowdTags: ["入门友好", "清爽党"],
    sceneTags: ["日料", "夏夜"],
    priceCny: 12,
    ingredientsSummary: "水、麦芽、大米、玉米、啤酒花",
    spec: "330ml 听装",
    priceSource: "中国零售参考价",
    updatedAt: "2026-04-22"
  },
  {
    id: "kirin-ichiban",
    brand: "麒麟",
    name: "一番榨",
    country: "日本",
    style: "拉格",
    abv: 5,
    tasteTags: ["清爽", "麦香"],
    crowdTags: ["入门友好", "精致晚餐"],
    sceneTags: ["日料", "家庭聚餐"],
    priceCny: 15,
    ingredientsSummary: "水、麦芽、啤酒花",
    spec: "330ml 听装",
    priceSource: "中国零售参考价",
    updatedAt: "2026-04-22"
  },
  {
    id: "sapporo-premium",
    brand: "札幌",
    name: "Premium Beer",
    country: "日本",
    style: "拉格",
    abv: 5,
    tasteTags: ["清爽", "麦香"],
    crowdTags: ["入门友好", "清爽党"],
    sceneTags: ["海鲜", "夏夜"],
    priceCny: 16,
    ingredientsSummary: "水、麦芽、啤酒花",
    spec: "350ml 听装",
    priceSource: "中国零售参考价",
    updatedAt: "2026-04-22"
  },
  {
    id: "hoegaarden-white",
    brand: "福佳",
    name: "白啤",
    country: "比利时",
    style: "小麦啤",
    abv: 4.9,
    tasteTags: ["果香", "清爽", "香料感"],
    crowdTags: ["入门友好", "女生聚会"],
    sceneTags: ["早午餐", "下午茶"],
    priceCny: 12,
    ingredientsSummary: "水、麦芽、小麦、橙皮、芫荽籽、啤酒花",
    spec: "330ml 瓶装",
    priceSource: "中国零售参考价",
    updatedAt: "2026-04-22"
  },
  {
    id: "vedett-extra-white",
    brand: "白熊",
    name: "Extra White",
    country: "比利时",
    style: "小麦啤",
    abv: 4.7,
    tasteTags: ["果香", "清爽", "轻盈"],
    crowdTags: ["入门友好", "女生聚会"],
    sceneTags: ["露台", "下午茶"],
    priceCny: 14,
    ingredientsSummary: "水、麦芽、小麦、橙皮、香料、啤酒花",
    spec: "330ml 瓶装",
    priceSource: "中国零售参考价",
    updatedAt: "2026-04-22"
  },
  {
    id: "stella-artois",
    brand: "时代",
    name: "Stella Artois",
    country: "比利时",
    style: "皮尔森",
    abv: 5,
    tasteTags: ["清爽", "微苦"],
    crowdTags: ["入门友好", "晚餐搭配"],
    sceneTags: ["牛排", "聚餐"],
    priceCny: 11,
    ingredientsSummary: "水、麦芽、玉米、啤酒花",
    spec: "330ml 瓶装",
    priceSource: "中国零售参考价",
    updatedAt: "2026-04-22"
  },
  {
    id: "leffe-blonde",
    brand: "乐飞",
    name: "金啤",
    country: "比利时",
    style: "修道院啤酒",
    abv: 6.6,
    tasteTags: ["麦香", "果香", "酒感"],
    crowdTags: ["精酿进阶", "重口味玩家"],
    sceneTags: ["奶酪", "晚餐"],
    priceCny: 16,
    ingredientsSummary: "水、麦芽、玉米、啤酒花",
    spec: "330ml 瓶装",
    priceSource: "中国零售参考价",
    updatedAt: "2026-04-22"
  },
  {
    id: "chimay-blue",
    brand: "智美",
    name: "蓝帽",
    country: "比利时",
    style: "修道院啤酒",
    abv: 9,
    tasteTags: ["麦香", "焦糖", "酒感"],
    crowdTags: ["重口味玩家", "收藏尝鲜"],
    sceneTags: ["慢饮", "甜品"],
    priceCny: 32,
    ingredientsSummary: "水、麦芽、糖、酵母、啤酒花",
    spec: "330ml 瓶装",
    priceSource: "中国零售参考价",
    updatedAt: "2026-04-22"
  },
  {
    id: "paulaner-hefe",
    brand: "柏龙",
    name: "小麦白啤",
    country: "德国",
    style: "小麦啤",
    abv: 5.5,
    tasteTags: ["麦香", "香蕉感", "顺滑"],
    crowdTags: ["入门友好", "精酿进阶"],
    sceneTags: ["香肠", "聚餐"],
    priceCny: 16,
    ingredientsSummary: "水、小麦麦芽、大麦麦芽、酵母、啤酒花",
    spec: "500ml 听装",
    priceSource: "中国零售参考价",
    updatedAt: "2026-04-22"
  },
  {
    id: "erdinger-weissbier",
    brand: "爱士堡",
    name: "小麦白啤",
    country: "德国",
    style: "小麦啤",
    abv: 5.3,
    tasteTags: ["麦香", "果香", "顺滑"],
    crowdTags: ["入门友好", "精致晚餐"],
    sceneTags: ["德餐", "聚会"],
    priceCny: 15,
    ingredientsSummary: "水、小麦麦芽、大麦麦芽、酵母、啤酒花",
    spec: "500ml 瓶装",
    priceSource: "中国零售参考价",
    updatedAt: "2026-04-22"
  },
  {
    id: "franziskaner-hefe",
    brand: "教士",
    name: "小麦白啤",
    country: "德国",
    style: "小麦啤",
    abv: 5,
    tasteTags: ["麦香", "果香", "清爽"],
    crowdTags: ["入门友好", "聚会升级"],
    sceneTags: ["烤鸡", "好友聚餐"],
    priceCny: 14,
    ingredientsSummary: "水、小麦麦芽、大麦麦芽、酵母、啤酒花",
    spec: "500ml 瓶装",
    priceSource: "中国零售参考价",
    updatedAt: "2026-04-22"
  },
  {
    id: "weihenstephaner-hefe",
    brand: "唯森",
    name: "小麦白啤",
    country: "德国",
    style: "小麦啤",
    abv: 5.4,
    tasteTags: ["麦香", "香蕉感", "丁香感"],
    crowdTags: ["精酿进阶", "小麦爱好者"],
    sceneTags: ["德式拼盘", "慢饮"],
    priceCny: 18,
    ingredientsSummary: "水、小麦麦芽、大麦麦芽、酵母、啤酒花",
    spec: "500ml 瓶装",
    priceSource: "中国零售参考价",
    updatedAt: "2026-04-22"
  },
  {
    id: "bitburger-pils",
    brand: "贝克格",
    name: "Bitburger Pils",
    country: "德国",
    style: "皮尔森",
    abv: 4.8,
    tasteTags: ["清爽", "微苦", "干净"],
    crowdTags: ["清爽党", "晚餐搭配"],
    sceneTags: ["炸物", "夏夜"],
    priceCny: 13,
    ingredientsSummary: "水、麦芽、啤酒花",
    spec: "500ml 听装",
    priceSource: "中国零售参考价",
    updatedAt: "2026-04-22"
  },
  {
    id: "pilsner-urquell",
    brand: "皮尔森欧克",
    name: "Pilsner Urquell",
    country: "捷克",
    style: "皮尔森",
    abv: 4.4,
    tasteTags: ["清爽", "麦香", "微苦"],
    crowdTags: ["风格尝鲜", "清爽党"],
    sceneTags: ["烤肉", "晚餐"],
    priceCny: 13,
    ingredientsSummary: "水、麦芽、啤酒花",
    spec: "330ml 瓶装",
    priceSource: "中国零售参考价",
    updatedAt: "2026-04-22"
  },
  {
    id: "guinness-draught",
    brand: "健力士",
    name: "Draught",
    country: "爱尔兰",
    style: "世涛",
    abv: 4.2,
    tasteTags: ["焦香", "顺滑", "咖啡感"],
    crowdTags: ["重口味玩家", "黑啤入门"],
    sceneTags: ["汉堡", "宵夜"],
    priceCny: 16,
    ingredientsSummary: "水、大麦麦芽、烘焙大麦、啤酒花",
    spec: "440ml 听装",
    priceSource: "中国零售参考价",
    updatedAt: "2026-04-22"
  },
  {
    id: "brewdog-punk-ipa",
    brand: "酿酒狗",
    name: "Punk IPA",
    country: "英国",
    style: "IPA",
    abv: 5.4,
    tasteTags: ["苦度高", "柑橘感", "果香"],
    crowdTags: ["精酿进阶", "IPA爱好者"],
    sceneTags: ["炸鸡", "夜生活"],
    priceCny: 18,
    ingredientsSummary: "水、麦芽、啤酒花、酵母",
    spec: "330ml 听装",
    priceSource: "中国零售参考价",
    updatedAt: "2026-04-22"
  },
  {
    id: "fullers-london-pride",
    brand: "富乐",
    name: "London Pride",
    country: "英国",
    style: "英式艾尔",
    abv: 4.7,
    tasteTags: ["麦香", "焦糖", "平衡"],
    crowdTags: ["精酿进阶", "英式风格爱好者"],
    sceneTags: ["烤肉", "慢饮"],
    priceCny: 19,
    ingredientsSummary: "水、麦芽、啤酒花、酵母",
    spec: "500ml 瓶装",
    priceSource: "中国零售参考价",
    updatedAt: "2026-04-22"
  },
  {
    id: "goose-island-ipa",
    brand: "鹅岛",
    name: "IPA",
    country: "美国",
    style: "IPA",
    abv: 5.9,
    tasteTags: ["苦度高", "柑橘感", "果香"],
    crowdTags: ["精酿进阶", "IPA爱好者"],
    sceneTags: ["炸物", "夜宵"],
    priceCny: 14,
    ingredientsSummary: "水、麦芽、啤酒花、酵母",
    spec: "355ml 听装",
    priceSource: "中国零售参考价",
    updatedAt: "2026-04-22"
  },
  {
    id: "sierra-nevada-pale-ale",
    brand: "内华达山脉",
    name: "Pale Ale",
    country: "美国",
    style: "美式淡色艾尔",
    abv: 5.6,
    tasteTags: ["麦香", "柑橘感", "微苦"],
    crowdTags: ["精酿进阶", "风格尝鲜"],
    sceneTags: ["汉堡", "好友聚会"],
    priceCny: 20,
    ingredientsSummary: "水、麦芽、啤酒花、酵母",
    spec: "355ml 瓶装",
    priceSource: "中国零售参考价",
    updatedAt: "2026-04-22"
  },
  {
    id: "brooklyn-lager",
    brand: "布鲁克林",
    name: "Lager",
    country: "美国",
    style: "拉格",
    abv: 5.2,
    tasteTags: ["麦香", "微苦", "平衡"],
    crowdTags: ["聚会升级", "风格尝鲜"],
    sceneTags: ["披萨", "朋友聚会"],
    priceCny: 14,
    ingredientsSummary: "水、麦芽、啤酒花、酵母",
    spec: "355ml 瓶装",
    priceSource: "中国零售参考价",
    updatedAt: "2026-04-22"
  },
  {
    id: "ballast-point-sculpin",
    brand: "巴拉斯特角",
    name: "Sculpin IPA",
    country: "美国",
    style: "IPA",
    abv: 7,
    tasteTags: ["苦度高", "热带水果", "果香"],
    crowdTags: ["IPA爱好者", "重口味玩家"],
    sceneTags: ["烧烤", "慢饮"],
    priceCny: 28,
    ingredientsSummary: "水、麦芽、啤酒花、酵母",
    spec: "355ml 瓶装",
    priceSource: "中国零售参考价",
    updatedAt: "2026-04-22"
  },
  {
    id: "stone-ipa",
    brand: "石头",
    name: "IPA",
    country: "美国",
    style: "IPA",
    abv: 6.9,
    tasteTags: ["苦度高", "松针感", "柑橘感"],
    crowdTags: ["IPA爱好者", "重口味玩家"],
    sceneTags: ["炸鸡", "夜生活"],
    priceCny: 26,
    ingredientsSummary: "水、麦芽、啤酒花、酵母",
    spec: "355ml 听装",
    priceSource: "中国零售参考价",
    updatedAt: "2026-04-22"
  },
  {
    id: "orval-trappist",
    brand: "奥瓦尔",
    name: "Trappist Ale",
    country: "比利时",
    style: "修道院啤酒",
    abv: 6.2,
    tasteTags: ["果香", "干爽", "野菌感"],
    crowdTags: ["风格尝鲜", "收藏尝鲜"],
    sceneTags: ["奶酪", "慢饮"],
    priceCny: 30,
    ingredientsSummary: "水、麦芽、糖、酵母、啤酒花",
    spec: "330ml 瓶装",
    priceSource: "中国零售参考价",
    updatedAt: "2026-04-22"
  },
  {
    id: "duvel-golden-ale",
    brand: "督威",
    name: "Golden Ale",
    country: "比利时",
    style: "金色艾尔",
    abv: 8.5,
    tasteTags: ["果香", "酒感", "干爽"],
    crowdTags: ["风格尝鲜", "收藏尝鲜"],
    sceneTags: ["海鲜", "慢饮"],
    priceCny: 22,
    ingredientsSummary: "水、麦芽、糖、酵母、啤酒花",
    spec: "330ml 瓶装",
    priceSource: "中国零售参考价",
    updatedAt: "2026-04-22"
  },
  {
    id: "westmalle-dubbel",
    brand: "维斯特玛",
    name: "Dubbel",
    country: "比利时",
    style: "修道院啤酒",
    abv: 7,
    tasteTags: ["焦糖", "果干感", "酒感"],
    crowdTags: ["重口味玩家", "收藏尝鲜"],
    sceneTags: ["炖肉", "慢饮"],
    priceCny: 24,
    ingredientsSummary: "水、麦芽、糖、酵母、啤酒花",
    spec: "330ml 瓶装",
    priceSource: "中国零售参考价",
    updatedAt: "2026-04-22"
  },
  {
    id: "hitachino-white-ale",
    brand: "常陆野猫头鹰",
    name: "White Ale",
    country: "日本",
    style: "小麦啤",
    abv: 5.5,
    tasteTags: ["果香", "香料感", "清爽"],
    crowdTags: ["风格尝鲜", "女生聚会"],
    sceneTags: ["下午茶", "海鲜"],
    priceCny: 24,
    ingredientsSummary: "水、麦芽、小麦、香料、啤酒花",
    spec: "330ml 瓶装",
    priceSource: "中国零售参考价",
    updatedAt: "2026-04-22"
  },
  {
    id: "yoho-yondan",
    brand: "馨和",
    name: "印度青鬼 IPA",
    country: "日本",
    style: "IPA",
    abv: 7,
    tasteTags: ["苦度高", "热带水果", "酒感"],
    crowdTags: ["IPA爱好者", "重口味玩家"],
    sceneTags: ["炸鸡", "夜宵"],
    priceCny: 18,
    ingredientsSummary: "水、麦芽、啤酒花、酵母",
    spec: "350ml 听装",
    priceSource: "中国零售参考价",
    updatedAt: "2026-04-22"
  },
  {
    id: "young-master-cha-chaan",
    brand: "少爷啤",
    name: "Cha Chaan Teng Gose",
    country: "中国",
    style: "酸啤",
    abv: 4.8,
    tasteTags: ["酸爽", "咸柠感", "清爽"],
    crowdTags: ["风格尝鲜", "夏日猎奇"],
    sceneTags: ["海边", "早午餐"],
    priceCny: 22,
    ingredientsSummary: "水、麦芽、小麦、盐、香料、酵母、啤酒花",
    spec: "330ml 听装",
    priceSource: "中国零售参考价",
    updatedAt: "2026-04-22"
  },
  {
    id: "master-gao-baby-jasmine",
    brand: "高大师",
    name: "婴儿茉莉花皮尔森",
    country: "中国",
    style: "皮尔森",
    abv: 4.5,
    tasteTags: ["花香", "清爽", "轻盈"],
    crowdTags: ["风格尝鲜", "女生聚会"],
    sceneTags: ["露台", "下午茶"],
    priceCny: 18,
    ingredientsSummary: "水、麦芽、茉莉花茶、啤酒花、酵母",
    spec: "330ml 听装",
    priceSource: "中国零售参考价",
    updatedAt: "2026-04-22"
  }
];

export const beers = rawBeers.map(enrichBeer);

const realImageEntries = beers
  .filter((beer) => beer.imageKind === "real" && beer.imageSourcePage)
  .sort((left, right) =>
    `${left.brand} ${left.name}`.localeCompare(`${right.brand} ${right.name}`, "zh-Hans-CN"),
  );

const realImageNames = realImageEntries.map((beer) => `${beer.brand} ${beer.name}`);

export const pageSections = [
  {
    id: "notes",
    eyebrow: "How To Choose",
    title: "夏天选啤酒，三条经验就够",
    intro:
      "炎热天气下，口感与场景比复杂术语更重要。先确认你是想“解暑”“配餐”还是“慢饮”，再决定选清爽型、小麦型还是苦度更高的 IPA。",
    items: [
      {
        title: "想解暑",
        body: "优先看拉格、皮尔森、白啤。关键词通常是清爽、干净、轻盈、微苦，适合露营、海边和夜宵。"
      },
      {
        title: "想配餐",
        body: "炸物、烧烤更适合带一点苦度或麦香的酒；海鲜和沙拉更适合清爽、果香或带香料感的小麦风格。"
      },
      {
        title: "想慢饮",
        body: "可以往修道院、世涛、IPA 走，风味更复杂，价格也更高，不建议把它们当作大口猛灌型夏日水啤。"
      }
    ]
  },
  {
    id: "about",
    eyebrow: "Data Notes",
    title: "关于这份页面",
    items: [
      {
        title: "价格说明",
        body: "页面中的价格为中国主流零售渠道参考价，不代表实时售价。不同城市、平台和活动期会有差异。"
      },
      {
        title: "配料说明",
        body: "配料字段用于辅助理解风格与口感，例如小麦、香料、橙皮、焦香麦芽等，最终仍以产品包装标识为准。"
      },
      {
        title: "扩展策略",
        body: "首版是高质量精选库，数据结构已预留后续接远程 JSON 与更大品牌索引的扩展空间。"
      }
    ]
  },
  {
    id: "credits",
    eyebrow: "Image Credits",
    title: "图片来源说明",
    intro:
      "页面中的部分真实产品图来自 Wikimedia Commons，并已下载为本地图片供页面使用。其余产品仍使用项目内统一生成的风格海报图，以保证整体完整度和加载性能。",
    items: [
      {
        title: "已接入真实图",
        body: `${realImageNames.join("、")}。`
      },
      {
        title: "来源页",
        links: realImageEntries.map((beer) => ({
          label: `${beer.brand} ${beer.name}`,
          href: beer.imageSourcePage
        }))
      },
      {
        title: "继续扩充",
        body: "完整清单维护在项目文档中。后续继续补图时，会优先选择带明确许可证与来源页的公共图库素材，而不是直接热链电商图。"
      }
    ]
  }
];

export const pageMeta = {
  countryCount: new Set(beers.map((beer) => beer.country)).size,
  decisionDimensions: 5,
  defaultSummary: "从人群、口感、产地和价格带切入，快速找到适合夏天的那一杯。",
  bootErrorMessage: "页面数据暂时不可用，请稍后刷新，或检查本地数据文件是否完整。"
};
