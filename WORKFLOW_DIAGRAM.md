# 🌐 IshrealAnime Workflow Diagram

## Visual Deployment Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    GitHub Repository: IshrealAnime              │
│  ┌─────────────────┐              ┌─────────────────────────┐   │
│  │    frontend/    │              │       backend/          │   │
│  │  index.html     │              │ bunny-edge-script.js    │   │
│  │  script.js      │              │ edge.config.json        │   │
│  │  styles.css     │              │ package.json            │   │
│  │  vercel.json    │              │                         │   │
│  └─────────┬───────┘              └─────────────┬───────────┘   │
│            │ push to main                        │ push to main │
│            ▼                                      ▼              │
└─────────────────────────────────────────────────────────────────┘
            │                                      │
            ▼                                      ▼
┌─────────────────────┐              ┌─────────────────────────┐
│   Vercel Auto-Deploy│              │  GitHub Actions         │
│   (Git Integration) │              │  + Bunny Deployment     │
│                     │              │                         │
│  ✅ No tokens needed│              │  ✅ Uses 2 secrets      │
│  ✅ No workflows    │              │  ✅ Automatic deploy    │
└─────────┬───────────┘              └─────────────┬───────────┘
          │                                        │
          ▼                                        ▼
┌─────────────────────┐              ┌─────────────────────────┐
│  Frontend Live      │              │   Backend Live          │
│                     │              │                         │
│ https://ishanime.   │              │ https://ishanime-api-   │
│ vercel.app          │              │ pzssf.bunny.run         │
│                     │              │                         │
│  • HTML/CSS/JS      │              │  • /api/anime           │
│  • Static files     │              │  • /api/health          │
│  • No build needed  │              │  • /api/site            │
└─────────┬───────────┘              └─────────────┬───────────┘
          │                                        │
          │              API Connection            │
          │  ┌─────────────────────────────────┐   │
          └──┤  Frontend fetches anime data    ├───┘
             │  from Bunny Edge Script         │
             │                                 │
             │  fetch('https://ishanime-api-  │
             │  pzssf.bunny.run/api/anime')    │
             └─────────────────────────────────┘
```

## Key Points

1. **Frontend**: Pure static files → Vercel auto-deploys
2. **Backend**: Bunny Edge Script → GitHub Actions deploys
3. **Connection**: Frontend fetches data from backend API
4. **No Railway**: Completely serverless solution
5. **Automatic**: Both deploy on every push

## Benefits

✅ **Simple**: Only 2 GitHub secrets needed  
✅ **Fast**: Global CDN for both frontend and backend  
✅ **Cheap**: No server costs, only CDN usage  
✅ **Reliable**: Automatic deployments, no manual steps  
✅ **Scalable**: Handles traffic spikes automatically  

## Deployment Commands

```bash
# Make changes to frontend or backend
git add .
git commit -m "Update anime platform"
git push origin master

# That's it! Both deploy automatically:
# - Frontend → Vercel
# - Backend → Bunny Edge Script
```
