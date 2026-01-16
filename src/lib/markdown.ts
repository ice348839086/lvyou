import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { Guide, GuideMetadata } from '@/types/guide';

// 攻略数据目录
const guidesDirectory = path.join(process.cwd(), 'public', 'guides');

/**
 * 获取所有城市的slug列表
 */
export function getAllCitySlugs(): string[] {
  try {
    const cities = fs.readdirSync(guidesDirectory);
    // 只返回包含.md文件的目录
    return cities.filter((city) => {
      const cityPath = path.join(guidesDirectory, city);
      if (!fs.statSync(cityPath).isDirectory()) return false;
      
      const files = fs.readdirSync(cityPath);
      return files.some((file) => file.endsWith('.md'));
    });
  } catch (error) {
    console.error('Error reading guides directory:', error);
    return [];
  }
}

/**
 * 根据城市slug获取攻略数据
 */
export function getGuideBySlug(slug: string): Guide | null {
  try {
    const cityPath = path.join(guidesDirectory, slug);
    
    if (!fs.existsSync(cityPath)) {
      return null;
    }

    // 查找该城市目录下的第一个.md文件
    const files = fs.readdirSync(cityPath);
    const mdFile = files.find((file) => file.endsWith('.md'));

    if (!mdFile) {
      return null;
    }

    const fullPath = path.join(cityPath, mdFile);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // 使用gray-matter解析frontmatter
    const { data, content } = matter(fileContents);

    // 如果没有frontmatter,从内容中提取标题和基本信息
    const metadata: GuideMetadata = {
      city: data.city || slug,
      title: data.title || extractTitleFromContent(content),
      days: data.days || extractDaysFromContent(content),
      nights: data.nights || (data.days ? data.days - 1 : 0),
      theme: data.theme || '旅游攻略',
      region: data.region || guessRegion(slug),
      tags: data.tags || [],
      budget: data.budget || null,
      season: data.season || null,
      cover: data.cover || `/images/${slug}-guide.png`,
      rating: data.rating || 4.5,
    };

    return {
      slug,
      metadata,
      content,
    };
  } catch (error) {
    console.error(`Error reading guide for ${slug}:`, error);
    return null;
  }
}

/**
 * 获取所有攻略数据(用于首页列表)
 */
export function getAllGuides(): Guide[] {
  const slugs = getAllCitySlugs();
  const guides = slugs
    .map((slug) => getGuideBySlug(slug))
    .filter((guide): guide is Guide => guide !== null)
    .sort((a, b) => (b.metadata.rating || 0) - (a.metadata.rating || 0));

  return guides;
}

/**
 * 从Markdown内容中提取标题
 */
function extractTitleFromContent(content: string): string {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : '旅游攻略';
}

/**
 * 从内容中提取天数信息
 */
function extractDaysFromContent(content: string): number {
  const match = content.match(/(\d+)天/);
  return match ? parseInt(match[1], 10) : 3;
}

/**
 * 根据城市名猜测地区
 */
function guessRegion(slug: string): string {
  const regionMap: { [key: string]: string } = {
    beijing: '华北',
    shanghai: '华东',
    chengdu: '西南',
    xian: '西北',
    xiamen: '华南',
    chongqing: '西南',
    hangzhou: '华东',
    sanya: '华南',
    yunnan: '西南',
    qingdao: '华东',
    guilin: '华南',
    zhangjiajie: '华中',
    suzhou: '华东',
    nanjing: '华东',
    yangzhou: '华东',
    wuxi: '华东',
    huangshan: '华东',
    wuzhen: '华东',
    zhouzhuang: '华东',
    xitang: '华东',
    nanxun: '华东',
    tongli: '华东',
    jinxi: '华东',
    anchang: '华东',
    zhujiajiao: '华东',
  };

  return regionMap[slug] || '其他';
}

/**
 * 搜索攻略(支持标题、城市、标签搜索)
 */
export function searchGuides(query: string): Guide[] {
  const allGuides = getAllGuides();
  const lowerQuery = query.toLowerCase();

  return allGuides.filter((guide) => {
    return (
      guide.metadata.title.toLowerCase().includes(lowerQuery) ||
      guide.metadata.city.toLowerCase().includes(lowerQuery) ||
      guide.metadata.theme.toLowerCase().includes(lowerQuery) ||
      guide.metadata.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
  });
}
