#!/bin/bash

# DataFlow Railway One-Click Deployment Script
# This script handles the complete deployment process

echo "🚀 DataFlow Railway One-Click Deployment"
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print colored output
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

# Check if Railway CLI is installed
print_status "📋 Checking Railway CLI installation..."
if ! command -v railway &> /dev/null; then
    print_error "Railway CLI is not installed!"
    echo "Please install Railway CLI first:"
    echo "  npm install -g @railway/cli"
    echo "  or visit: https://docs.railway.app/develop/cli"
    exit 1
fi
print_success "Railway CLI is installed"

# Check if user is logged in
print_status "🔐 Checking Railway authentication..."
if ! railway whoami &> /dev/null; then
    print_error "Not logged in to Railway!"
    echo "Please login first:"
    echo "  railway login"
    exit 1
fi
print_success "Logged in to Railway"

# Check if project is linked
print_status "📁 Checking project status..."
if ! railway status &> /dev/null; then
    print_warning "Project not linked to Railway yet"
    print_status "Linking project..."
    railway link
fi
print_success "Project is linked to Railway"

# Check for PostgreSQL service
print_status "🗄️  Checking for PostgreSQL service..."
if ! railway variables | grep -q "DATABASE_URL"; then
    print_warning "No PostgreSQL service found!"
    echo "Please add a PostgreSQL service in your Railway dashboard:"
    echo "1. Go to your Railway project"
    echo "2. Click 'New' → 'Database' → 'PostgreSQL'"
    echo "3. Railway will automatically set DATABASE_URL"
    echo ""
    read -p "Press Enter after adding PostgreSQL service..."
fi

# Run database migrations
print_status "🏗️  Running database migrations..."
if railway run npm run db:push; then
    print_success "Database migrations completed"
else
    print_warning "Database migrations failed, but continuing with deployment"
fi

# Deploy the application
print_status "🚀 Deploying to Railway..."
print_status "This may take a few minutes..."

if railway up --detach; then
    print_success "Deployment successful!"
    echo ""
    print_status "🌐 Your app is now live on Railway!"
    print_status "Check your Railway dashboard for the URL"
    echo ""
    print_status "📊 Useful commands:"
    echo "  railway logs     - View deployment logs"
    echo "  railway status   - Check deployment status"
    echo "  railway variables - Manage environment variables"
    echo "  railway open     - Open your app in browser"
else
    print_error "Deployment failed!"
    echo "Check the logs for more details:"
    echo "  railway logs"
    exit 1
fi

echo ""
print_success "🎉 Deployment complete!"
print_status "Your DataFlow application is now live on Railway!"
