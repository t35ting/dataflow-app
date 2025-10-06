@echo off
echo 🚀 DataFlow - Deploying to Render NOW!
echo =====================================

echo 📋 Building application...
npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed!
    pause
    exit /b 1
)
echo ✅ Build successful!

echo.
echo 🌐 Opening Render Dashboard...
echo Please follow these steps:
echo.
echo 1. Click "New +" → "Web Service"
echo 2. Connect GitHub: https://github.com/t35ting/dataflow-app.git
echo 3. Settings:
echo    - Name: dataflow-app
echo    - Environment: Node
echo    - Build Command: npm run build
echo    - Start Command: npm start
echo    - Plan: Free
echo.
echo 4. Add Environment Variables:
echo    - NODE_ENV = production
echo    - PORT = 10000
echo.
echo 5. Click "Create Web Service"
echo.
echo 6. Add PostgreSQL Database:
echo    - Click "New +" → "PostgreSQL"
echo    - Name: dataflow-postgres
echo    - Plan: Free
echo    - Copy Database URL
echo    - Add to Web Service: DATABASE_URL = (paste URL)
echo.
echo ✅ Your app will be live in 5-10 minutes!

start https://render.com/dashboard
pause