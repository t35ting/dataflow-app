# DataFlow - Vercel Automated Deploy
Write-Host "🚀 DataFlow - Vercel Auto Deploy" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green

# Check if Vercel CLI is installed
try {
    vercel --version | Out-Null
    Write-Host "✅ Vercel CLI found" -ForegroundColor Green
} catch {
    Write-Host "📦 Installing Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
}

# Build the project
Write-Host "`n🔨 Building project..." -ForegroundColor Cyan
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build successful!" -ForegroundColor Green
    
    # Deploy to Vercel
    Write-Host "`n🌐 Deploying to Vercel..." -ForegroundColor Cyan
    Write-Host "This will open your browser for authentication..."
    
    # Deploy with auto-confirmation
    $deployResult = vercel --prod --yes --confirm
    
    Write-Host "`n🎉 Deployment Complete!" -ForegroundColor Green
    Write-Host "=====================" -ForegroundColor Green
    Write-Host "Your DataFlow app is now live!" -ForegroundColor Green
    Write-Host "URL: $deployResult" -ForegroundColor Cyan
} else {
    Write-Host "❌ Build failed! Please check for errors." -ForegroundColor Red
}
