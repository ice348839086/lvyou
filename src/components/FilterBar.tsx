import { useState } from 'react';
import type { FilterOptions } from '@/types/guide';

interface FilterBarProps {
  onFilterChange: (filters: FilterOptions) => void;
}

export default function FilterBar({ onFilterChange }: FilterBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedDays, setSelectedDays] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('');

  const handleFilterChange = () => {
    onFilterChange({
      search: searchQuery,
      region: selectedRegion || undefined,
      days: selectedDays || undefined,
      theme: selectedTheme || undefined,
    });
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onFilterChange({
      search: value,
      region: selectedRegion || undefined,
      days: selectedDays || undefined,
      theme: selectedTheme || undefined,
    });
  };

  const handleRegionChange = (value: string) => {
    setSelectedRegion(value);
    onFilterChange({
      search: searchQuery,
      region: value || undefined,
      days: selectedDays || undefined,
      theme: selectedTheme || undefined,
    });
  };

  const handleDaysChange = (value: string) => {
    setSelectedDays(value);
    onFilterChange({
      search: searchQuery,
      region: selectedRegion || undefined,
      days: value || undefined,
      theme: selectedTheme || undefined,
    });
  };

  const handleThemeChange = (value: string) => {
    setSelectedTheme(value);
    onFilterChange({
      search: searchQuery,
      region: selectedRegion || undefined,
      days: selectedDays || undefined,
      theme: value || undefined,
    });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedRegion('');
    setSelectedDays('');
    setSelectedTheme('');
    onFilterChange({});
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      {/* 搜索框 */}
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="搜索城市、主题或标签..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* 筛选选项 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* 地区筛选 */}
        <select
          value={selectedRegion}
          onChange={(e) => handleRegionChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">所有地区</option>
          <option value="华东">华东</option>
          <option value="华北">华北</option>
          <option value="华南">华南</option>
          <option value="西南">西南</option>
          <option value="西北">西北</option>
          <option value="华中">华中</option>
          <option value="东北">东北</option>
        </select>

        {/* 天数筛选 */}
        <select
          value={selectedDays}
          onChange={(e) => handleDaysChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">所有天数</option>
          <option value="1-2">1-2天</option>
          <option value="3">3天</option>
          <option value="4-5">4-5天</option>
          <option value="5+">5天以上</option>
        </select>

        {/* 主题筛选 */}
        <select
          value={selectedTheme}
          onChange={(e) => handleThemeChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">所有主题</option>
          <option value="古镇">古镇水乡</option>
          <option value="山水">山水风光</option>
          <option value="历史">历史文化</option>
          <option value="美食">美食之旅</option>
          <option value="亲子">亲子游</option>
          <option value="度假">度假休闲</option>
        </select>
      </div>

      {/* 清除筛选按钮 */}
      {(searchQuery || selectedRegion || selectedDays || selectedTheme) && (
        <div className="mt-3 text-center">
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            清除所有筛选
          </button>
        </div>
      )}
    </div>
  );
}
