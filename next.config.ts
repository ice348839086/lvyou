import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  
  // 图片优化配置
  images: {
    domains: [],
    formats: ['image/webp', 'image/avif'],
    unoptimized: true, // Vercel部署时图片优化
  },

  // 环境变量
  env: {
    NEXT_PUBLIC_AMAP_KEY: process.env.NEXT_PUBLIC_AMAP_KEY,
  },
};

export default nextConfig;
