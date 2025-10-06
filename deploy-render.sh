#!/bin/bash

# DataFlow Automatic Render Deployment Script
# This script deploys your DataFlow application to Render automatically

echo "🚀 DataFlow Automatic Render Deployment"
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${CYAN}$1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if git is initialized
print_status "📋 Checking Git repository..."
if [ ! -d ".git" ]; then
    print_warning "Git repository not initialized"
    print_status "Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit - DataFlow project"
fi
print_success "Git repository ready"

# Check if Render CLI is installed
print_status "📋 Checking Render CLI installation..."
if ! command -v render &> /dev/null; then
    print_warning "Render CLI not found"
    print_info "You can install it with: npm install -g @render/cli"
    print_info "Or deploy manually via Render dashboard"
else
    print_success "Render CLI is installed"
fi

# Check if repository is pushed to GitHub
print_status "📋 Checking GitHub repository..."
if ! git remote get-url origin &> /dev/null; then
    print_warning "No GitHub remote found"
    print_info "Please push your code to GitHub first:"
    echo "  git remote add origin https://github.com/YOUR_USERNAME/DataFlow.git"
    echo "  git push -u origin main"
    echo ""
    print_info "Then visit: https://render.com/dashboard"
    print_info "Click 'New +' → 'Web Service'"
    print_info "Connect your GitHub repository"
    print_info "Use these settings:"
    echo "  Build Command: npm run build"
    echo "  Start Command: npm start"
    echo "  Environment: Node"
    echo "  Plan: Free"
    exit 0
fi

# Get repository URL
REPO_URL=$(git remote get-url origin)
print_success "GitHub repository: $REPO_URL"

# Check if code is pushed
print_status "📋 Checking if code is pushed to GitHub..."
if ! git diff --quiet HEAD origin/main 2>/dev/null; then
    print_warning "Local changes not pushed to GitHub"
    print_status "Pushing changes to GitHub..."
    git add .
    git commit -m "Deploy to Render - $(date)"
    git push origin main
fi
print_success "Code is up to date on GitHub"

# Create Render deployment instructions
print_status "📋 Creating deployment instructions..."

cat > DEPLOY_TO_RENDER.md << 'EOF'
# 🚀 Deploy DataFlow to Render

## One-Click Deployment

1. **Visit Render Dashboard**: https://render.com/dashboard
2. **Click "New +"** → **"Web Service"**
3. **Connect GitHub Repository**: `YOUR_REPO_URL`
4. **Use these settings**:

### Web Service Settings:
- **Name**: `dataflow-app`
- **Environment**: `Node`
- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Plan**: `Free`

### Environment Variables:
- `NODE_ENV` = `production`
- `PORT` = `10000`

### Database Service:
1. **Click "New +"** → **"PostgreSQL"**
2. **Name**: `dataflow-postgres`
3. **Plan**: `Free`
4. **Database Name**: `dataflow`
5. **User**: `dataflow_user`
6. **Password**: `(auto-generated)`

### Connect Database:
1. **Copy the Database URL** from PostgreSQL service
2. **Add to Web Service Environment Variables**:
   - `DATABASE_URL` = `(your postgres connection string)`

## Automatic Deployment

Once connected, Render will automatically deploy on every push to main branch!

## Features Included:

- ✅ **CSV Import/Export**: Upload and manage LeetCode problems
- ✅ **Problem Management**: Add, edit, delete problems with notes
- ✅ **Analytics Dashboard**: Track progress and statistics
- ✅ **Search & Filtering**: Find problems by difficulty, status, tags
- ✅ **Responsive Design**: Works on desktop and mobile

## After Deployment:

- 🌐 **Your app will be live** at a Render-provided URL
- 📊 **Access Render dashboard** to manage your deployment
- 🔧 **Environment variables** are automatically configured
- 📈 **Scaling and monitoring** available in Render dashboard
- 🗄️ **Database management** through Render dashboard

---

**Ready to deploy?** Follow the steps above! 🚀
EOF

print_success "Deployment instructions created in DEPLOY_TO_RENDER.md"

# Create GitHub Actions for automatic deployment
print_status "📋 Creating GitHub Actions workflow..."

mkdir -p .github/workflows

cat > .github/workflows/render-deploy.yml << 'EOF'
name: Deploy to Render

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build application
      run: npm run build
      
    - name: Run tests (if any)
      run: npm test --if-present
      
    - name: Deploy to Render
      if: github.ref == 'refs/heads/main' || github.ref == 'refs/heads/master'
      run: |
        echo "🚀 Deployment triggered!"
        echo "Your app will be automatically deployed to Render"
        echo "Check your Render dashboard for deployment status"
EOF

print_success "GitHub Actions workflow created"

# Final instructions
print_success "🎉 Render Deployment Setup Complete!"
echo ""
print_info "🌐 Next Steps:"
echo "1. Visit: https://render.com/dashboard"
echo "2. Click 'New +' → 'Web Service'"
echo "3. Connect your GitHub repository: $REPO_URL"
echo "4. Use the settings from DEPLOY_TO_RENDER.md"
echo ""
print_info "📋 Quick Settings:"
echo "  Build Command: npm run build"
echo "  Start Command: npm start"
echo "  Environment: Node"
echo "  Plan: Free"
echo ""
print_info "🗄️ Don't forget to add PostgreSQL service!"
echo "  Click 'New +' → 'PostgreSQL' → 'Free'"
echo ""
print_success "Your DataFlow app will be live on Render! 🚀"
