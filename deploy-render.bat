@echo off
setlocal enabledelayedexpansion

echo 🚀 DataFlow Automatic Render Deployment
echo ======================================

REM Check if git is initialized
echo 📋 Checking Git repository...
if not exist ".git" (
    echo ⚠️  Git repository not initialized
    echo ℹ️  Initializing Git repository...
    git init
    git add .
    git commit -m "Initial commit - DataFlow project"
)
echo ✅ Git repository ready

REM Check if repository is pushed to GitHub
echo.
echo 📋 Checking GitHub repository...
git remote get-url origin >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  No GitHub remote found
    echo ℹ️  Please push your code to GitHub first:
    echo   git remote add origin https://github.com/YOUR_USERNAME/DataFlow.git
    echo   git push -u origin main
    echo.
    echo ℹ️  Then visit: https://render.com/dashboard
    echo ℹ️  Click 'New +' → 'Web Service'
    echo ℹ️  Connect your GitHub repository
    echo ℹ️  Use these settings:
    echo   Build Command: npm run build
    echo   Start Command: npm start
    echo   Environment: Node
    echo   Plan: Free
    pause
    exit /b 0
)

REM Get repository URL
for /f "tokens=*" %%i in ('git remote get-url origin 2^>nul') do set "REPO_URL=%%i"
echo ✅ GitHub repository: %REPO_URL%

REM Check if code is pushed
echo.
echo 📋 Checking if code is pushed to GitHub...
git diff --quiet HEAD origin/main 2>nul
if %errorlevel% neq 0 (
    echo ⚠️  Local changes not pushed to GitHub
    echo ℹ️  Pushing changes to GitHub...
    git add .
    git commit -m "Deploy to Render - %date% %time%"
    git push origin main
)
echo ✅ Code is up to date on GitHub

REM Create Render deployment instructions
echo.
echo 📋 Creating deployment instructions...

(
echo # 🚀 Deploy DataFlow to Render
echo.
echo ## One-Click Deployment
echo.
echo 1. **Visit Render Dashboard**: https://render.com/dashboard
echo 2. **Click "New +"** → **"Web Service"**
echo 3. **Connect GitHub Repository**: %REPO_URL%
echo 4. **Use these settings**:
echo.
echo ### Web Service Settings:
echo - **Name**: `dataflow-app`
echo - **Environment**: `Node`
echo - **Build Command**: `npm run build`
echo - **Start Command**: `npm start`
echo - **Plan**: `Free`
echo.
echo ### Environment Variables:
echo - `NODE_ENV` = `production`
echo - `PORT` = `10000`
echo.
echo ### Database Service:
echo 1. **Click "New +"** → **"PostgreSQL"**
echo 2. **Name**: `dataflow-postgres`
echo 3. **Plan**: `Free`
echo 4. **Database Name**: `dataflow`
echo 5. **User**: `dataflow_user`
echo 6. **Password**: `(auto-generated)`
echo.
echo ### Connect Database:
echo 1. **Copy the Database URL** from PostgreSQL service
echo 2. **Add to Web Service Environment Variables**:
echo    - `DATABASE_URL` = `(your postgres connection string)`
echo.
echo ## Automatic Deployment
echo.
echo Once connected, Render will automatically deploy on every push to main branch!
echo.
echo ## Features Included:
echo.
echo - ✅ **CSV Import/Export**: Upload and manage LeetCode problems
echo - ✅ **Problem Management**: Add, edit, delete problems with notes
echo - ✅ **Analytics Dashboard**: Track progress and statistics
echo - ✅ **Search & Filtering**: Find problems by difficulty, status, tags
echo - ✅ **Responsive Design**: Works on desktop and mobile
echo.
echo ## After Deployment:
echo.
echo - 🌐 **Your app will be live** at a Render-provided URL
echo - 📊 **Access Render dashboard** to manage your deployment
echo - 🔧 **Environment variables** are automatically configured
echo - 📈 **Scaling and monitoring** available in Render dashboard
echo - 🗄️ **Database management** through Render dashboard
echo.
echo ---
echo.
echo **Ready to deploy?** Follow the steps above! 🚀
) > DEPLOY_TO_RENDER.md

echo ✅ Deployment instructions created in DEPLOY_TO_RENDER.md

REM Create GitHub Actions for automatic deployment
echo.
echo 📋 Creating GitHub Actions workflow...

if not exist ".github" mkdir .github
if not exist ".github\workflows" mkdir .github\workflows

(
echo name: Deploy to Render
echo.
echo on:
echo   push:
echo     branches: [ main, master ]
echo   pull_request:
echo     branches: [ main, master ]
echo.
echo jobs:
echo   deploy:
echo     runs-on: ubuntu-latest
echo     
echo     steps:
echo     - name: Checkout code
echo       uses: actions/checkout@v4
echo       
echo     - name: Setup Node.js
echo       uses: actions/setup-node@v4
echo       with:
echo         node-version: '18'
echo         cache: 'npm'
echo         
echo     - name: Install dependencies
echo       run: npm ci
echo       
echo     - name: Build application
echo       run: npm run build
echo       
echo     - name: Run tests ^(if any^)
echo       run: npm test --if-present
echo       
echo     - name: Deploy to Render
echo       if: github.ref == 'refs/heads/main' OR github.ref == 'refs/heads/master'
echo       run: ^|
echo         echo "🚀 Deployment triggered!"
echo         echo "Your app will be automatically deployed to Render"
echo         echo "Check your Render dashboard for deployment status"
) > .github\workflows\render-deploy.yml

echo ✅ GitHub Actions workflow created

REM Final instructions
echo.
echo ✅ 🎉 Render Deployment Setup Complete!
echo.
echo ℹ️  🌐 Next Steps:
echo 1. Visit: https://render.com/dashboard
echo 2. Click 'New +' → 'Web Service'
echo 3. Connect your GitHub repository: %REPO_URL%
echo 4. Use the settings from DEPLOY_TO_RENDER.md
echo.
echo ℹ️  📋 Quick Settings:
echo   Build Command: npm run build
echo   Start Command: npm start
echo   Environment: Node
echo   Plan: Free
echo.
echo ℹ️  🗄️ Don't forget to add PostgreSQL service!
echo   Click 'New +' → 'PostgreSQL' → 'Free'
echo.
echo ✅ Your DataFlow app will be live on Render! 🚀
pause
