# Beer Image Sources

本项目优先使用可明确授权或可追溯来源的图片素材。当前 37 个产品已经实现 100% 本地图片覆盖：

- 已接入真实授权图的产品，使用 Wikimedia Commons 来源并记录来源页
- 未获得真实授权图的产品，使用项目内生成的 SVG 海报图兜底

也就是说，页面层面已经达到“全量有图”；真实图覆盖率则持续逐步提升。

## 已接入

| Product | Local File | Source | Notes |
|---|---|---|---|
| Corona Extra | `assets/commons/web/corona-extra-real.png` | https://commons.wikimedia.org/wiki/File:Corona_Extra_beer_bottle_(2019).png | Wikimedia Commons，页面含许可证信息；已生成网页尺寸版 |
| Hoegaarden White | `assets/commons/web/hoegaarden-white-real.jpg` | https://commons.wikimedia.org/wiki/File:Hoegaarden_bottle.JPG | Wikimedia Commons，页面含许可证信息；已生成网页尺寸版 |
| Asahi Super Dry | `assets/commons/web/asahi-super-dry-real.jpg` | https://commons.wikimedia.org/wiki/File:Asahi_Super_Dry.jpg | Wikimedia Commons，页面含许可证信息；已生成网页尺寸版 |
| Paulaner Hefe-Weissbier | `assets/commons/web/paulaner-hefe-real.jpg` | https://commons.wikimedia.org/wiki/File:Paulaner_Hefe-Weissbier.JPG | Wikimedia Commons，页面含许可证信息 |
| Guinness Draught | `assets/commons/web/guinness-draught-real.jpg` | https://commons.wikimedia.org/wiki/File:Guinness_Draught.jpg | Wikimedia Commons，页面含许可证信息 |
| Heineken | `assets/commons/web/heineken-original.jpg` | https://commons.wikimedia.org/wiki/File:Heineken_Bottle.JPG | Wikimedia Commons，页面含许可证信息；已生成网页尺寸版 |
| Budweiser | `assets/commons/web/budweiser-original.jpg` | https://commons.wikimedia.org/wiki/File:Budweiser_Bottle.jpg | Wikimedia Commons，页面含许可证信息；已生成网页尺寸版 |
| Stella Artois | `assets/commons/web/stella-artois-original.jpg` | https://commons.wikimedia.org/wiki/File:Stella_Artois_bottle.jpg | Wikimedia Commons，页面含许可证信息；已生成网页尺寸版 |
| Carlsberg | `assets/commons/web/carlsberg-original.jpg` | https://commons.wikimedia.org/wiki/File:Carlsberg_(bottle).jpg | Wikimedia Commons，页面含许可证信息 |
| Kirin Ichiban | `assets/commons/web/kirin-ichiban-original.jpg` | https://commons.wikimedia.org/wiki/File:Kirin_Beer.jpg | Wikimedia Commons，页面含许可证信息；已生成网页尺寸版 |
| Sapporo Premium | `assets/commons/web/sapporo-premium-original.jpg` | https://commons.wikimedia.org/wiki/File:A_Bottle_of_Sapporo_Beer.jpg | Wikimedia Commons，页面含许可证信息；已生成网页尺寸版 |
| Pilsner Urquell | `assets/commons/web/pilsner-urquell-original.jpg` | https://commons.wikimedia.org/wiki/File:Pilsner_Urquell_330mL_Bottle.jpg | Wikimedia Commons，页面含许可证信息；已生成网页尺寸版 |
| Erdinger Weissbier | `assets/commons/web/erdinger-weissbier-original.jpg` | https://commons.wikimedia.org/wiki/File:Erdinger_weissbrau.jpg | Wikimedia Commons，页面含许可证信息；已生成网页尺寸版 |
| Leffe Blonde | `assets/commons/web/leffe-blonde-original.jpg` | https://commons.wikimedia.org/wiki/File:LeffeBlond.jpg | Wikimedia Commons，页面含许可证信息 |
| Bitburger Pils | `assets/commons/web/bitburger-pils-original.jpg` | https://commons.wikimedia.org/wiki/File:Bitburger_Pils.jpg | Wikimedia Commons，页面含许可证信息 |

## 说明

- 页面最终使用本地图片文件，而不是外链热链。
- 大图优先保留原始下载文件，再额外生成 `assets/commons/web/` 下的网页尺寸版本供页面调用。
- 下载进入项目之前，应继续核对每张图的许可证、作者与可复用范围。
- 若后续批量补图，建议同步维护一个结构化清单，例如 `id -> localFile -> sourcePage -> license`。
- 未在上表列出的产品默认使用 `assets/beers/` 下的项目生成海报图，这部分同样属于正式上线资源。
