# Vercel部署问题修复

## 🔴 当前问题

1. ✅ **已修复**: `swcMinify` 配置错误
2. ⚠️ **待解决**: 攻略数据路径问题

## 问题详情

### 问题1: swcMinify配置错误 ✅

**错误信息**:
```
⚠ Invalid next.config.ts options detected: 
⚠     Unrecognized key(s) in object: 'swcMinify'
```

**原因**: Next.js 16中`swcMinify`已被移除(默认启用)

**解决方案**: 已从`next.config.ts`中删除此选项

---

### 问题2: 攻略数据路径 ⚠️

**问题**: 项目依赖 `../travel-guides/guides/` 目录,但该目录不在Git仓库中

**当前代码**:
```typescript
// src/lib/markdown.ts
const guidesDirectory = path.join(process.cwd(), '..', 'travel-guides', 'guides');
```

**结果**: Vercel构建时找不到攻略数据,页面为空

---

## 🔧 解决方案

### 方案A: 将攻略数据移到项目内 (推荐) ⭐⭐⭐⭐⭐

**步骤**:

1. **复制攻略数据到项目内**:
```bash
cd c:\code\linglong\travel-guides-web
mkdir -p public\guides
xcopy /E /I ..\travel-guides\guides public\guides
```

2. **修改数据路径**:

修改 `src/lib/markdown.ts`:
```typescript
// 原来
const guidesDirectory = path.join(process.cwd(), '..', 'travel-guides', 'guides');

// 改为
const guidesDirectory = path.join(process.cwd(), 'public', 'guides');
```

3. **提交并推送**:
```bash
git add public/guides src/lib/markdown.ts
git commit -m "Move travel guides data into project"
git push
```

**优点**:
- ✅ 简单直接
- ✅ 数据和代码在一起
- ✅ Vercel可以直接访问

**缺点**:
- ❌ 数据重复
- ❌ 需要手动同步更新

---

### 方案B: 创建独立数据仓库

**步骤**:

1. **创建数据仓库**:
```bash
cd c:\code\linglong
git init travel-guides-data
cd travel-guides-data
xcopy /E /I ..\travel-guides\guides guides
git add .
git commit -m "Initial commit: Travel guides data"
git remote add origin https://github.com/ice348839086/lvyou-data.git
git push -u origin main
```

2. **在构建时拉取数据**:

创建 `scripts/fetch-data.js`:
```javascript
const { execSync } = require('child_process');
const fs = require('fs');

if (!fs.existsSync('public/guides')) {
  console.log('Cloning travel guides data...');
  execSync('git clone https://github.com/ice348839086/lvyou-data.git temp-data');
  execSync('mv temp-data/guides public/guides');
  execSync('rm -rf temp-data');
}
```

3. **修改package.json**:
```json
{
  "scripts": {
    "prebuild": "node scripts/fetch-data.js",
    "build": "next build"
  }
}
```

---

### 方案C: 使用环境变量配置路径

**步骤**:

1. **修改 `src/lib/markdown.ts`**:
```typescript
const guidesDirectory = process.env.GUIDES_DATA_PATH 
  ? path.join(process.cwd(), process.env.GUIDES_DATA_PATH)
  : path.join(process.cwd(), 'public', 'guides');
```

2. **在Vercel配置环境变量**:
```
GUIDES_DATA_PATH=public/guides
```

3. **本地使用 `.env.local`**:
```
GUIDES_DATA_PATH=../travel-guides/guides
```

---

## 🚀 立即修复 (推荐方案A)

执行以下命令:

```bash
# 1. 复制攻略数据
cd c:\code\linglong\travel-guides-web
mkdir public\guides
xcopy /E /I ..\travel-guides\guides public\guides

# 2. 修改代码 (手动编辑 src/lib/markdown.ts)

# 3. 提交推送
git add .
git commit -m "Fix: Move travel guides data into project"
git push
```

Vercel会自动重新部署!

---

## 📝 其他注意事项

### 1. 图片资源

如果需要显示封面图,也需要复制:
```bash
xcopy /E /I ..\travel-guides\images public\images
```

### 2. 地图数据

确保 `src/data/locations.json` 包含足够的景点坐标

### 3. 高德地图Key

在Vercel配置环境变量:
```
NEXT_PUBLIC_AMAP_KEY=a0bec27f2df79f2a3684013ebfe42961
```

并在高德控制台添加域名白名单:
- `*.vercel.app`
- 你的自定义域名

---

## ✅ 验证部署

部署成功后,访问你的网站检查:

- [ ] 首页显示攻略列表
- [ ] 攻略数量正确(40+个)
- [ ] 点击卡片可以查看详情
- [ ] 地图正常显示
- [ ] 移动端适配正常

---

## 🆘 如果还有问题

1. **查看Vercel构建日志**
2. **检查浏览器Console错误**
3. **确认环境变量配置**
4. **清除Vercel缓存重新部署**

---

**现在去执行方案A,5分钟搞定!** 🚀
