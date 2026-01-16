import type { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { getAllCitySlugs, getGuideBySlug } from '@/lib/markdown';
import type { Guide } from '@/types/guide';

interface GuideDetailProps {
  guide: Guide;
}

export default function GuideDetail({ guide }: GuideDetailProps) {
  const router = useRouter();

  if (router.isFallback) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const { metadata, content } = guide;

  return (
    <>
      <Head>
        <title>{metadata.title} - 智旅攻略</title>
        <meta name="description" content={`${metadata.title} - ${metadata.theme}`} />
        <meta name="keywords" content={metadata.tags.join(', ')} />
      </Head>

      <main className="min-h-screen bg-gray-50">
        {/* 顶部导航 */}
        <nav className="bg-white shadow-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link
                href="/"
                className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
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
                返回首页
              </Link>

              <Link
                href={`/itinerary/${guide.slug}`}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                查看行程地图
              </Link>
            </div>
          </div>
        </nav>

        {/* 头部Banner */}
        <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {metadata.title}
              </h1>

              <div className="flex flex-wrap gap-3 mb-4">
                <span className="inline-flex items-center px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm">
                  📍 {metadata.region}
                </span>
                <span className="inline-flex items-center px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm">
                  📅 {metadata.days}天{metadata.nights}夜
                </span>
                <span className="inline-flex items-center px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm">
                  🎯 {metadata.theme}
                </span>
                {metadata.budget && (
                  <span className="inline-flex items-center px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm">
                    💰 ¥{metadata.budget}起
                  </span>
                )}
                {metadata.season && (
                  <span className="inline-flex items-center px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm">
                    🌤️ {metadata.season}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(metadata.rating || 0)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300 fill-current'
                      }`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm">{metadata.rating?.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </header>

        {/* 内容区 */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* 标签 */}
            {metadata.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {metadata.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Markdown内容 */}
            <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
              <MarkdownRenderer content={content} />
            </div>

            {/* 底部操作 */}
            <div className="mt-8 flex justify-center">
              <Link
                href={`/itinerary/${guide.slug}`}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium"
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
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
                查看行程地图
              </Link>
            </div>
          </div>
        </div>

        {/* 页脚 */}
        <footer className="bg-gray-800 text-white mt-16">
          <div className="container mx-auto px-4 py-8 text-center">
            <p className="text-gray-400">
              © 2026 智旅攻略 · 基于小红书MCP自动抓取 + AI整理
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

export const getStaticProps: GetStaticProps<GuideDetailProps> = async ({
  params,
}) => {
  const slug = params?.city as string;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      guide,
    },
  };
};
