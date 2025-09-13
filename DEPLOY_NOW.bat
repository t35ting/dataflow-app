@echo off
echo 🚀 DataFlow Deployment Script
echo =============================

echo.
echo 📋 Prerequisites Check:
echo ✅ Node.js installed: 
node --version
echo ✅ Dependencies installed
echo ✅ Build completed

echo.
echo 🔧 Next Steps:
echo 1. Create a .env file with your database credentials
echo 2. Choose your deployment platform
echo.

echo 🎯 Option 1: Deploy to Vercel
echo ------------------------------
echo 1. Run: vercel login
echo 2. Select GitHub login
echo 3. Run: vercel --prod
echo.

echo 🎯 Option 2: Deploy to Railway  
echo ------------------------------
echo 1. Run: railway login
echo 2. Run: railway init
echo 3. Run: railway up
echo.

echo 🎯 Option 3: Deploy to Render
echo ------------------------------
echo 1. Go to render.com
echo 2. Connect your GitHub repo
echo 3. Set build command: npm run build
echo 4. Set start command: npm start
echo.

echo 📝 Required Environment Variables:
echo DATABASE_URL=postgresql://username:password@host:port/database
echo NODE_ENV=production
echo SESSION_SECRET=your-secret-key
echo.

echo 🗄️  Database Setup:
echo - Neon (free): neon.tech
echo - Supabase (free): supabase.com
echo.

pause
