@echo off
echo 🚀 DataFlow - Deploying to Surge.sh
echo ==================================

echo 📋 Building application...
npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed!
    pause
    exit /b 1
)
echo ✅ Build successful!

echo.
echo 🌐 Deploying to Surge.sh...
echo You'll need to sign in with your email and password
echo.

cd dist/public
surge . dataflow-app.surge.sh

echo.
echo ✅ Deployment complete!
echo Your app is live at: https://dataflow-app.surge.sh
pause
