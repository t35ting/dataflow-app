@echo off
echo 🚀 Starting deployment process for DataFlow...

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

REM Check Node.js version
for /f "tokens=1,2 delims=." %%a in ('node -v') do set NODE_VERSION=%%a
set NODE_VERSION=%NODE_VERSION:~1%
if %NODE_VERSION% lss 18 (
    echo ❌ Node.js version 18+ is required. Current version: 
    node -v
    pause
    exit /b 1
)

echo ✅ Node.js version: 
node -v

REM Check if .env file exists
if not exist .env (
    echo ⚠️  .env file not found. Please create one with required environment variables.
    echo    See DEPLOYMENT.md for details.
    pause
    exit /b 1
)

echo ✅ Environment variables found

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

REM Build the application
echo 🔨 Building the application...
call npm run build

if %errorlevel% neq 0 (
    echo ❌ Build failed
    pause
    exit /b 1
)

echo ✅ Build completed successfully!

REM Check if Vercel CLI is installed
where vercel >nul 2>nul
if %errorlevel% equ 0 (
    echo 🚀 Deploying to Vercel...
    vercel --prod
) else (
    REM Check if Railway CLI is installed
    where railway >nul 2>nul
    if %errorlevel% equ 0 (
        echo 🚀 Deploying to Railway...
        railway up
    ) else (
        echo 📋 Deployment options:
        echo    1. Install Vercel CLI: npm i -g vercel
        echo    2. Install Railway CLI: npm i -g @railway/cli
        echo    3. Deploy manually using the instructions in DEPLOYMENT.md
        echo.
        echo ✅ Your application is built and ready for deployment!
        echo    Run 'npm start' to test the production build locally.
    )
)

pause
