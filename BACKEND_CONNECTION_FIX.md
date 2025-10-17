# 🔗 Backend Connection Fix Guide

## 🚨 Current Issue:
**"Backend not connected - Using demo mode"**

This means your frontend is deployed but can't reach your Bunny Edge Scripting backend.

## 🔍 Step 1: Check Backend Deployment

### Test Your Backend URL:
Open these URLs in your browser:

1. **Health Check**: `https://ishanime-api-pzssf.bunny.run/api/health`
2. **Anime List**: `https://ishanime-api-pzssf.bunny.run/api/anime`
3. **Site Config**: `https://ishanime-api-pzssf.bunny.run/api/site`

### Expected Results:
✅ **Success**: JSON response with data
❌ **404/Error**: Backend not deployed or misconfigured

## 🔧 Step 2: Fix Backend Deployment

### Option A: Check GitHub Actions
1. Go to: `https://github.com/ishmaelishrealm/Ishanime/actions`
2. Look for: "Deploy Bunny Edge Script Backend"
3. Check if it ran successfully (green checkmark)
4. If failed, check the logs for errors

### Option B: Check GitHub Secrets
Go to: `https://github.com/ishmaelishrealm/Ishanime/settings/secrets/actions`

Make sure you have these **2 secrets**:

| Secret Name | Value |
|-------------|-------|
| `BUNNY_SCRIPT_ID` | `47325` |
| `BUNNY_DEPLOYMENT_KEY` | `d48c50f9-f1df-4993-a87913c67bbc-ec3f-4bf4` |

### Option C: Manual Bunny Dashboard Deployment
1. Go to: `https://dash.bunny.net/edge/scripts`
2. Find your script (ID: 47325)
3. Click "Deploy" or "Redeploy"
4. Wait for deployment to complete

## 🎯 Step 3: Test Connection

### After Backend is Live:
1. **Test backend URL**: `https://ishanime-api-pzssf.bunny.run/api/health`
2. **Visit frontend**: `https://ishanime.vercel.app`
3. **Check console**: Open F12 → Console tab
4. **Look for**: No more "Backend not connected" message

## 🚨 Troubleshooting

### If Backend Returns 404:
- Script not deployed from GitHub
- Wrong script ID or deployment key
- Bunny Edge Scripting service issue

### If Backend Returns 403:
- API key or permissions issue
- Bunny CDN access restrictions

### If Frontend Still Shows Demo Mode:
- Clear browser cache
- Check browser console for CORS errors
- Verify API_URL in script.js is correct

## 🎌 Success Criteria

- [ ] Backend URL returns JSON data
- [ ] Frontend loads anime list (not demo mode)
- [ ] No console errors
- [ ] Videos play correctly

## 🚀 Quick Fix Commands

```bash
# Trigger backend deployment
git add .
git commit -m "Trigger backend deployment"
git push origin master

# Check GitHub Actions after push
# Go to: https://github.com/ishmaelishrealm/Ishanime/actions
```

**Once the backend is live, your anime streaming platform will be fully functional!** 🎌
