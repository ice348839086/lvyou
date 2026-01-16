import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  
  // 图片优化配置
  images: {
    domains: ['images.unsplash.com'], // 添加 Unsplash 域名
    formats: ['image/webp', 'image/avif'],
    unoptimized: true, // Vercel部署时图片优化
  },

  // 环境变量
  env: {
    NEXT_PUBLIC_AMAP_KEY: process.env.NEXT_PUBLIC_AMAP_KEY,
    NEXT_PUBLIC_UNSPLASH_ACCESS_KEY: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
  },
};

export default nextConfig;
