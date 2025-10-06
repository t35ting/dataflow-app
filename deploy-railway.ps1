# Railway Deployment Script for DataFlow
# This script helps deploy the DataFlow project to Railway

Write-Host "🚀 DataFlow Railway Deployment Script" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

# Check if Railway CLI is installed
Write-Host "`n📋 Checking Railway CLI installation..." -ForegroundColor Yellow
try {
    $railwayVersion = railway --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Railway CLI is installed: $railwayVersion" -ForegroundColor Green
    } else {
        throw "Railway CLI not found"
    }
} catch {
    Write-Host "❌ Railway CLI is not installed!" -ForegroundColor Red
    Write-Host "Please install Railway CLI first:" -ForegroundColor Yellow
    Write-Host "  npm install -g @railway/cli" -ForegroundColor White
    Write-Host "  or visit: https://docs.railway.app/develop/cli" -ForegroundColor White
    exit 1
}

# Check if user is logged in
Write-Host "`n🔐 Checking Railway authentication..." -ForegroundColor Yellow
try {
    $whoami = railway whoami 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Logged in as: $whoami" -ForegroundColor Green
    } else {
        throw "Not logged in"
    }
} catch {
    Write-Host "❌ Not logged in to Railway!" -ForegroundColor Red
    Write-Host "Please login first:" -ForegroundColor Yellow
    Write-Host "  railway login" -ForegroundColor White
    exit 1
}

# Check if project exists
Write-Host "`n📁 Checking project status..." -ForegroundColor Yellow
try {
    railway status 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Project is linked to Railway" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Project not linked to Railway yet" -ForegroundColor Yellow
        Write-Host "Linking project..." -ForegroundColor Yellow
        railway link
    }
} catch {
    Write-Host "❌ Failed to check project status" -ForegroundColor Red
    exit 1
}

# Check for environment variables
Write-Host "`n🔧 Checking environment variables..." -ForegroundColor Yellow
railway variables 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Environment variables configured" -ForegroundColor Green
    Write-Host "Current environment variables:" -ForegroundColor Cyan
    railway variables
} else {
    Write-Host "⚠️  No environment variables found" -ForegroundColor Yellow
    Write-Host "You may need to set up DATABASE_URL and other required variables" -ForegroundColor Yellow
}

# Build and deploy
Write-Host "`n🏗️  Building and deploying to Railway..." -ForegroundColor Yellow
Write-Host "This may take a few minutes..." -ForegroundColor Yellow

try {
    railway up --detach
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Deployment successful!" -ForegroundColor Green
        Write-Host "`n🌐 Your app is now live on Railway!" -ForegroundColor Cyan
        Write-Host "Check your Railway dashboard for the URL" -ForegroundColor White
        Write-Host "`n📊 Useful commands:" -ForegroundColor Yellow
        Write-Host "  railway logs     - View deployment logs" -ForegroundColor White
        Write-Host "  railway status   - Check deployment status" -ForegroundColor White
        Write-Host "  railway variables - Manage environment variables" -ForegroundColor White
        Write-Host "  railway open     - Open your app in browser" -ForegroundColor White
    } else {
        Write-Host "❌ Deployment failed!" -ForegroundColor Red
        Write-Host "Check the logs for more details:" -ForegroundColor Yellow
        Write-Host "  railway logs" -ForegroundColor White
        exit 1
    }
} catch {
    Write-Host "❌ Deployment failed with error: $_" -ForegroundColor Red
    exit 1
}

Write-Host "`n🎉 Deployment complete!" -ForegroundColor Green
