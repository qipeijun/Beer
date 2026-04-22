# Beer Summer Guide

一个纯静态的夏日啤酒选择指南页面，面向中文用户，支持按人群、口感、产地、风格、价格带和关键词筛选，并提供产品详情、价格说明和图片来源说明。

## Features

- 37 个精选啤酒产品数据
- 当前 37/37 产品已实现 100% 本地图片覆盖
- 本地静态资源，无需后端
- 可直接双击打开 `index.html`
- 卡片列表与联动详情区
- 部分产品接入真实本地图片，其余使用项目内统一生成的 SVG 海报图，并在页面上明确标注“真实图/生成图”
- 图片来源说明与文档清单

## Structure

- `index.html`: 页面入口
- `styles.css`: 样式
- `src/data.js`: 源数据
- `src/app.js`: 源交互逻辑
- `data.global.js`: 浏览器直接加载的数据构建产物
- `app.global.js`: 浏览器直接加载的交互构建产物
- `assets/beers/`: 项目生成的 SVG 海报与场景图
- `assets/commons/`: 下载的真实图片原文件
- `assets/commons/web/`: 页面实际使用的网页尺寸图片
- `docs/image-sources.md`: 真实图片来源清单
- `docs/image-search-playbook.md`: 真实图片检索策略说明
- `docs/image-search-queries.json`: 剩余缺图产品的多路径检索关键词清单

## Scripts

- `npm run build`: 从 `src/` 重新生成浏览器可直接加载的脚本和数据
- `npm run build:browser-app`: 生成 `app.global.js`
- `npm run build:browser-data`: 生成 `data.global.js`
- `npm run build:image-search`: 生成剩余缺图产品的多路径检索关键词清单
- `npm run generate:art`: 重新生成 SVG 海报和场景图
- `npm test`: 运行自动化测试
- `npm run verify`: 先构建再测试，作为上线前检查

## Local Use

1. 如修改了 `src/data.js` 或 `src/app.js`，先运行：

```bash
npm run build
```

2. 本地预览可直接双击打开：

```text
index.html
```

也可以启动一个静态服务器进行预览。

## Deploy

这是一个纯静态站点，可部署到任意静态托管平台，例如 GitHub Pages、Netlify、Vercel Static、Cloudflare Pages 或对象存储静态网站。

上线前建议执行：

```bash
npm run verify
```

部署时保留这些文件和目录：

- `index.html`
- `styles.css`
- `app.global.js`
- `data.global.js`
- `assets/`
- `docs/` 可选，若你希望线上保留来源文档

## Image Policy

- 页面优先使用本地图片，不使用外链热链
- 当前产品库已实现页面层面的 100% 图片覆盖：真实图优先，缺失项由本地生成海报图兜底
- 真实产品图优先来自可追溯来源，如 Wikimedia Commons
- 新增真实图片后，应同步更新 `docs/image-sources.md`
- 大图建议保留原始文件，并在 `assets/commons/web/` 放一份网页尺寸版
- 继续补真实图时，优先使用 `docs/image-search-playbook.md` 中定义的 5 种检索方式

## Release Checklist

- 运行 `npm run build`
- 运行 `npm test` 或 `npm run verify`
- 抽查 `index.html` 能否直接打开
- 抽查筛选器、详情区、图片加载和图片来源说明
- 如改动了数据或图片，确认 `docs/image-sources.md` 已更新
