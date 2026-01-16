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

// 城市英文名映射（提高搜索成功率）
const cityEnglishNames: Record<string, string> = {
  '北京': 'Beijing',
  '上海': 'Shanghai',
  '杭州': 'Hangzhou',
  '苏州': 'Suzhou',
  '成都': 'Chengdu',
  '西安': 'Xian',
  '重庆': 'Chongqing',
  '厦门': 'Xiamen',
  '青岛': 'Qingdao',
  '南京': 'Nanjing',
  '三亚': 'Sanya',
  '桂林': 'Guilin',
  '张家界': 'Zhangjiajie',
  '黄山': 'Huangshan',
  '乌镇': 'Wuzhen',
  '周庄': 'Zhouzhuang',
  '西塘': 'Xitang',
  '云南': 'Yunnan',
  '无锡': 'Wuxi',
  '扬州': 'Yangzhou',
  '同里': 'Tongli',
  '南浔': 'Nanxun',
  '锦溪': 'Jinxi',
  '安昌': 'Anchang',
  '朱家角': 'Zhujiajiao',
  '莫干山': 'Moganshan',
  '千岛湖': 'Qiandao Lake',
  '安吉': 'Anji',
};

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
    // 获取英文名（如果有）
    const englishName = cityEnglishNames[cityName] || cityName;
    
    // 尝试多个搜索策略
    const searchQueries = [
      `${englishName} China travel`,          // 策略1: 英文名 + China
      `${cityName} China landscape`,          // 策略2: 中文名 + China
      `${englishName} scenic`,                // 策略3: 英文名 + scenic
      `${englishName} tourism`,               // 策略4: 英文名 + tourism
      `China landscape nature`,               // 策略5: 通用中国风景（最后备选）
    ];

    for (const query of searchQueries) {
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
        continue; // 尝试下一个查询
      }

      const data: UnsplashSearchResponse = await response.json();

      if (data.results.length > 0) {
        // 找到图片，使用第一张
        const imageUrl = data.results[0].urls.regular;
        
        // 缓存结果
        imageCache.set(cityName, imageUrl);
        
        console.log(`✅ Found image for ${cityName} using query: "${query}"`);
        return imageUrl;
      }
    }

    // 所有策略都失败
    console.warn(`❌ No images found for ${cityName} after trying all strategies`);
    return null;
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
