# 🚀 IshrealAnime Architecture Overview

## 📁 Repository Structure
```
/ishanime-repo
├── /frontend/                    # Static HTML/CSS/JS
│   ├── index.html               # Main page
│   ├── script.js                # Frontend logic
│   ├── styles.css               # Styling
│   └── vercel.json              # Vercel config
├── /backend/                     # Bunny Edge Script
│   ├── bunny-edge-script.js     # API backend
│   ├── edge.config.json         # Bunny config
│   └── package.json             # Metadata
└── .github/workflows/            # CI/CD
    ├── deploy-frontend.yml       # Vercel deployment
    └── deploy-backend.yml        # Bunny deployment
```

## 🌐 Deployment Flow

### Frontend (Vercel)
```
GitHub Push → Vercel Auto-Deploy → https://ishanime.vercel.app
```

### Backend (Bunny Edge Scripting)
```
GitHub Push → GitHub Actions → Bunny Edge Scripting → https://ishanime-api-pzssf.bunny.run
```

## 🔗 Connection Flow
```
User visits https://ishanime.vercel.app
    ↓
Frontend loads (HTML/CSS/JS)
    ↓
JavaScript fetches from https://ishanime-api-pzssf.bunny.run/api/anime
    ↓
Bunny Edge Script returns JSON data
    ↓
Frontend displays anime list and videos
```

## ✅ Benefits
- **No Railway**: Completely serverless
- **Separate Deployments**: Frontend and backend deploy independently
- **No Build Process**: Pure static files
- **Global CDN**: Fast worldwide performance
- **Automatic Updates**: Deploy on every push
