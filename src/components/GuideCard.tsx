import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Guide } from '@/types/guide';
import { generateGradientBackground } from '@/lib/unsplash';

interface GuideCardProps {
  guide: Guide;
}

// 本地存储缓存键
const CACHE_KEY_PREFIX = 'unsplash_img_';
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7天

export default function GuideCard({ guide }: GuideCardProps) {
  const { slug, metadata } = guide;
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // 如果 cover 以 "unsplash:" 开头，动态获取图片
    if (metadata.cover.startsWith('unsplash:')) {
      const cityName = metadata.cover.replace('unsplash:', '');
      
      // 检查 localStorage 缓存
      const cacheKey = CACHE_KEY_PREFIX + cityName;
      try {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const { url, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_DURATION) {
            setImageUrl(url);
            return;
          }
        }
      } catch (error) {
        console.error('Cache read error:', error);
      }

      // 从 API 获取图片（带速率限制处理）
      setIsLoading(true);
      fetch(`/api/unsplash?city=${encodeURIComponent(cityName)}`)
        .then((res) => {
          if (res.status === 429) {
            // 速率限制：静默失败，使用渐变背景
            console.warn(`⚠️ API rate limit reached for ${cityName}, using gradient`);
            setImageError(true);
            return null;
          }
          if (!res.ok) {
            throw new Error(`API error: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          if (data?.url) {
            setImageUrl(data.url);
            // 缓存到 localStorage
            try {
              localStorage.setItem(
                cacheKey,
                JSON.stringify({ url: data.url, timestamp: Date.now() })
              );
            } catch (error) {
              console.error('Cache write error:', error);
            }
          } else if (data !== null) {
            setImageError(true);
          }
        })
        .catch((error) => {
          console.error(`Failed to fetch image for ${cityName}:`, error);
          setImageError(true);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setImageUrl(metadata.cover);
    }
  }, [metadata.cover]);

  const gradientClass = generateGradientBackground(slug);

  return (
    <Link
      href={`/guides/${slug}`}
      className="group block bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
    >
      {/* 封面图 */}
      <div className={`relative h-48 bg-gradient-to-br ${gradientClass} overflow-hidden`}>
        {imageUrl && !imageError && (
          <Image
            src={imageUrl}
            alt={metadata.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => {
              setImageError(true);
            }}
          />
        )}
        {/* 渐变背景装饰（当没有图片时） */}
        {(imageError || (!imageUrl && !isLoading)) && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white/90 text-6xl font-bold opacity-20">
              {metadata.title.substring(0, 2)}
            </div>
          </div>
        )}
        {/* 加载动画 */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/10">
            <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        )}
        {/* 渐变遮罩 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        {/* 天数标签 */}
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg">
          {metadata.days}天{metadata.nights}夜
        </div>
      </div>

      {/* 内容区 */}
      <div className="p-5">
        {/* 标题 */}
        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-3">
          {metadata.title}
        </h3>

        {/* 标签 */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="inline-flex items-center px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-100">
            📍 {metadata.region}
          </span>
          <span className="inline-flex items-center px-2.5 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full border border-purple-100">
            🎯 {metadata.theme}
          </span>
          {metadata.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2.5 py-1 bg-gray-50 text-gray-700 text-xs font-medium rounded-full border border-gray-200"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* 底部信息 */}
        <div className="flex items-center justify-between text-sm">
          {/* 评分 */}
          <div className="flex items-center gap-1.5">
            <svg
              className="w-5 h-5 text-yellow-400 fill-current"
              viewBox="0 0 20 20"
            >
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
            <span className="font-semibold text-gray-900">{metadata.rating?.toFixed(1)}</span>
          </div>

          {/* 预算 */}
          {metadata.budget && (
            <div className="flex items-center gap-1 text-gray-600 font-medium">
              <span className="text-orange-500">💰</span>
              ¥{metadata.budget}起
            </div>
          )}

          {/* 季节 */}
          {metadata.season && (
            <div className="flex items-center gap-1 text-gray-600">
              <span>🌤️</span>
              {metadata.season}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
