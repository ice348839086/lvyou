import { useState } from 'react';
import { searchCityImage } from '@/lib/unsplash';

export default function TestUnsplash() {
  const [cityName, setCityName] = useState('北京');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testFetch = async () => {
    setLoading(true);
    setError(null);
    setImageUrl(null);

    try {
      console.log('Testing Unsplash API for:', cityName);
      const url = await searchCityImage(cityName);
      console.log('Got URL:', url);
      
      if (url) {
        setImageUrl(url);
      } else {
        setError('No image found');
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-6">Unsplash API 测试</h1>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">城市名称：</label>
          <input
            type="text"
            value={cityName}
            onChange={(e) => setCityName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            placeholder="输入城市名称"
          />
        </div>

        <button
          onClick={testFetch}
          disabled={loading}
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? '加载中...' : '获取图片'}
        </button>

        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
            错误: {error}
          </div>
        )}

        {imageUrl && (
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-4">获取的图片：</h2>
            <img
              src={imageUrl}
              alt={cityName}
              className="w-full rounded-lg shadow-lg"
            />
            <p className="mt-2 text-sm text-gray-600 break-all">
              URL: {imageUrl}
            </p>
          </div>
        )}

        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <h3 className="font-bold mb-2">环境变量检查：</h3>
          <p className="text-sm">
            NEXT_PUBLIC_UNSPLASH_ACCESS_KEY: {' '}
            {process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY 
              ? '✅ 已配置' 
              : '❌ 未配置'}
          </p>
        </div>
      </div>
    </div>
  );
}
