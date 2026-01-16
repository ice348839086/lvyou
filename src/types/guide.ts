// 攻略元数据类型定义
export interface GuideMetadata {
  city: string;
  title: string;
  days: number;
  nights: number;
  theme: string;
  region: string;
  tags: string[];
  budget: number | null;
  season: string | null;
  cover: string;
  rating: number;
}

// 完整攻略数据
export interface Guide {
  slug: string; // 城市slug (如 'beijing')
  metadata: GuideMetadata;
  content: string; // Markdown内容
}

// 景点位置信息
export interface Location {
  name: string;
  lat: number;
  lng: number;
  type: 'attraction' | 'restaurant' | 'hotel' | 'transport';
}

// 城市景点数据
export interface CityLocations {
  [citySlug: string]: {
    [locationName: string]: Location;
  };
}

// 行程时间点
export interface ItineraryItem {
  time: string;
  type: 'attraction' | 'meal' | 'transport' | 'hotel';
  title: string;
  description: string | null;
  location: string | null;
  tips: string[] | null;
  icon: string | null;
}

// 每日行程
export interface DayItinerary {
  day: number;
  date: string | null;
  theme: string;
  items: ItineraryItem[];
}

// 筛选选项
export interface FilterOptions {
  region?: string;
  days?: string;
  theme?: string;
  search?: string;
}
