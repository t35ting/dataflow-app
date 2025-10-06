# DataFlow - Quick Deploy Script
Write-Host "🚀 DataFlow - Quick Deploy" -ForegroundColor Green
Write-Host "=========================" -ForegroundColor Green

# Build the project
Write-Host "`n🔨 Building project..." -ForegroundColor Cyan
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build successful!" -ForegroundColor Green
    
    # Deploy to Netlify directly
    Write-Host "`n🌐 Deploying to Netlify..." -ForegroundColor Cyan
    Write-Host "This will open your browser for authentication..."
    
    # Install Netlify CLI if not already installed
    try {
        netlify --version | Out-Null
    } catch {
        Write-Host "Installing Netlify CLI..."
        npm install -g netlify-cli
    }
    
    # Deploy
    netlify deploy --prod --dir=dist/public --open
    
    Write-Host "`n🎉 Deployment initiated!" -ForegroundColor Green
    Write-Host "Check your browser for the deployment process." -ForegroundColor Yellow
} else {
    Write-Host "❌ Build failed! Please check for errors." -ForegroundColor Red
}



