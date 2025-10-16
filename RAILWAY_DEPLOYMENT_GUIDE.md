# Railway Deployment Guide - ishanimetest1

## 🚀 Quick Deployment Steps

### 1. Create New Railway Project
1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your `Ishanime` repository
5. **Name the project: `ishanimetest1`**

### 2. Configure Environment Variables
In Railway dashboard, go to your project settings and add these environment variables:

```
BUNNY_API_KEY=your_actual_bunny_api_key
LIBRARY_ID=your_actual_library_id
DELIVERY_DOMAIN=your_actual_delivery_domain
PORT=3000
NODE_ENV=production
```

### 3. Railway Auto-Deploy Settings
Railway will automatically:
- Detect the `railway.json` configuration
- Install dependencies from `server/package.json`
- Start the server with `npm start`
- Set up health checks on `/api/health`

### 4. Get Your Railway URL
After deployment, Railway will provide a URL like:
`https://ishanimetest1-production-xxxx.up.railway.app`

### 5. Update Frontend
Once you have the Railway URL, update:
- `script.js` - Change `API_URL` to your new Railway URL
- `vercel.json` - Update the proxy destination

## 🔧 Backend Features

### API Endpoints
- `GET /api/health` - Health check
- `GET /api/anime` - Get all anime data with episodes
- `GET /api/site` - Get site information

### Features
- ✅ Bunny CDN integration
- ✅ Episode sorting (oldest first)
- ✅ Multiple video qualities (480p, 720p, 1080p)
- ✅ Thumbnail previews
- ✅ 5-minute caching
- ✅ CORS enabled
- ✅ Error handling
- ✅ Health checks

### Video Sources Priority
1. Direct MP4 1080p
2. Direct MP4 720p  
3. Direct MP4 480p
4. HLS Stream
5. Iframe (fallback)

## 🐛 Troubleshooting

### If deployment fails:
1. Check environment variables are set correctly
2. Verify Bunny CDN credentials
3. Check Railway logs for errors

### If frontend can't connect:
1. Verify Railway URL is correct
2. Check CORS settings
3. Test `/api/health` endpoint directly

## 📝 Next Steps After Deployment

1. **Test the backend**: Visit `https://your-railway-url/api/health`
2. **Update frontend**: Change API_URL in `script.js`
3. **Update Vercel**: Change proxy in `vercel.json`
4. **Deploy frontend**: Push changes to trigger Vercel redeploy
5. **Test complete flow**: Verify anime loads and videos play

---

**Ready to deploy!** 🚀
