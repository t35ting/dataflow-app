@echo off
echo 🚀 DataFlow - Netlify Deployment Script
echo ======================================

echo.
echo 📋 Step 1: Create GitHub Repository
echo -----------------------------------
echo 1. Go to: https://github.com/new
echo 2. Repository name: dataflow-app
echo 3. Make it: Public
echo 4. Click: Create repository
echo.

echo 📋 Step 2: Copy the repository URL from GitHub
echo ---------------------------------------------
echo It will look like: https://github.com/YOUR_USERNAME/dataflow-app.git
echo.

set /p REPO_URL="Enter your GitHub repository URL: "

echo.
echo 🔧 Setting up Git remote...
git remote add origin %REPO_URL%
git branch -M main

echo.
echo 📤 Pushing to GitHub...
git push -u origin main

echo.
echo 🎉 GitHub setup complete!
echo.
echo 📋 Step 3: Deploy on Netlify
echo ----------------------------
echo 1. Go to: https://netlify.com
echo 2. Sign up/Login with GitHub
echo 3. Click: "New site from Git"
echo 4. Choose: GitHub
echo 5. Select: dataflow-app
echo 6. Build settings:
echo    - Build command: npm run build
echo    - Publish directory: dist/public
echo 7. Click: Deploy site
echo.
echo 🎯 Your app will be live at: https://your-site-name.netlify.app
echo.

pause
