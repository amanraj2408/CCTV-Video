@echo off
REM Video Dashboard - Quick Setup Script for Windows

echo.
echo 🚀 Video Dashboard Setup
echo =======================
echo.

REM Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js ^>= 18.0.0
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js %NODE_VERSION% detected

REM Check npm
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ npm is not installed.
    exit /b 1
)

for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo ✅ npm %NPM_VERSION% detected

REM Install dependencies
echo.
echo 📦 Installing dependencies...
call npm install

REM Check for .env.local
if not exist ".env.local" (
    echo.
    echo ⚠️  .env.local not found
    copy .env.example .env.local
    echo ✅ Created .env.local from .env.example
    echo 📝 Please edit .env.local with your configuration
    echo    - MONGODB_URI
    echo    - CLERK_PUBLISHABLE_KEY
    echo    - CLERK_SECRET_KEY
    echo    - MQTT_BROKER_URL
    exit /b 0
) else (
    echo ✅ .env.local already exists
)

REM Check for Docker (optional)
where docker >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo.
    echo 🐳 Docker is installed
    echo.
    set /p DOCKER_CHOICE="Do you want to start MongoDB and MQTT services? (y/n): "
    if /i "%DOCKER_CHOICE%"=="y" (
        call docker-compose up -d
        echo ✅ Services started
        timeout /t 3 /nobreak
    )
) else (
    echo.
    echo ⚠️  Docker not detected. You'll need to set up MongoDB and MQTT separately
)

echo.
echo ✅ Setup complete!
echo.
echo 📌 Next steps:
echo   1. Edit .env.local with your configuration
echo   2. Run: npm run dev ^(in one terminal^)
echo   3. Run: npm run mqtt-server ^(in another terminal^)
echo   4. Open: http://localhost:3000
echo.
pause
