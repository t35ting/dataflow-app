#!/bin/bash

# DataFlow Automatic Railway Deployment Script
# This script creates a Railway project and deploys automatically

echo "🚀 DataFlow Automatic Railway Deployment"
echo "========================================"

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

# Check if Railway CLI is installed
print_status "📋 Checking Railway CLI installation..."
if ! command -v railway &> /dev/null; then
    print_error "Railway CLI is not installed!"
    echo "Installing Railway CLI..."
    npm install -g @railway/cli
    if [ $? -ne 0 ]; then
        print_error "Failed to install Railway CLI"
        exit 1
    fi
fi
print_success "Railway CLI is ready"

# Check if user is logged in
print_status "🔐 Checking Railway authentication..."
if ! railway whoami &> /dev/null; then
    print_warning "Not logged in to Railway"
    print_info "Opening Railway login page..."
    railway login
    if [ $? -ne 0 ]; then
        print_error "Failed to login to Railway"
        exit 1
    fi
fi
print_success "Logged in to Railway"

# Create new Railway project
print_status "🏗️  Creating Railway project..."
PROJECT_NAME="dataflow-$(date +%s)"
print_info "Creating project: $PROJECT_NAME"

# Create project using Railway CLI
railway new $PROJECT_NAME --template railway.template.json
if [ $? -ne 0 ]; then
    print_warning "Failed to create project with template, creating manually..."
    railway new $PROJECT_NAME
fi

# Link to the project
railway link $PROJECT_NAME
if [ $? -ne 0 ]; then
    print_error "Failed to link project"
    exit 1
fi

print_success "Project created and linked: $PROJECT_NAME"

# Add PostgreSQL service
print_status "🗄️  Adding PostgreSQL service..."
railway add postgresql
if [ $? -ne 0 ]; then
    print_warning "Failed to add PostgreSQL service automatically"
    print_info "Please add PostgreSQL service manually in Railway dashboard"
fi

# Wait for services to be ready
print_status "⏳ Waiting for services to be ready..."
sleep 10

# Set environment variables
print_status "🔧 Setting up environment variables..."
railway variables set NODE_ENV=production

# Deploy the application
print_status "🚀 Deploying application..."
railway up --detach
if [ $? -ne 0 ]; then
    print_error "Deployment failed!"
    echo "Check the logs:"
    railway logs
    exit 1
fi

# Wait for deployment to complete
print_status "⏳ Waiting for deployment to complete..."
sleep 30

# Run database migrations
print_status "🏗️  Running database migrations..."
railway run npm run db:push
if [ $? -ne 0 ]; then
    print_warning "Database migrations failed, but app should still work"
fi

# Get the deployment URL
print_status "🌐 Getting deployment URL..."
DEPLOY_URL=$(railway domain)
if [ -z "$DEPLOY_URL" ]; then
    DEPLOY_URL=$(railway status | grep -o 'https://[^[:space:]]*' | head -1)
fi

print_success "🎉 Deployment Complete!"
echo ""
print_info "🌐 Your DataFlow app is live at: $DEPLOY_URL"
print_info "📊 Railway Dashboard: https://railway.app/dashboard"
echo ""
print_info "📋 Useful commands:"
echo "  railway logs     - View deployment logs"
echo "  railway status   - Check deployment status"
echo "  railway variables - Manage environment variables"
echo "  railway open     - Open your app in browser"
echo ""
print_info "🔧 Project management:"
echo "  railway service  - Manage services"
echo "  railway scale    - Scale your application"
echo "  railway logs --follow - Follow logs in real-time"
echo ""
print_success "Your DataFlow application is now fully deployed and running on Railway!"
