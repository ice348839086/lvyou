import type { NextApiRequest, NextApiResponse } from 'next';

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

// 服务端缓存（在 serverless 环境中会在一段时间内保持）
const serverCache = new Map<string, { url: string; timestamp: number }>();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24小时

// 城市英文名映射
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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // 只允许 GET 请求
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { city } = req.query;

  if (!city || typeof city !== 'string') {
    return res.status(400).json({ error: 'City parameter is required' });
  }

  // 检查服务端缓存
  const cached = serverCache.get(city);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return res.status(200).json({ url: cached.url, cached: true });
  }

  // 检查 API key
  const accessKey = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;
  if (!accessKey) {
    console.error('Unsplash Access Key not configured');
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    // 获取英文名
    const englishName = cityEnglishNames[city] || city;

    // 多策略搜索
    const searchQueries = [
      `${englishName} China landmark`,
      `${englishName} China travel`,
      `${city} China scenic`,
      `${englishName} cityscape`,
      `${englishName} architecture`,
      `China ${englishName}`,
    ];

    for (const query of searchQueries) {
      try {
        const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
          query
        )}&per_page=1&orientation=landscape&client_id=${accessKey}`;

        const response = await fetch(url, {
          headers: {
            'Accept-Version': 'v1',
          },
        });

        if (!response.ok) {
          if (response.status === 403) {
            console.warn('Unsplash API rate limit reached');
            return res.status(429).json({ 
              error: 'Rate limit reached', 
              message: 'Please try again later' 
            });
          }
          continue;
        }

        const data: UnsplashSearchResponse = await response.json();

        if (data.results.length > 0) {
          const imageUrl = data.results[0].urls.regular;

          // 缓存结果
          serverCache.set(city, { url: imageUrl, timestamp: Date.now() });

          console.log(`✅ Found image for ${city} using: "${query}"`);
          return res.status(200).json({ url: imageUrl, query });
        }
      } catch (error) {
        console.error(`Error with query "${query}":`, error);
        continue;
      }
    }

    // 所有策略都失败
    console.warn(`❌ No images found for ${city}`);
    return res.status(404).json({ error: 'No images found' });
  } catch (error) {
    console.error('Unsplash API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
