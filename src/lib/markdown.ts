import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { Guide, GuideMetadata } from '@/types/guide';
import { generateGradientBackground } from './unsplash';

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
    const cityName = getCityDisplayName(slug);
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
      cover: data.cover || getCoverImageUrl(slug, cityName),
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

/**
 * 获取城市显示名称（中文）
 */
function getCityDisplayName(slug: string): string {
  const cityNames: { [key: string]: string } = {
    beijing: '北京',
    shanghai: '上海',
    chengdu: '成都',
    xian: '西安',
    xiamen: '厦门',
    chongqing: '重庆',
    hangzhou: '杭州',
    sanya: '三亚',
    yunnan: '云南',
    qingdao: '青岛',
    guilin: '桂林',
    zhangjiajie: '张家界',
    suzhou: '苏州',
    nanjing: '南京',
    yangzhou: '扬州',
    wuxi: '无锡',
    huangshan: '黄山',
    wuzhen: '乌镇',
    zhouzhuang: '周庄',
    xitang: '西塘',
    nanxun: '南浔',
    tongli: '同里',
    jinxi: '锦溪',
    anchang: '安昌',
    zhujiajiao: '朱家角',
    moganshan: '莫干山',
    qiandaohu: '千岛湖',
    anji: '安吉',
    tonglu: '桐庐',
    jiande: '建德',
    linan: '临安',
    xianju: '仙居',
    tiantai: '天台',
    jingning: '景宁',
    taishun: '泰顺',
    songyang: '松阳',
    ninghai: '宁海',
    xiangshan: '象山',
    yuyao: '余姚',
    suchang: '苏场',
    yongjia: '永嘉',
    fenghua: '奉化',
    linhai: '临海',
    wengling: '温岭',
    wenheng: '文成',
    yiwu: '义乌',
    zhuji: '诸暨',
  };

  return cityNames[slug] || slug;
}

/**
 * 获取封面图URL（支持Unsplash或本地图片）
 */
function getCoverImageUrl(slug: string, cityName: string): string {
  // 优先使用本地图片
  const localImagePath = `/images/${slug}-guide.png`;
  const localImageFullPath = path.join(process.cwd(), 'public', 'images', `${slug}-guide.png`);
  
  if (fs.existsSync(localImageFullPath)) {
    return localImagePath;
  }

  // 如果配置了 Unsplash，使用 Unsplash API
  // 注意：这里返回一个特殊格式，前端会处理
  if (process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY) {
    return `unsplash:${cityName}`;
  }

  // 降级方案：返回本地路径（即使不存在，前端会显示渐变背景）
  return localImagePath;
}
