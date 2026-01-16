# 🗺️ 智旅攻略网站

基于 Next.js 构建的旅游攻略展示网站,集成高德地图API实现交互式路线规划。

## ✨ 功能特性

- 📱 **移动端优先设计** - 完美适配手机、平板、桌面端
- 🗂️ **40+城市攻略** - 覆盖全国热门旅游目的地
- 🔍 **智能筛选搜索** - 按地区、天数、主题快速查找
- 📝 **Markdown渲染** - 完整展示攻略内容,支持表格、列表等
- 🗺️ **高德地图集成** - 可视化行程路线,自定义标记图标
- ⏱️ **时间轴展示** - 清晰的每日行程安排
- 🎨 **现代化UI** - 基于Tailwind CSS的精美界面
- 🖼️ **Unsplash图片** - 自动获取城市高质量封面图（可选）

## 🛠️ 技术栈

- **框架**: Next.js 14 (Pages Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **地图**: 高德地图 JavaScript API
- **Markdown**: gray-matter + react-markdown
- **部署**: Vercel / Netlify

## 📁 项目结构

```
travel-guides-web/
├── src/
│   ├── pages/              # 页面路由
│   │   ├── index.tsx       # 首页(攻略列表)
│   │   ├── guides/
│   │   │   └── [city].tsx  # 攻略详情页
│   │   └── itinerary/
│   │       └── [city].tsx  # 行程总览页(地图+时间轴)
│   ├── components/         # React组件
│   │   ├── GuideCard.tsx   # 攻略卡片
│   │   ├── FilterBar.tsx   # 筛选栏
│   │   ├── Timeline.tsx    # 时间轴
│   │   ├── MapView.tsx     # 地图组件
│   │   └── MarkdownRenderer.tsx  # Markdown渲染器
│   ├── lib/                # 工具函数
│   │   ├── markdown.ts     # Markdown解析
│   │   ├── locations.ts    # 景点坐标管理
│   │   └── amap.ts         # 高德地图封装
│   ├── data/
│   │   └── locations.json  # 景点坐标数据
│   ├── types/
│   │   └── guide.ts        # TypeScript类型定义
│   └── styles/
│       └── globals.css     # 全局样式
├── public/                 # 静态资源
└── .env.local              # 环境变量

```

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

创建 `.env.local` 文件:

```env
# 高德地图API Key (必需)
# 获取地址: https://lbs.amap.com/
NEXT_PUBLIC_AMAP_KEY=your_amap_key_here

# Unsplash API Access Key (可选)
# 获取地址: https://unsplash.com/developers
# 用于自动获取城市封面图片，如果不配置将使用渐变背景
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here

# 攻略数据目录路径
GUIDES_DATA_PATH=../travel-guides/guides
```

**注意：** Unsplash API Key 是可选的。如果不配置，网站会自动使用渐变背景作为封面。

### 3. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

### 4. 构建生产版本

```bash
npm run build
npm start
```

## 📝 数据格式

### 攻略Markdown文件

在 `../travel-guides/guides/[city]/` 目录下创建攻略文件,支持frontmatter元数据:

```markdown
---
city: beijing
title: 北京春节5天4夜家庭游
days: 5
nights: 4
theme: 春节家庭游
region: 华北
tags: [历史文化, 亲子, 春节]
budget: 5000
season: 冬季
cover: /images/beijing-guide.png
rating: 4.8
---

# 北京春节5天4夜家庭游完整攻略

> 基于小红书热门攻略整理

## 一、出行安排
...
```

### 景点坐标数据

在 `src/data/locations.json` 中添加城市景点坐标:

```json
{
  "beijing": {
    "故宫": { "lat": 39.9163, "lng": 116.3972, "type": "attraction" },
    "天坛": { "lat": 39.8828, "lng": 116.4068, "type": "attraction" }
  }
}
```

## 🔑 API 配置

### 高德地图 (必需)

1. 访问 [高德开放平台](https://lbs.amap.com/)
2. 注册账号并创建应用
3. 获取 Web端(JS API) Key
4. 配置域名白名单(开发环境: `localhost:3000`)
5. 将Key添加到 `.env.local`

### Unsplash 图片 (可选)

1. 访问 [Unsplash Developers](https://unsplash.com/developers)
2. 注册账号并创建新应用
3. 获取 Access Key
4. 将Key添加到 `.env.local`

**功能说明：**
- 自动从 Unsplash 获取城市相关的高质量图片
- 免费版限制：每小时 50 次请求
- 如果不配置，会自动降级到渐变背景或本地图片

## 📦 部署

### Vercel (推荐)

1. 将代码推送到GitHub
2. 在Vercel中导入项目
3. 配置环境变量：
   - `NEXT_PUBLIC_AMAP_KEY` (必需)
   - `NEXT_PUBLIC_UNSPLASH_ACCESS_KEY` (可选)
4. 自动部署完成

### 其他平台

```bash
npm run build
```

将 `.next` 目录部署到任何支持Node.js的平台。

## 🎨 自定义

### 修改主题色

编辑 `src/styles/globals.css`,修改Tailwind配置:

```css
/* 主色调: 蓝色 -> 绿色 */
.bg-blue-600 { @apply bg-green-600; }
.text-blue-600 { @apply text-green-600; }
```

### 添加新城市

1. 在 `../travel-guides/guides/` 创建城市目录
2. 添加Markdown攻略文件
3. 在 `src/data/locations.json` 添加景点坐标
4. 重新构建项目

## 📄 License

个人使用,攻略内容来源于小红书博主分享,仅供参考。

## 🙏 致谢

- 攻略数据来源: 小红书MCP
- 地图服务: 高德地图
- 图片服务: Unsplash
- UI框架: Tailwind CSS
- 图标: Heroicons

## 📖 更多文档

- [UI升级指南](./UI_UPGRADE_GUIDE.md) - 详细的UI升级说明和配置指南
- [快速启动指南](./QUICK_START.md) - 项目启动步骤
- [项目总结](./PROJECT_SUMMARY.md) - 完整的项目功能清单

---

**Happy Traveling! 🎉**
