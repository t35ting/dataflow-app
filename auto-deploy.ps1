# DataFlow - Automated Netlify Deployment Script
Write-Host "🚀 DataFlow - Automated Deployment" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green

# Step 1: Authenticate with GitHub
Write-Host "`n📋 Step 1: GitHub Authentication" -ForegroundColor Yellow
Write-Host "-------------------------------" -ForegroundColor Yellow
Write-Host "You need to authenticate with GitHub first..."
gh auth login --web

# Step 2: Create GitHub repository
Write-Host "`n📋 Step 2: Creating GitHub Repository" -ForegroundColor Yellow
Write-Host "------------------------------------" -ForegroundColor Yellow
$repoName = "dataflow-app-$(Get-Date -Format 'yyyyMMdd-HHmm')"
Write-Host "Creating repository: $repoName"

# Create repository and push code
gh repo create $repoName --public --description "DataFlow - LeetCode Problem Tracker" --source=. --remote=origin --push

# Step 3: Authenticate with Netlify
Write-Host "`n📋 Step 3: Netlify Authentication" -ForegroundColor Yellow
Write-Host "--------------------------------" -ForegroundColor Yellow
Write-Host "You need to authenticate with Netlify..."
netlify login

# Step 4: Deploy to Netlify
Write-Host "`n📋 Step 4: Deploying to Netlify" -ForegroundColor Yellow
Write-Host "-------------------------------" -ForegroundColor Yellow

# Build the project first
Write-Host "Building project..."
npm run build

# Deploy to Netlify
Write-Host "Deploying to Netlify..."
$deployResult = netlify deploy --prod --dir=dist/public --site-name=$repoName

Write-Host "`n🎉 Deployment Complete!" -ForegroundColor Green
Write-Host "=====================" -ForegroundColor Green
Write-Host "Repository: https://github.com/$(gh api user --jq .login)/$repoName"
Write-Host "Live URL: $deployResult"
Write-Host "`nYour DataFlow app is now live! 🚀" -ForegroundColor Green



