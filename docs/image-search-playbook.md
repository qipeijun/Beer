# Image Search Playbook

目标：提高真实产品图检索的效率、成功率和可追溯性。

## 搜图方式

### 1. Wikimedia File 页检索

优先级最高，适合找可明确授权、可直接落地的真实图。

查询示例：

- `site:commons.wikimedia.org/wiki/File: "<brand product>" beer`
- `site:commons.wikimedia.org/wiki/File: "<brand product>" bottle`
- `site:commons.wikimedia.org/wiki/File: "<brand product>" can`

### 2. Wikimedia Category / Commons 分类检索

适合 File 页搜不到精确文件时，从品牌或风格分类里找单瓶图。

查询示例：

- `site:commons.wikimedia.org/wiki/Category: "<brand>" beer`
- `site:commons.wikimedia.org "<brand product>" Wikimedia Commons`
- `site:commons.wikimedia.org "<country> beer <product>" Commons`

### 3. 品牌官方素材 / 媒体包检索

适合 Commons 没有时，转向品牌官网或 press/media kit。

查询示例：

- `"<brand product>" official product image`
- `"<brand product>" media kit bottle png`
- `"<brand>" 官方 产品图 啤酒`

### 4. 结构化开放数据检索

适合补充验证英文名、包装版本和开放图片来源。

查询示例：

- `"<brand product>" Wikidata image`
- `"<brand product>" Open Food Facts beer`
- `"<brand product>" Wikipedia bottle image`

### 5. 电商 / 零售参考检索

只作为包装版本参考，不作为默认正式上线图片来源。

查询示例：

- `"<brand product>" can bottle packshot`
- `"<brand> <product> 电商 图"`
- `"<brand product>" bottle transparent png`

## 推荐顺序

1. Wikimedia File 页
2. Wikimedia Category / Commons 分类
3. 官方素材 / 媒体包
4. 结构化开放数据
5. 电商参考

## 实操规则

- 一次只处理 1 个产品，避免网络或命名混乱
- 下载成功后，先压缩到 `assets/commons/web/`
- 只在确认文件类型正确后再接入 `src/data.js`
- 更新 `docs/image-sources.md`
- 最后运行：

```bash
npm run build
npm test
```

## 自动清单

运行下面的命令，会为尚未接入真实图的产品生成多路径检索关键词：

```bash
npm run build:image-search
```

输出文件：

- `docs/image-search-queries.json`
