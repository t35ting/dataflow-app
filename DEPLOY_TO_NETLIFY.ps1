Write-Host "🚀 DataFlow - Netlify Deployment Script" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green

Write-Host ""
Write-Host "📋 Step 1: Create GitHub Repository" -ForegroundColor Yellow
Write-Host "-----------------------------------" -ForegroundColor Yellow
Write-Host "1. Go to: https://github.com/new"
Write-Host "2. Repository name: dataflow-app"
Write-Host "3. Make it: Public"
Write-Host "4. Click: Create repository"
Write-Host ""

Write-Host "📋 Step 2: Copy the repository URL from GitHub" -ForegroundColor Yellow
Write-Host "---------------------------------------------" -ForegroundColor Yellow
Write-Host "It will look like: https://github.com/YOUR_USERNAME/dataflow-app.git"
Write-Host ""

$repoUrl = Read-Host "Enter your GitHub repository URL"

Write-Host ""
Write-Host "🔧 Setting up Git remote..." -ForegroundColor Cyan
git remote add origin $repoUrl
git branch -M main

Write-Host ""
Write-Host "📤 Pushing to GitHub..." -ForegroundColor Cyan
git push -u origin main

Write-Host ""
Write-Host "🎉 GitHub setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Step 3: Deploy on Netlify" -ForegroundColor Yellow
Write-Host "----------------------------" -ForegroundColor Yellow
Write-Host "1. Go to: https://netlify.com"
Write-Host "2. Sign up/Login with GitHub"
Write-Host "3. Click: 'New site from Git'"
Write-Host "4. Choose: GitHub"
Write-Host "5. Select: dataflow-app"
Write-Host "6. Build settings:"
Write-Host "   - Build command: npm run build"
Write-Host "   - Publish directory: dist/public"
Write-Host "7. Click: Deploy site"
Write-Host ""
Write-Host "🎯 Your app will be live at: https://your-site-name.netlify.app" -ForegroundColor Green
Write-Host ""

Read-Host "Press Enter to continue"


