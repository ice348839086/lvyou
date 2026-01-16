@echo off
echo Creating .env.local file...

(
echo # 高德地图 API Key ^(必需^)
echo # 获取地址: https://lbs.amap.com/
echo NEXT_PUBLIC_AMAP_KEY=your_amap_key_here
echo.
echo # Unsplash API Access Key
echo # 用于自动获取城市封面图片
echo NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=4LhoHgPt9SygvZ45XFedJt4xls3E_owLt9aOEFRChvw
echo.
echo # 攻略数据目录路径
echo GUIDES_DATA_PATH=../travel-guides/guides
) > .env.local

echo.
echo ✅ .env.local file created successfully!
echo.
echo 📝 Next steps:
echo 1. Update NEXT_PUBLIC_AMAP_KEY with your Amap key
echo 2. Run: npm run dev
echo.
pause
