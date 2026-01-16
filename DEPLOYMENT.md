# 🚀 部署指南

## ✅ GitHub仓库已创建

**仓库地址**: https://github.com/ice348839086/lvyou

代码已成功推送到GitHub!

## 🌐 国内可访问的部署平台推荐

### 方案1: Vercel (推荐) ⭐⭐⭐⭐⭐

**优点**:
- ✅ 国内可访问(虽然有时会慢)
- ✅ 自动部署,推送代码即更新
- ✅ 免费额度充足
- ✅ 完美支持Next.js
- ✅ 自动HTTPS
- ✅ 全球CDN加速

**部署步骤**:

1. **访问Vercel**: https://vercel.com
2. **使用GitHub登录**
3. **导入项目**:
   - 点击 "New Project"
   - 选择 `ice348839086/lvyou` 仓库
   - 点击 "Import"

4. **配置环境变量**:
   ```
   NEXT_PUBLIC_AMAP_KEY=a0bec27f2df79f2a3684013ebfe42961
   ```

5. **部署设置**:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

6. **点击Deploy**,等待3-5分钟

7. **获得网址**: `https://lvyou-xxx.vercel.app`

**注意**: 
- Vercel在国内访问可能较慢
- 可以绑定自定义域名

---

### 方案2: Netlify ⭐⭐⭐⭐

**优点**:
- ✅ 国内可访问
- ✅ 自动部署
- ✅ 免费额度充足
- ✅ 支持Next.js

**部署步骤**:

1. **访问Netlify**: https://netlify.com
2. **使用GitHub登录**
3. **导入项目**: 选择 `ice348839086/lvyou`
4. **构建设置**:
   ```
   Build command: npm run build
   Publish directory: .next
   ```
5. **环境变量**:
   ```
   NEXT_PUBLIC_AMAP_KEY=a0bec27f2a3684013ebfe42961
   ```
6. **Deploy**

---

### 方案3: 阿里云/腾讯云 (国内最佳) ⭐⭐⭐⭐⭐

**优点**:
- ✅ 国内访问速度快
- ✅ 稳定可靠
- ✅ 完全可控

**缺点**:
- ❌ 需要备案
- ❌ 需要付费(最低配置约¥100/年)
- ❌ 配置相对复杂

**部署步骤**:

1. **购买服务器**: 阿里云ECS或腾讯云轻量应用服务器
2. **安装Node.js 24+**
3. **克隆代码**:
   ```bash
   git clone https://github.com/ice348839086/lvyou.git
   cd lvyou
   ```
4. **安装依赖**:
   ```bash
   npm install
   ```
5. **配置环境变量**:
   ```bash
   echo "NEXT_PUBLIC_AMAP_KEY=a0bec27f2df79f2a3684013ebfe42961" > .env.local
   ```
6. **构建**:
   ```bash
   npm run build
   ```
7. **使用PM2运行**:
   ```bash
   npm install -g pm2
   pm2 start npm --name "lvyou" -- start
   pm2 save
   pm2 startup
   ```
8. **配置Nginx反向代理**
9. **配置域名和SSL证书**

---

### 方案4: Cloudflare Pages ⭐⭐⭐⭐

**优点**:
- ✅ 国内部分地区可访问
- ✅ 免费
- ✅ 全球CDN
- ✅ 自动部署

**部署步骤**:

1. **访问**: https://pages.cloudflare.com
2. **连接GitHub**: 选择 `ice348839086/lvyou`
3. **构建配置**:
   ```
   Framework: Next.js
   Build command: npm run build
   Build output: .next
   ```
4. **环境变量**:
   ```
   NEXT_PUBLIC_AMAP_KEY=a0bec27f2a3684013ebfe42961
   ```
5. **Deploy**

---

### 方案5: Railway ⭐⭐⭐

**优点**:
- ✅ 简单易用
- ✅ 自动部署
- ✅ 免费额度

**缺点**:
- ❌ 国内访问可能不稳定

**部署步骤**:

1. **访问**: https://railway.app
2. **GitHub登录**
3. **New Project** → **Deploy from GitHub repo**
4. **选择**: `ice348839086/lvyou`
5. **添加环境变量**:
   ```
   NEXT_PUBLIC_AMAP_KEY=a0bec27f2a3684013ebfe42961
   ```
6. **自动部署**

---

## 📋 部署前检查清单

### 1. 环境变量配置

确保在部署平台配置以下环境变量:

```env
NEXT_PUBLIC_AMAP_KEY=a0bec27f2a3684013ebfe42961
```

### 2. 高德地图Key配置

**重要**: 需要在高德开放平台配置域名白名单!

1. 访问: https://console.amap.com/dev/key/app
2. 找到你的Key
3. 添加域名白名单:
   - Vercel: `*.vercel.app`
   - Netlify: `*.netlify.app`
   - 自定义域名: `yourdomain.com`

### 3. 数据文件

确保 `../travel-guides/guides/` 目录存在且包含攻略文件。

**解决方案**:
- 方案A: 将 `travel-guides` 目录也推送到GitHub
- 方案B: 在构建时从其他地方拉取数据
- 方案C: 将攻略数据移到项目内部

### 4. 图片资源

如果需要显示封面图,需要:
- 将图片放在 `public/images/` 目录
- 或使用在线图片服务

---

## 🎯 推荐部署方案

### 快速体验 (5分钟)
→ **Vercel** (最简单,自动部署)

### 国内访问最佳
→ **阿里云/腾讯云** (需要备案,但速度快)

### 免费且稳定
→ **Vercel + Cloudflare CDN** (组合使用)

---

## 🔧 部署后优化

### 1. 绑定自定义域名

在Vercel/Netlify中:
1. 进入项目设置
2. 添加自定义域名
3. 配置DNS记录

### 2. 配置CDN加速

使用Cloudflare CDN:
1. 域名接入Cloudflare
2. 开启CDN加速
3. 配置缓存规则

### 3. 性能优化

- 启用图片优化
- 配置静态资源缓存
- 开启Gzip压缩

---

## 📱 部署后测试

访问你的网站,测试:

- [ ] 首页加载正常
- [ ] 攻略列表显示
- [ ] 筛选功能工作
- [ ] 详情页可访问
- [ ] 地图正常显示
- [ ] 移动端适配正常

---

## 🆘 常见问题

### Q: 部署后地图不显示

**A**: 检查高德地图Key的域名白名单配置

### Q: 攻略数据为空

**A**: 确保 `travel-guides` 目录数据可访问

### Q: 国内访问很慢

**A**: 
1. 使用国内服务器(阿里云/腾讯云)
2. 或使用Cloudflare CDN加速

### Q: 构建失败

**A**: 检查:
1. Node版本是否 >= 20.9.0
2. 环境变量是否配置
3. 依赖是否安装完整

---

## 📞 获取帮助

- GitHub Issues: https://github.com/ice348839086/lvyou/issues
- 查看构建日志
- 检查浏览器Console错误

---

**祝部署顺利! 🎉**
