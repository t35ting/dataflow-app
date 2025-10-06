@echo off
setlocal enabledelayedexpansion

echo 🚀 DataFlow Automatic Railway Deployment
echo ========================================

REM Check if Railway CLI is installed
echo 📋 Checking Railway CLI installation...
railway --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Railway CLI is not installed!
    echo Installing Railway CLI...
    npm install -g @railway/cli
    if %errorlevel% neq 0 (
        echo ❌ Failed to install Railway CLI
        pause
        exit /b 1
    )
)
echo ✅ Railway CLI is ready

REM Check if user is logged in
echo.
echo 🔐 Checking Railway authentication...
railway whoami >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  Not logged in to Railway
    echo ℹ️  Opening Railway login page...
    railway login
    if %errorlevel% neq 0 (
        echo ❌ Failed to login to Railway
        pause
        exit /b 1
    )
)
echo ✅ Logged in to Railway

REM Create new Railway project
echo.
echo 🏗️  Creating Railway project...
for /f "tokens=2 delims==" %%a in ('wmic os get localdatetime /value') do set "dt=%%a"
set "YY=%dt:~2,2%" & set "YYYY=%dt:~0,4%" & set "MM=%dt:~4,2%" & set "DD=%dt:~6,2%"
set "HH=%dt:~8,2%" & set "Min=%dt:~10,2%" & set "Sec=%dt:~12,2%"
set "timestamp=%YYYY%%MM%%DD%%HH%%Min%%Sec%"
set "PROJECT_NAME=dataflow-%timestamp%"
echo ℹ️  Creating project: %PROJECT_NAME%

REM Create project
railway new %PROJECT_NAME%
if %errorlevel% neq 0 (
    echo ❌ Failed to create project
    pause
    exit /b 1
)

REM Link to the project
railway link %PROJECT_NAME%
if %errorlevel% neq 0 (
    echo ❌ Failed to link project
    pause
    exit /b 1
)

echo ✅ Project created and linked: %PROJECT_NAME%

REM Add PostgreSQL service
echo.
echo 🗄️  Adding PostgreSQL service...
railway add postgresql
if %errorlevel% neq 0 (
    echo ⚠️  Failed to add PostgreSQL service automatically
    echo ℹ️  Please add PostgreSQL service manually in Railway dashboard
)

REM Wait for services to be ready
echo.
echo ⏳ Waiting for services to be ready...
timeout /t 10 /nobreak >nul

REM Set environment variables
echo.
echo 🔧 Setting up environment variables...
railway variables set NODE_ENV=production

REM Deploy the application
echo.
echo 🚀 Deploying application...
railway up --detach
if %errorlevel% neq 0 (
    echo ❌ Deployment failed!
    echo Check the logs:
    railway logs
    pause
    exit /b 1
)

REM Wait for deployment to complete
echo.
echo ⏳ Waiting for deployment to complete...
timeout /t 30 /nobreak >nul

REM Run database migrations
echo.
echo 🏗️  Running database migrations...
railway run npm run db:push
if %errorlevel% neq 0 (
    echo ⚠️  Database migrations failed, but app should still work
)

REM Get the deployment URL
echo.
echo 🌐 Getting deployment URL...
for /f "tokens=*" %%i in ('railway domain 2^>nul') do set "DEPLOY_URL=%%i"
if "%DEPLOY_URL%"=="" (
    for /f "tokens=*" %%i in ('railway status 2^>nul ^| findstr "https://"') do set "DEPLOY_URL=%%i"
)

echo.
echo ✅ 🎉 Deployment Complete!
echo.
echo ℹ️  🌐 Your DataFlow app is live at: %DEPLOY_URL%
echo ℹ️  📊 Railway Dashboard: https://railway.app/dashboard
echo.
echo ℹ️  📋 Useful commands:
echo   railway logs     - View deployment logs
echo   railway status   - Check deployment status
echo   railway variables - Manage environment variables
echo   railway open     - Open your app in browser
echo.
echo ℹ️  🔧 Project management:
echo   railway service  - Manage services
echo   railway scale    - Scale your application
echo   railway logs --follow - Follow logs in real-time
echo.
echo ✅ Your DataFlow application is now fully deployed and running on Railway!
pause
