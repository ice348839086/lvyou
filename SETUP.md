# 项目设置指南

## ⚠️ 重要提示

当前系统Node.js版本为 **18.17.0**,但Next.js 16要求 **Node.js >= 20.9.0**

## 解决方案

### 方案1: 升级Node.js (推荐)

1. 访问 [Node.js官网](https://nodejs.org/)
2. 下载并安装 Node.js 20 LTS版本
3. 重新运行项目

### 方案2: 使用nvm管理Node版本

```bash
# 安装nvm-windows
# 下载: https://github.com/coreybutler/nvm-windows/releases

# 安装Node 20
nvm install 20
nvm use 20

# 验证版本
node -v  # 应显示 v20.x.x
```

### 方案3: 降级Next.js版本 (不推荐)

如果无法升级Node,可以降级Next.js到13.x版本:

```bash
cd c:\code\linglong\travel-guides-web
npm install next@13 react@18 react-dom@18 --save
npm install @types/react@18 @types/react-dom@18 --save-dev
```

## 启动项目

升级Node版本后:

```bash
cd c:\code\linglong\travel-guides-web
npm install  # 重新安装依赖
npm run dev  # 启动开发服务器
```

访问: http://localhost:3000

## 构建生产版本

```bash
npm run build
npm start
```

## 常见问题

### Q: 依赖安装失败
A: 删除 `node_modules` 和 `package-lock.json`,重新运行 `npm install`

### Q: 地图不显示
A: 检查 `.env.local` 中的高德地图Key是否正确

### Q: 找不到攻略数据
A: 确保 `../travel-guides/guides/` 目录存在且包含Markdown文件

### Q: 图片不显示
A: 图片路径应为 `/images/xxx.png`,放在 `public/images/` 目录下

## 开发建议

1. **使用VSCode** - 推荐安装插件:
   - ESLint
   - Prettier
   - Tailwind CSS IntelliSense

2. **代码格式化**:
   ```bash
   npm run lint
   ```

3. **类型检查**:
   ```bash
   npx tsc --noEmit
   ```

## 部署

### Vercel (推荐)

1. 推送代码到GitHub
2. 导入到Vercel
3. 配置环境变量 `NEXT_PUBLIC_AMAP_KEY`
4. 自动部署

### 其他平台

确保Node版本 >= 20.9.0,然后:

```bash
npm run build
```

部署 `.next` 目录和 `package.json`
