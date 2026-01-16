import { useEffect, useRef, useState } from 'react';
import { createMap, addMarker, drawPolyline } from '@/lib/amap';
import type { Location } from '@/types/guide';

interface MapViewProps {
  locations: Location[];
  center?: [number, number];
  zoom?: number;
  onMarkerClick?: (location: Location) => void;
}

export default function MapView({
  locations,
  center,
  zoom = 12,
  onMarkerClick,
}: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    let mounted = true;

    const initMap = async () => {
      try {
        setLoading(true);
        setError(null);

        // 计算中心点
        const mapCenter = center || calculateCenter(locations);

        // 创建地图
        const mapInstance = await createMap(mapContainer.current!, {
          center: mapCenter,
          zoom,
        });

        if (!mounted) return;

        setMap(mapInstance);

        // 添加标记点
        const markers: any[] = [];
        for (const location of locations) {
          const marker = await addMarker(
            mapInstance,
            [location.lng, location.lat],
            {
              title: location.name,
              content: `
                <div class="p-2">
                  <h4 class="font-bold text-gray-900">${location.name}</h4>
                  <p class="text-sm text-gray-600">${getTypeLabel(location.type)}</p>
                </div>
              `,
            }
          );

          if (onMarkerClick) {
            marker.on('click', () => {
              onMarkerClick(location);
            });
          }

          markers.push(marker);
        }

        // 绘制路线(连接所有景点)
        if (locations.length > 1) {
          const path = locations.map((loc) => [loc.lng, loc.lat] as [number, number]);
          await drawPolyline(mapInstance, path, {
            strokeColor: '#3b82f6',
            strokeWeight: 4,
          });
        }

        // 自动调整视野
        if (locations.length > 0) {
          mapInstance.setFitView();
        }

        setLoading(false);
      } catch (err) {
        console.error('Map initialization error:', err);
        if (mounted) {
          setError('地图加载失败,请刷新页面重试');
          setLoading(false);
        }
      }
    };

    initMap();

    return () => {
      mounted = false;
      if (map) {
        map.destroy();
      }
    };
  }, [locations, center, zoom]);

  return (
    <div className="relative w-full h-full min-h-[400px] rounded-lg overflow-hidden">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">加载地图中...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-red-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      )}

      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
}

// 计算中心点
function calculateCenter(locations: Location[]): [number, number] {
  if (locations.length === 0) {
    return [116.397428, 39.90923]; // 默认北京
  }

  const sum = locations.reduce(
    (acc, loc) => ({
      lat: acc.lat + loc.lat,
      lng: acc.lng + loc.lng,
    }),
    { lat: 0, lng: 0 }
  );

  return [sum.lng / locations.length, sum.lat / locations.length];
}

// 获取类型标签
function getTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    attraction: '景点',
    restaurant: '餐厅',
    hotel: '酒店',
    transport: '交通',
  };
  return labels[type] || '地点';
}
