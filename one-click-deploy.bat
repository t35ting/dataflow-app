@echo off
echo 🚀 DataFlow - One-Click Deployment
echo ==================================

echo.
echo 🔧 Step 1: Installing GitHub CLI...
winget install --id GitHub.cli --silent

echo.
echo 🔧 Step 2: Building project...
call npm run build

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Build failed!
    pause
    exit /b 1
)

echo.
echo 🔧 Step 3: Creating GitHub repository...
echo You'll need to authenticate with GitHub...
gh auth login --web

echo.
echo Creating repository...
set REPO_NAME=dataflow-app-%DATE:~-4%%DATE:~4,2%%DATE:~7,2%-%TIME:~0,2%%TIME:~3,2%
set REPO_NAME=%REPO_NAME: =0%
gh repo create %REPO_NAME% --public --description "DataFlow - LeetCode Problem Tracker" --source=. --remote=origin --push

echo.
echo 🎉 Repository created: https://github.com/%USERNAME%/%REPO_NAME%
echo.
echo 🌐 Step 4: Deploying to GitHub Pages...
echo Your app will be live at: https://%USERNAME%.github.io/%REPO_NAME%
echo.
echo ✅ Deployment complete! Check the Actions tab in your GitHub repository.
echo.

pause



