# 🚀 DataFlow - LeetCode Problem Tracker

A modern, responsive web application for managing and tracking LeetCode problems with analytics and CSV import capabilities.

## ✨ Features

- 📊 **Analytics Dashboard** - Visual insights into your coding progress
- 📁 **CSV Import/Export** - Bulk upload LeetCode problems
- 🔍 **Search & Filter** - Find problems by difficulty, tags, or status
- 📱 **Responsive Design** - Works perfectly on all devices
- 🎨 **Modern UI** - Built with React, TypeScript, and Tailwind CSS
- ⚡ **Fast Performance** - Optimized build and efficient data handling

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Express.js + Node.js
- **Database**: PostgreSQL (with Drizzle ORM)
- **Build Tool**: Vite
- **UI Components**: Radix UI + shadcn/ui

## 🚀 Live Demo

**Deployed on Netlify**: [Your live URL will appear here]

## 📦 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/dataflow-app.git
cd dataflow-app

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production
```bash
npm run build
```

## 🌐 Deployment

This project is configured for easy deployment on multiple platforms:

### Netlify (Recommended)
- Automatic builds from GitHub
- Free hosting with 100GB bandwidth/month
- Custom domain support

### Vercel
- Excellent for React applications
- Serverless functions support
- Global CDN

### Render
- Full-stack application support
- PostgreSQL database hosting
- Auto-deploy from GitHub

## 📁 Project Structure

```
DataFlow/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utilities and helpers
├── server/                 # Express backend
│   ├── routes.ts          # API routes
│   ├── data-loader.ts     # Data loading logic
│   └── storage.ts         # Database operations
├── shared/                # Shared types and schemas
└── dist/                  # Production build output
```

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```bash
NODE_ENV=production
DATABASE_URL=postgresql://username:password@host:port/database
SESSION_SECRET=your-secret-key-here
```

## 📊 Features Overview

### Analytics Dashboard
- Problem difficulty distribution
- Completion status tracking
- Progress visualization
- Performance metrics

### CSV Management
- Upload LeetCode problems in bulk
- Validate data format
- Export filtered results
- Preview before import

### Problem Management
- Add/edit/delete problems
- Tag and categorize
- Mark completion status
- Add personal notes

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [LeetCode](https://leetcode.com/) for the problem data structure
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Vite](https://vitejs.dev/) for the fast build tool
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework

---

**Built with ❤️ for the coding community**
