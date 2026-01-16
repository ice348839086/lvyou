import locationsData from '@/data/locations.json';
import type { Location, CityLocations } from '@/types/guide';

// 类型断言
const locations = locationsData as CityLocations;

/**
 * 获取指定城市的所有景点位置
 */
export function getCityLocations(citySlug: string): Record<string, Location> {
  return locations[citySlug] || {};
}

/**
 * 获取指定城市的景点列表
 */
export function getCityLocationsList(citySlug: string): Location[] {
  const cityLocations = getCityLocations(citySlug);
  return Object.entries(cityLocations).map(([name, location]) => ({
    name,
    ...location,
  }));
}

/**
 * 根据景点名称获取位置信息
 */
export function getLocationByName(
  citySlug: string,
  locationName: string
): Location | null {
  const cityLocations = getCityLocations(citySlug);
  const location = cityLocations[locationName];

  if (!location) {
    return null;
  }

  return {
    name: locationName,
    ...location,
  };
}

/**
 * 计算两个坐标点之间的距离(km)
 * 使用Haversine公式
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // 地球半径(km)
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 10) / 10; // 保留一位小数
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * 获取城市中心点坐标(所有景点的平均位置)
 */
export function getCityCenter(citySlug: string): { lat: number; lng: number } | null {
  const locationsList = getCityLocationsList(citySlug);

  if (locationsList.length === 0) {
    return null;
  }

  const sum = locationsList.reduce(
    (acc, loc) => ({
      lat: acc.lat + loc.lat,
      lng: acc.lng + loc.lng,
    }),
    { lat: 0, lng: 0 }
  );

  return {
    lat: sum.lat / locationsList.length,
    lng: sum.lng / locationsList.length,
  };
}
