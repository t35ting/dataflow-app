@echo off
echo 🚀 DataFlow Railway Deployment Script
echo =====================================
echo.

REM Check if Railway CLI is installed
echo 📋 Checking Railway CLI installation...
railway --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Railway CLI is not installed!
    echo Please install Railway CLI first:
    echo   npm install -g @railway/cli
    echo   or visit: https://docs.railway.app/develop/cli
    pause
    exit /b 1
)
echo ✅ Railway CLI is installed

REM Check if user is logged in
echo.
echo 🔐 Checking Railway authentication...
railway whoami >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Not logged in to Railway!
    echo Please login first:
    echo   railway login
    pause
    exit /b 1
)
echo ✅ Logged in to Railway

REM Check if project exists
echo.
echo 📁 Checking project status...
railway status >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  Project not linked to Railway yet
    echo Linking project...
    railway link
)

REM Deploy
echo.
echo 🏗️  Building and deploying to Railway...
echo This may take a few minutes...
railway up --detach

if %errorlevel% equ 0 (
    echo ✅ Deployment successful!
    echo.
    echo 🌐 Your app is now live on Railway!
    echo Check your Railway dashboard for the URL
    echo.
    echo 📊 Useful commands:
    echo   railway logs     - View deployment logs
    echo   railway status   - Check deployment status
    echo   railway variables - Manage environment variables
    echo   railway open     - Open your app in browser
) else (
    echo ❌ Deployment failed!
    echo Check the logs for more details:
    echo   railway logs
)

echo.
echo 🎉 Deployment complete!
pause
