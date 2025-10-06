# 🚀 DataFlow - Railway Deployment Guide

This guide will help you deploy your DataFlow application to Railway, a modern cloud platform for deploying applications.

## 📋 Prerequisites

- [Railway account](https://railway.app) (free tier available)
- [Railway CLI](https://docs.railway.app/develop/cli) installed
- Git repository (GitHub, GitLab, or Bitbucket)

## 🛠️ Quick Setup

### 1. Install Railway CLI
```bash
npm install -g @railway/cli
```

### 2. Login to Railway
```bash
railway login
```

### 3. Deploy Your Project

#### Option A: Using the deployment script (Recommended)
```bash
# Windows
./deploy-railway.bat

# PowerShell
./deploy-railway.ps1
```

#### Option B: Manual deployment
```bash
# Link your project to Railway
railway link

# Deploy
railway up
```

## 🗄️ Database Setup

### 1. Add PostgreSQL Service
1. Go to your Railway project dashboard
2. Click "New" → "Database" → "PostgreSQL"
3. Railway will automatically set the `DATABASE_URL` environment variable

### 2. Run Database Migrations
```bash
railway run npm run db:push
```

## 🔧 Environment Variables

Railway will automatically set these variables:
- `NODE_ENV=production`
- `PORT` (automatically assigned)
- `DATABASE_URL` (when PostgreSQL service is added)

## 📊 Project Structure

```
DataFlow/
├── client/                 # React frontend
├── server/                 # Express.js backend
├── shared/                 # Shared schemas and types
├── railway.json           # Railway configuration
├── deploy-railway.ps1     # PowerShell deployment script
├── deploy-railway.bat     # Windows batch deployment script
└── RAILWAY_DEPLOYMENT.md  # Detailed deployment guide
```

## 🚀 Deployment Process

1. **Build Process**: Railway runs `npm run build` which:
   - Builds the React frontend with Vite
   - Bundles the Express.js server with esbuild

2. **Start Process**: Railway runs `npm start` which:
   - Starts the production server
   - Serves both API and static files

3. **Health Check**: Railway monitors `/health` endpoint

## 🔍 Monitoring & Management

### View Logs
```bash
railway logs
```

### Check Status
```bash
railway status
```

### Open App
```bash
railway open
```

### Manage Environment Variables
```bash
railway variables
```

## 🛠️ Troubleshooting

### Common Issues

1. **Build Failures**
   - Ensure all dependencies are in `package.json`
   - Test build locally: `npm run build`

2. **Database Connection Issues**
   - Verify PostgreSQL service is running
   - Check `DATABASE_URL` is set correctly
   - Run migrations: `railway run npm run db:push`

3. **Port Issues**
   - Railway sets `PORT` automatically
   - App uses `process.env.PORT || 5000`

### Getting Help

- [Railway Documentation](https://docs.railway.app)
- [Railway Discord](https://discord.gg/railway)
- Check logs: `railway logs`

## 📈 Features

Your deployed DataFlow app includes:

- ✅ **CSV Import/Export**: Upload and manage LeetCode problems
- ✅ **Problem Management**: Add, edit, delete problems
- ✅ **Analytics Dashboard**: Track progress and statistics
- ✅ **Search & Filtering**: Find problems by difficulty, status, tags
- ✅ **Notes System**: Add personal notes to problems
- ✅ **Responsive Design**: Works on desktop and mobile

## 🔗 Useful Links

- [Railway Dashboard](https://railway.app/dashboard)
- [Railway CLI Documentation](https://docs.railway.app/develop/cli)
- [Railway Pricing](https://railway.app/pricing)

---

**Happy coding! 🎉**

Your DataFlow application is now live on Railway and ready to help you track your LeetCode progress!
