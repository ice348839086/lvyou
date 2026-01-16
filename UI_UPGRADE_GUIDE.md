# UI 升级指南

## 📝 更新说明

本次更新对网站进行了全面的视觉升级，包括：

### 1. 🖼️ Unsplash 图片集成

**功能：** 自动从 Unsplash 获取城市高质量封面图片

**配置步骤：**

1. 访问 [Unsplash Developers](https://unsplash.com/developers)
2. 注册账号并创建新应用
3. 获取 Access Key
4. 在 `.env.local` 中添加：
   ```env
   NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=your_access_key_here
   ```

**使用限制：**
- 免费版：每小时 50 次请求
- 图片会自动缓存，避免重复请求
- 如果不配置，会自动降级到渐变背景

### 2. 🗺️ 地图样式升级

**改进内容：**

- ✅ 自定义标记图标（景点🏛️、餐厅🍜、酒店🏨、交通🚕）
- ✅ 使用高德地图"清新蓝"主题
- ✅ 优化信息窗体样式
- ✅ 添加路线方向箭头
- ✅ 改进标记悬停效果

**技术实现：**
```typescript
// 自定义HTML标记，支持不同类型的图标和颜色
const marker = new AMap.Marker({
  content: customIconHtml,
  type: 'attraction' | 'restaurant' | 'hotel' | 'transport'
});
```

### 3. 🎨 整体 UI 现代化

**设计风格：**
- 现代简约风格
- 大圆角（rounded-2xl, rounded-3xl）
- 柔和阴影（shadow-lg, shadow-xl）
- 渐变色背景
- 毛玻璃效果（backdrop-blur）

**主要改进：**

#### 首页
- 渐变背景（from-gray-50 via-blue-50 to-purple-50）
- 装饰性背景元素
- 优化卡片间距和阴影
- 改进空状态显示

#### 攻略详情页
- 毛玻璃导航栏
- 渐变头部 Banner
- 优化标签样式
- 大圆角内容卡片

#### 行程地图页
- 双视图优化
- 图例卡片美化
- 时间轴样式改进

### 4. 📊 组件更新清单

| 组件 | 更新内容 |
|------|---------|
| `GuideCard.tsx` | 动态图片加载、现代卡片样式、悬停动画 |
| `MapView.tsx` | 自定义标记、美化加载状态 |
| `index.tsx` | 渐变背景、优化布局 |
| `guides/[city].tsx` | 毛玻璃效果、渐变 Banner |
| `itinerary/[city].tsx` | 双视图优化、图例美化 |
| `globals.css` | 滚动条样式、Markdown 样式 |

## 🚀 使用方法

### 开发环境

1. 复制环境变量模板：
   ```bash
   cp .env.local.example .env.local
   ```

2. 配置 API Keys：
   ```env
   NEXT_PUBLIC_AMAP_KEY=your_amap_key
   NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=your_unsplash_key  # 可选
   ```

3. 启动开发服务器：
   ```bash
   npm run dev
   ```

### 生产部署

在 Vercel 或其他平台的环境变量中添加：

- `NEXT_PUBLIC_AMAP_KEY`
- `NEXT_PUBLIC_UNSPLASH_ACCESS_KEY`（可选）

## 🎯 降级方案

如果不配置 Unsplash API Key：

1. **自动降级到本地图片**
   - 检查 `public/images/{city}-guide.png`
   - 如果存在则使用本地图片

2. **渐变背景**
   - 基于城市名生成一致的渐变色
   - 8 种预设渐变色自动轮换

## 📸 效果预览

### 封面图片
- ✅ Unsplash 高质量图片（优先）
- ✅ 本地图片（备选）
- ✅ 渐变背景（降级）

### 地图标记
- 🏛️ 蓝色 - 景点
- 🍜 橙色 - 餐厅
- 🏨 绿色 - 酒店
- 🚕 灰色 - 交通

### UI 风格
- 大圆角（12px-24px）
- 柔和阴影
- 渐变色点缀
- 毛玻璃效果

## 🔧 自定义配置

### 修改渐变色

编辑 `src/lib/unsplash.ts`：

```typescript
const gradients = [
  'from-blue-400 to-purple-500',
  'from-green-400 to-blue-500',
  // 添加更多渐变...
];
```

### 修改地图主题

编辑 `src/lib/amap.ts`：

```typescript
mapStyle: 'amap://styles/fresh', // 可选: fresh, macaron, grey, etc.
```

### 修改标记图标

编辑 `src/lib/amap.ts` 中的 `getMarkerIcon` 函数。

## 📚 相关文档

- [Unsplash API 文档](https://unsplash.com/documentation)
- [高德地图 API 文档](https://lbs.amap.com/api/javascript-api/summary)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)

## ⚠️ 注意事项

1. **Unsplash 速率限制**
   - 免费版每小时 50 次请求
   - 建议在构建时预加载图片
   - 已实现内存缓存机制

2. **图片加载性能**
   - 使用 Next.js Image 组件自动优化
   - 支持 WebP/AVIF 格式
   - 懒加载和响应式尺寸

3. **地图性能**
   - 动态导入避免 SSR 问题
   - 自动调整视野范围
   - 标记聚合（未来可实现）

## 🎉 升级完成

现在你的旅游攻略网站拥有：

- ✅ 精美的城市封面图片
- ✅ 直观的地图标记系统
- ✅ 现代简约的 UI 设计
- ✅ 流畅的用户体验

享受你的新网站吧！🚀
