# 🚀 DataFlow - Free Deployment Guide

## Choose Your Free Hosting Platform

### Option 1: **Vercel** (Recommended for React Apps)
**Best for**: Frontend-heavy applications with API routes

#### Steps:
1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel --prod
   ```

4. **Your app will be live at**: `https://your-project-name.vercel.app`

---

### Option 2: **Netlify** (Great for Static Sites)
**Best for**: Static sites with serverless functions

#### Steps:
1. **Connect GitHub**:
   - Go to [netlify.com](https://netlify.com)
   - Connect your GitHub repository
   - Set build command: `npm run netlify-build`
   - Set publish directory: `dist/public`

2. **Your app will be live at**: `https://your-project-name.netlify.app`

---

### Option 3: **Render** (Full-Stack Apps)
**Best for**: Full-stack applications with databases

#### Steps:
1. **Connect GitHub**:
   - Go to [render.com](https://render.com)
   - Connect your GitHub repository
   - Set build command: `npm run render-build`
   - Set start command: `npm start`

2. **Your app will be live at**: `https://your-project-name.onrender.com`

---

### Option 4: **GitHub Pages** (Static Only)
**Best for**: Pure static sites

#### Steps:
1. **Build the client**:
   ```bash
   npm run build:client
   ```

2. **Deploy to GitHub Pages**:
   - Go to repository Settings > Pages
   - Select source: GitHub Actions
   - Create `.github/workflows/deploy.yml`

3. **Your app will be live at**: `https://yourusername.github.io/repository-name`

---

## 🔧 Environment Variables

Set these in your hosting platform dashboard:

```bash
NODE_ENV=production
PORT=8080
SESSION_SECRET=your-secret-key-here
# Add DATABASE_URL if you want database functionality
```

## 📦 Build Commands

- **Full Build**: `npm run build`
- **Client Only**: `npm run build:client`
- **Server Only**: `npm run build:server`

## 🌐 Live URLs

After deployment, your app will be available at:
- **Vercel**: `https://your-project.vercel.app`
- **Netlify**: `https://your-project.netlify.app`
- **Render**: `https://your-project.onrender.com`

## 🎯 Features

Your deployed DataFlow app includes:
- ✅ LeetCode Problem Management
- ✅ CSV Upload & Processing
- ✅ Analytics Dashboard
- ✅ Responsive Design
- ✅ RESTful API

## 🆓 Free Tier Limits

- **Vercel**: 100GB bandwidth/month, unlimited static sites
- **Netlify**: 100GB bandwidth/month, 300 build minutes/month
- **Render**: 750 hours/month, sleep after 15min inactivity
- **GitHub Pages**: 1GB storage, 100GB bandwidth/month

---

**Choose the platform that best fits your needs and follow the steps above!**
