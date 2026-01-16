import type { DayItinerary } from '@/types/guide';

interface TimelineProps {
  itinerary: DayItinerary[];
  onLocationClick?: (locationName: string) => void;
}

export default function Timeline({ itinerary, onLocationClick }: TimelineProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'attraction':
        return '🏛️';
      case 'meal':
        return '🍜';
      case 'transport':
        return '🚕';
      case 'hotel':
        return '🏨';
      default:
        return '📍';
    }
  };

  return (
    <div className="space-y-8">
      {itinerary.map((day) => (
        <div key={day.day} className="bg-white rounded-lg shadow-md p-6">
          {/* 日期标题 */}
          <div className="flex items-center mb-6">
            <div className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold">
              Day {day.day}
            </div>
            {day.date && (
              <span className="ml-3 text-gray-600">{day.date}</span>
            )}
            <span className="ml-auto text-gray-700 font-medium">
              {day.theme}
            </span>
          </div>

          {/* 时间轴 */}
          <div className="relative pl-8 border-l-2 border-gray-200">
            {day.items.map((item, index) => (
              <div key={index} className="mb-6 last:mb-0">
                {/* 时间点标记 */}
                <div className="absolute left-0 -ml-3 w-6 h-6 bg-blue-500 rounded-full border-4 border-white flex items-center justify-center text-xs">
                  {getIcon(item.type)}
                </div>

                {/* 内容卡片 */}
                <div
                  className={`ml-6 ${
                    item.location && onLocationClick
                      ? 'cursor-pointer hover:bg-gray-50'
                      : ''
                  } p-4 rounded-lg border border-gray-200 transition-colors`}
                  onClick={() => {
                    if (item.location && onLocationClick) {
                      onLocationClick(item.location);
                    }
                  }}
                >
                  {/* 时间 */}
                  <div className="text-sm text-gray-500 mb-1">{item.time}</div>

                  {/* 标题 */}
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h4>

                  {/* 描述 */}
                  {item.description && (
                    <p className="text-gray-600 text-sm mb-2">
                      {item.description}
                    </p>
                  )}

                  {/* 提示标签 */}
                  {item.tips && item.tips.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {item.tips.map((tip, tipIndex) => (
                        <span
                          key={tipIndex}
                          className="inline-flex items-center px-2 py-1 bg-yellow-50 text-yellow-700 text-xs rounded"
                        >
                          💡 {tip}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* 位置标记 */}
                  {item.location && (
                    <div className="mt-2 text-sm text-blue-600 flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {item.location}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
