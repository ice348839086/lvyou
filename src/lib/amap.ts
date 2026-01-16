import AMapLoader from '@amap/amap-jsapi-loader';

// 高德地图实例类型(简化版)
export interface AMapInstance {
  Map: any;
  Marker: any;
  Polyline: any;
  InfoWindow: any;
  plugin: (plugins: string[], callback: () => void) => void;
}

let amapInstance: AMapInstance | null = null;

/**
 * 加载高德地图JS API
 */
export async function loadAMap(): Promise<AMapInstance> {
  if (amapInstance) {
    return amapInstance;
  }

  try {
    const AMap = await AMapLoader.load({
      key: process.env.NEXT_PUBLIC_AMAP_KEY || '',
      version: '2.0',
      plugins: ['AMap.Scale', 'AMap.ToolBar', 'AMap.Driving', 'AMap.Walking'],
    });

    amapInstance = AMap;
    return AMap;
  } catch (error) {
    console.error('Failed to load AMap:', error);
    throw error;
  }
}

/**
 * 创建地图实例
 */
export async function createMap(
  container: string | HTMLElement,
  options: {
    center?: [number, number];
    zoom?: number;
  } = {}
): Promise<any> {
  const AMap = await loadAMap();

  const map = new AMap.Map(container, {
    zoom: options.zoom || 12,
    center: options.center || [116.397428, 39.90923],
    viewMode: '2D',
    mapStyle: 'amap://styles/normal',
  });

  return map;
}

/**
 * 添加标记点
 */
export async function addMarker(
  map: any,
  position: [number, number],
  options: {
    title?: string;
    content?: string;
    icon?: string;
  } = {}
): Promise<any> {
  const AMap = await loadAMap();

  const marker = new AMap.Marker({
    position,
    title: options.title || '',
    map,
  });

  // 如果有内容,添加点击事件显示信息窗体
  if (options.content) {
    const infoWindow = new AMap.InfoWindow({
      content: options.content,
      offset: new AMap.Pixel(0, -30),
    });

    marker.on('click', () => {
      infoWindow.open(map, position);
    });
  }

  return marker;
}

/**
 * 绘制路线
 */
export async function drawPolyline(
  map: any,
  path: Array<[number, number]>,
  options: {
    strokeColor?: string;
    strokeWeight?: number;
  } = {}
): Promise<any> {
  const AMap = await loadAMap();

  const polyline = new AMap.Polyline({
    path,
    strokeColor: options.strokeColor || '#3b82f6',
    strokeWeight: options.strokeWeight || 5,
    strokeOpacity: 0.8,
    map,
  });

  return polyline;
}

/**
 * 路径规划(驾车)
 */
export async function calculateDrivingRoute(
  start: [number, number],
  end: [number, number]
): Promise<{
  distance: number; // 距离(米)
  duration: number; // 时间(秒)
  path: Array<[number, number]>;
}> {
  const AMap = await loadAMap();

  return new Promise((resolve, reject) => {
    AMap.plugin('AMap.Driving', () => {
      const driving = new AMap.Driving({
        policy: AMap.DrivingPolicy.LEAST_TIME,
      });

      driving.search(start, end, (status: string, result: any) => {
        if (status === 'complete') {
          const route = result.routes[0];
          const path = route.steps.flatMap((step: any) =>
            step.path.map((p: any) => [p.lng, p.lat])
          );

          resolve({
            distance: route.distance,
            duration: route.time,
            path,
          });
        } else {
          reject(new Error('Route calculation failed'));
        }
      });
    });
  });
}

/**
 * 路径规划(步行)
 */
export async function calculateWalkingRoute(
  start: [number, number],
  end: [number, number]
): Promise<{
  distance: number;
  duration: number;
  path: Array<[number, number]>;
}> {
  const AMap = await loadAMap();

  return new Promise((resolve, reject) => {
    AMap.plugin('AMap.Walking', () => {
      const walking = new AMap.Walking();

      walking.search(start, end, (status: string, result: any) => {
        if (status === 'complete') {
          const route = result.routes[0];
          const path = route.steps.flatMap((step: any) =>
            step.path.map((p: any) => [p.lng, p.lat])
          );

          resolve({
            distance: route.distance,
            duration: route.time,
            path,
          });
        } else {
          reject(new Error('Route calculation failed'));
        }
      });
    });
  });
}
