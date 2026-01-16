/**
 * Unsplash API 集成
 * 用于获取城市相关的高质量图片
 */

interface UnsplashPhoto {
  id: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  user: {
    name: string;
    username: string;
  };
  links: {
    html: string;
  };
}

interface UnsplashSearchResponse {
  results: UnsplashPhoto[];
  total: number;
  total_pages: number;
}

// 图片缓存（内存缓存，避免重复请求）
const imageCache = new Map<string, string>();

/**
 * 从 Unsplash 搜索城市图片
 */
export async function searchCityImage(
  cityName: string,
  accessKey?: string
): Promise<string | null> {
  // 检查缓存
  if (imageCache.has(cityName)) {
    return imageCache.get(cityName)!;
  }

  // 如果没有提供 access key，返回 null
  const key = accessKey || process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;
  if (!key) {
    console.warn('Unsplash Access Key not configured');
    return null;
  }

  try {
    // 构建搜索查询（中文城市名 + travel/景点等关键词）
    const query = `${cityName} travel landscape china`;
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
      query
    )}&per_page=1&orientation=landscape&client_id=${key}`;

    const response = await fetch(url, {
      headers: {
        'Accept-Version': 'v1',
      },
    });

    if (!response.ok) {
      console.error(`Unsplash API error: ${response.status}`);
      return null;
    }

    const data: UnsplashSearchResponse = await response.json();

    if (data.results.length === 0) {
      console.warn(`No images found for ${cityName}`);
      return null;
    }

    // 获取第一张图片的 regular 尺寸 URL
    const imageUrl = data.results[0].urls.regular;

    // 缓存结果
    imageCache.set(cityName, imageUrl);

    return imageUrl;
  } catch (error) {
    console.error(`Failed to fetch image for ${cityName}:`, error);
    return null;
  }
}

/**
 * 获取城市封面图（带降级方案）
 */
export async function getCityCoverImage(
  cityName: string,
  citySlug: string
): Promise<string> {
  // 尝试从 Unsplash 获取
  const unsplashUrl = await searchCityImage(cityName);

  if (unsplashUrl) {
    return unsplashUrl;
  }

  // 降级方案1: 检查本地图片
  const localImagePath = `/images/${citySlug}-guide.png`;

  // 降级方案2: 返回本地路径（即使不存在，GuideCard 会显示渐变背景）
  return localImagePath;
}

/**
 * 批量获取城市图片（用于构建时预加载）
 */
export async function batchFetchCityImages(
  cities: Array<{ name: string; slug: string }>
): Promise<Map<string, string>> {
  const results = new Map<string, string>();

  // 限制并发请求数量（Unsplash 免费版有速率限制）
  const batchSize = 5;
  for (let i = 0; i < cities.length; i += batchSize) {
    const batch = cities.slice(i, i + batchSize);
    const promises = batch.map(async (city) => {
      const imageUrl = await getCityCoverImage(city.name, city.slug);
      return { slug: city.slug, url: imageUrl };
    });

    const batchResults = await Promise.all(promises);
    batchResults.forEach(({ slug, url }) => {
      results.set(slug, url);
    });

    // 添加延迟，避免超过速率限制
    if (i + batchSize < cities.length) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  return results;
}

/**
 * 生成渐变背景（作为最终降级方案）
 */
export function generateGradientBackground(citySlug: string): string {
  // 基于城市名生成一致的渐变色
  const gradients = [
    'from-blue-400 to-purple-500',
    'from-green-400 to-blue-500',
    'from-purple-400 to-pink-500',
    'from-yellow-400 to-orange-500',
    'from-red-400 to-pink-500',
    'from-indigo-400 to-purple-500',
    'from-teal-400 to-green-500',
    'from-orange-400 to-red-500',
  ];

  // 使用城市 slug 的哈希值选择渐变
  const hash = citySlug.split('').reduce((acc, char) => {
    return acc + char.charCodeAt(0);
  }, 0);

  return gradients[hash % gradients.length];
}
