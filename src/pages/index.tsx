import { useState, useMemo } from 'react';
import type { GetStaticProps } from 'next';
import Head from 'next/head';
import GuideCard from '@/components/GuideCard';
import FilterBar from '@/components/FilterBar';
import { getAllGuides } from '@/lib/markdown';
import type { Guide, FilterOptions } from '@/types/guide';

interface HomeProps {
  guides: Guide[];
}

export default function Home({ guides }: HomeProps) {
  const [filters, setFilters] = useState<FilterOptions>({});

  // 筛选逻辑
  const filteredGuides = useMemo(() => {
    return guides.filter((guide) => {
      // 搜索筛选
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          guide.metadata.title.toLowerCase().includes(searchLower) ||
          guide.metadata.city.toLowerCase().includes(searchLower) ||
          guide.metadata.theme.toLowerCase().includes(searchLower) ||
          guide.metadata.tags.some((tag) =>
            tag.toLowerCase().includes(searchLower)
          );

        if (!matchesSearch) return false;
      }

      // 地区筛选
      if (filters.region && guide.metadata.region !== filters.region) {
        return false;
      }

      // 天数筛选
      if (filters.days) {
        const days = guide.metadata.days;
        if (filters.days === '1-2' && (days < 1 || days > 2)) return false;
        if (filters.days === '3' && days !== 3) return false;
        if (filters.days === '4-5' && (days < 4 || days > 5)) return false;
        if (filters.days === '5+' && days < 5) return false;
      }

      // 主题筛选
      if (filters.theme) {
        const matchesTheme =
          guide.metadata.theme.includes(filters.theme) ||
          guide.metadata.tags.some((tag) => tag.includes(filters.theme!));

        if (!matchesTheme) return false;
      }

      return true;
    });
  }, [guides, filters]);

  return (
    <>
      <Head>
        <title>智旅 - 旅游攻略网站</title>
        <meta
          name="description"
          content="基于AI整理的精品旅游攻略,覆盖全国40+热门目的地,提供详细行程规划、景点推荐、美食攻略"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        {/* 头部 */}
        <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white relative overflow-hidden">
          {/* 装饰性背景 */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          </div>
          <div className="container mx-auto px-4 py-16 relative z-10">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
              🗺️ 智旅攻略
            </h1>
            <p className="text-lg md:text-xl text-blue-50 font-medium">
              精选 <span className="text-yellow-300 font-bold">{guides.length}</span> 个热门目的地 · 详细行程规划 · 智能路线推荐
            </p>
          </div>
        </header>

        {/* 内容区 */}
        <div className="container mx-auto px-4 py-10">
          {/* 筛选栏 */}
          <div className="mb-8">
            <FilterBar onFilterChange={setFilters} />
          </div>

          {/* 结果统计 */}
          <div className="mb-8">
            <p className="text-gray-700 text-lg">
              找到 <span className="font-bold text-blue-600 text-xl">{filteredGuides.length}</span> 个精选攻略
            </p>
          </div>

          {/* 攻略卡片网格 */}
          {filteredGuides.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredGuides.map((guide) => (
                <GuideCard key={guide.slug} guide={guide} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl shadow-lg">
              <div className="mb-6">
                <svg
                  className="mx-auto h-20 w-20 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                😢 没有找到匹配的攻略
              </h3>
              <p className="text-gray-600 text-lg">
                试试调整筛选条件或搜索其他关键词
              </p>
            </div>
          )}
        </div>

        {/* 页脚 */}
        <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white mt-20">
          <div className="container mx-auto px-4 py-10 text-center">
            <p className="text-gray-300 text-sm font-medium">
              © 2026 智旅攻略 · 基于小红书MCP自动抓取 + AI整理
            </p>
            <p className="text-gray-500 text-xs mt-2">
              让每一次旅行都成为美好回忆 ✨
            </p>
          </div>
        </footer>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const guides = getAllGuides();

  return {
    props: {
      guides,
    },
  };
};
