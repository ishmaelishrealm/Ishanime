# 🚀 Quick Railway Environment Variables Setup

## Copy & Paste These Variables:

Go to your Railway project → Variables tab → Add these one by one:

```
BUNNY_API_KEY=7f0a1d07-a8a4-4e07-af7ed42722ee-bfbd-4896
```

```
LIBRARY_ID=506159
```

```
DELIVERY_DOMAIN=vz-a01fffb9-e7a.b-cdn.net
```

```
PORT=3000
```

```
NODE_ENV=production
```

## 🎯 Quick Steps:

1. **Go to Railway Dashboard**: https://railway.app/dashboard
2. **Click your project** (ishanimetest1 or old one)
3. **Click "Variables" tab**
4. **Click "New Variable"** for each one above
5. **Railway will auto-redeploy** when you add them

## ✅ After Adding Variables:

Your backend will automatically:
- Connect to Bunny CDN
- Fetch your videos
- Serve them to the frontend

## 🧪 Test URLs:

After deployment completes, test:
- `https://your-railway-url/api/health`
- `https://your-railway-url/api/anime`

---

**This should fix the "no videos showing" issue!** 🎌✨
