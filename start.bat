@echo off
chcp 65001 >nul
echo ========================================
echo 智旅攻略网站 - 启动脚本
echo ========================================
echo.

REM 检查Node版本
echo [1/3] 检查Node版本...
node -v
echo.

REM 检查是否需要安装依赖
if not exist "node_modules\" (
    echo [2/3] 安装依赖...
    call npm install
) else (
    echo [2/3] 依赖已安装,跳过
)
echo.

REM 检查环境变量文件
if not exist ".env.local" (
    echo [警告] 未找到.env.local文件
    echo 正在创建默认配置...
    (
        echo # 高德地图API Key
        echo NEXT_PUBLIC_AMAP_KEY=a0bec27f2df79f2a3684013ebfe42961
        echo.
        echo # 攻略数据目录路径
        echo GUIDES_DATA_PATH=../travel-guides/guides
    ) > .env.local
    echo .env.local 已创建
)
echo.

echo [3/3] 启动开发服务器...
echo.
echo ========================================
echo 访问: http://localhost:3000
echo 按 Ctrl+C 停止服务器
echo ========================================
echo.

npm run dev
