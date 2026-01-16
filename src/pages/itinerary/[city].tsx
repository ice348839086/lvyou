import { useState } from 'react';
import type { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import Timeline from '@/components/Timeline';
import { getAllCitySlugs, getGuideBySlug } from '@/lib/markdown';
import { getCityLocationsList } from '@/lib/locations';
import type { Guide, DayItinerary, Location } from '@/types/guide';

// 动态导入地图组件(避免SSR问题)
const MapView = dynamic(() => import('@/components/MapView'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  ),
});

interface ItineraryPageProps {
  guide: Guide;
  locations: Location[];
  itinerary: DayItinerary[];
}

export default function ItineraryPage({
  guide,
  locations,
  itinerary,
}: ItineraryPageProps) {
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  if (router.isFallback) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const handleLocationClick = (locationName: string) => {
    setSelectedLocation(locationName);
    // 滚动到地图区域
    document.getElementById('map-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleMarkerClick = (location: Location) => {
    setSelectedLocation(location.name);
    // 滚动到时间轴对应位置
    document.getElementById('timeline-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Head>
        <title>{guide.metadata.title} - 行程地图 - 智旅攻略</title>
        <meta
          name="description"
          content={`${guide.metadata.title}详细行程规划和地图路线`}
        />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        {/* 顶部导航 */}
        <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link
                href={`/guides/${guide.slug}`}
                className="flex items-center text-blue-600 hover:text-blue-800 font-semibold transition-colors"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                返回攻略详情
              </Link>

              <Link
                href="/"
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                🏠 首页
              </Link>
            </div>
          </div>
        </nav>

        {/* 头部 */}
        <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/3 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          </div>
          <div className="container mx-auto px-4 py-12 relative z-10">
            <h1 className="text-2xl md:text-4xl font-bold mb-3">
              🗺️ {guide.metadata.title}
            </h1>
            <p className="text-blue-50 text-lg font-medium">
              行程总览 · 时间轴 + 地图双视图
            </p>
          </div>
        </header>

        {/* 内容区 - 双视图布局 */}
        <div className="container mx-auto px-4 py-10">
          {/* 桌面端:左右分栏 | 移动端:上下堆叠 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 左侧:时间轴 */}
            <div id="timeline-section" className="order-2 lg:order-1">
              <div className="sticky top-20">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span className="text-3xl">📅</span>
                  <span>行程时间轴</span>
                </h2>
                {itinerary.length > 0 ? (
                  <div className="max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
                    <Timeline
                      itinerary={itinerary}
                      onLocationClick={handleLocationClick}
                    />
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <p className="text-gray-500">
                      暂无详细行程数据,请查看攻略详情页
                    </p>
                    <Link
                      href={`/guides/${guide.slug}`}
                      className="inline-block mt-4 text-blue-600 hover:text-blue-800"
                    >
                      查看攻略详情 →
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* 右侧:地图 */}
            <div id="map-section" className="order-1 lg:order-2">
              <div className="sticky top-20">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span className="text-3xl">🗺️</span>
                  <span>路线地图</span>
                </h2>
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                  {locations.length > 0 ? (
                    <div className="h-[500px] lg:h-[calc(100vh-200px)]">
                      <MapView
                        locations={locations}
                        onMarkerClick={handleMarkerClick}
                      />
                    </div>
                  ) : (
                    <div className="h-[400px] flex items-center justify-center">
                      <div className="text-center">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400 mb-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                          />
                        </svg>
                        <p className="text-gray-500">
                          该城市暂无地图数据
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* 图例 */}
                {locations.length > 0 && (
                  <div className="mt-6 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-5 border border-gray-100">
                    <h3 className="text-base font-bold text-gray-800 mb-4">
                      📌 图例说明
                    </h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-xl border border-blue-100">
                        <span className="text-xl">🏛️</span>
                        <span className="text-gray-700 font-medium">景点</span>
                      </div>
                      <div className="flex items-center gap-2 bg-orange-50 px-3 py-2 rounded-xl border border-orange-100">
                        <span className="text-xl">🍜</span>
                        <span className="text-gray-700 font-medium">餐厅</span>
                      </div>
                      <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-xl border border-green-100">
                        <span className="text-xl">🏨</span>
                        <span className="text-gray-700 font-medium">酒店</span>
                      </div>
                      <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-200">
                        <span className="text-xl">🚕</span>
                        <span className="text-gray-700 font-medium">交通</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
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

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = getAllCitySlugs();

  return {
    paths: slugs.map((slug) => ({
      params: { city: slug },
    })),
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps<ItineraryPageProps> = async ({
  params,
}) => {
  const slug = params?.city as string;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    return {
      notFound: true,
    };
  }

  // 获取城市景点位置数据
  const locations = getCityLocationsList(slug);

  // 解析行程数据(简化版,实际应从Markdown内容中提取)
  const itinerary: DayItinerary[] = parseItineraryFromContent(
    guide.content,
    guide.metadata.days
  );

  return {
    props: {
      guide,
      locations,
      itinerary,
    },
  };
};

// 从Markdown内容中解析行程(改进版)
function parseItineraryFromContent(
  content: string,
  totalDays: number
): DayItinerary[] {
  const days: DayItinerary[] = [];

  // 匹配 "### Day X" 格式的标题,更宽松的匹配
  const dayPattern = /###\s*Day\s*(\d+)[^#\n]*\n+(.*?)(?=###\s*Day|##\s|$)/gis;
  const dayMatches = Array.from(content.matchAll(dayPattern));

  for (const match of dayMatches) {
    const dayNumber = parseInt(match[1], 10);
    const dayContent = match[2];

    // 提取主题 - 支持多种格式
    let theme = `第${dayNumber}天`;
    const themeMatch = dayContent.match(/\*\*主题[：:]\s*(.+?)\*\*/i);
    if (themeMatch) {
      theme = themeMatch[1].trim();
    } else {
      // 尝试从标题中提取
      const titleMatch = dayContent.match(/^[：:]\s*(.+?)$/m);
      if (titleMatch) {
        theme = titleMatch[1].trim();
      }
    }

    // 提取日期
    const dateMatch = dayContent.match(/（(.+?)\s+星期.）/);
    const date = dateMatch ? dateMatch[1] : null;

    // 提取表格中的行程项
    const items = parseItineraryItems(dayContent);

    if (items.length > 0) {
      days.push({
        day: dayNumber,
        date,
        theme,
        items,
      });
    }
  }

  // 如果没有解析到数据,生成默认数据
  if (days.length === 0) {
    for (let i = 1; i <= Math.min(totalDays, 5); i++) {
      days.push({
        day: i,
        date: null,
        theme: `第${i}天`,
        items: [
          {
            time: '09:00',
            type: 'attraction',
            title: '暂无详细行程数据',
            description: '请查看攻略详情页了解完整行程安排',
            location: null,
            tips: null,
            icon: null,
          },
        ],
      });
    }
  }

  return days;
}

// 解析行程项(从表格中) - 改进版
function parseItineraryItems(dayContent: string): any[] {
  const items: any[] = [];
  
  // 匹配表格行 - 支持3列表格
  const tablePattern = /\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|(?:\s*([^|]+?)\s*\|)?/g;
  const tableRows = Array.from(dayContent.matchAll(tablePattern));

  for (const row of tableRows) {
    const time = row[1]?.trim() || '';
    const activity = row[2]?.trim() || '';
    const tips = row[3]?.trim() || '';

    // 跳过表头和分隔线
    if (
      time === '时间' ||
      activity === '行程' ||
      time.includes('---') ||
      activity.includes('---') ||
      !time ||
      !activity
    ) {
      continue;
    }

    // 判断类型
    let type: 'attraction' | 'meal' | 'transport' | 'hotel' = 'attraction';
    const combinedText = activity + tips;
    
    if (
      combinedText.includes('早餐') ||
      combinedText.includes('午餐') ||
      combinedText.includes('晚餐') ||
      combinedText.includes('餐厅')
    ) {
      type = 'meal';
    } else if (
      combinedText.includes('前往') ||
      combinedText.includes('返回') ||
      combinedText.includes('出发') ||
      combinedText.includes('回酒店')
    ) {
      type = 'transport';
    } else if (
      combinedText.includes('酒店') ||
      combinedText.includes('入住') ||
      combinedText.includes('休息')
    ) {
      type = 'hotel';
    }

    // 提取提示标签
    const tipsList: string[] = [];
    if (tips) {
      tipsList.push(tips);
    }

    items.push({
      time,
      type,
      title: activity,
      description: tips || null,
      location: null,
      tips: tipsList.length > 0 ? tipsList : null,
      icon: null,
    });
  }

  return items;
}
