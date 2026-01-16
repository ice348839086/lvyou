import Link from 'next/link';
import Image from 'next/image';
import type { Guide } from '@/types/guide';

interface GuideCardProps {
  guide: Guide;
}

export default function GuideCard({ guide }: GuideCardProps) {
  const { slug, metadata } = guide;

  return (
    <Link
      href={`/guides/${slug}`}
      className="group block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
    >
      {/* 封面图 */}
      <div className="relative h-48 bg-gradient-to-br from-blue-400 to-purple-500">
        {metadata.cover && (
          <Image
            src={metadata.cover}
            alt={metadata.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={(e) => {
              // 图片加载失败时隐藏
              e.currentTarget.style.display = 'none';
            }}
          />
        )}
        {/* 天数标签 */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
          {metadata.days}天{metadata.nights}夜
        </div>
      </div>

      {/* 内容区 */}
      <div className="p-4">
        {/* 标题 */}
        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
          {metadata.title}
        </h3>

        {/* 标签 */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
            {metadata.region}
          </span>
          <span className="inline-block px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
            {metadata.theme}
          </span>
          {metadata.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* 底部信息 */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          {/* 评分 */}
          <div className="flex items-center gap-1">
            <svg
              className="w-4 h-4 text-yellow-400 fill-current"
              viewBox="0 0 20 20"
            >
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
            <span className="font-medium">{metadata.rating?.toFixed(1)}</span>
          </div>

          {/* 预算 */}
          {metadata.budget && (
            <div className="text-gray-500">
              ¥{metadata.budget}起
            </div>
          )}

          {/* 季节 */}
          {metadata.season && (
            <div className="text-gray-500">
              {metadata.season}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
