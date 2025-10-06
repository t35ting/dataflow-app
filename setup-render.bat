@echo off
echo 🚀 DataFlow Render Deployment Setup
echo ==================================

echo 📋 Checking Git repository...
if not exist ".git" (
    echo ⚠️  Git repository not initialized
    git init
    git add .
    git commit -m "Initial commit - DataFlow project"
)
echo ✅ Git repository ready

echo.
echo 📋 Checking GitHub repository...
git remote get-url origin >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  No GitHub remote found
    echo Please push your code to GitHub first
    echo Then visit: https://render.com/dashboard
    pause
    exit /b 0
)

for /f "tokens=*" %%i in ('git remote get-url origin 2^>nul') do set "REPO_URL=%%i"
echo ✅ GitHub repository: %REPO_URL%

echo.
echo 📋 Creating deployment files...

echo # Deploy DataFlow to Render > DEPLOY_TO_RENDER.md
echo. >> DEPLOY_TO_RENDER.md
echo 1. Visit: https://render.com/dashboard >> DEPLOY_TO_RENDER.md
echo 2. Click "New +" → "Web Service" >> DEPLOY_TO_RENDER.md
echo 3. Connect GitHub: %REPO_URL% >> DEPLOY_TO_RENDER.md
echo 4. Settings: >> DEPLOY_TO_RENDER.md
echo    - Build Command: npm run build >> DEPLOY_TO_RENDER.md
echo    - Start Command: npm start >> DEPLOY_TO_RENDER.md
echo    - Environment: Node >> DEPLOY_TO_RENDER.md
echo    - Plan: Free >> DEPLOY_TO_RENDER.md
echo 5. Add PostgreSQL service >> DEPLOY_TO_RENDER.md

echo ✅ Deployment instructions created

echo.
echo ✅ 🎉 Render Setup Complete!
echo.
echo 🌐 Next Steps:
echo 1. Visit: https://render.com/dashboard
echo 2. Click "New +" → "Web Service"
echo 3. Connect: %REPO_URL%
echo 4. Use settings from DEPLOY_TO_RENDER.md
echo.
echo 🚀 Your app will be live on Render!
pause
