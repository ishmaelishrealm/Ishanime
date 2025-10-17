# 🚀 Bunny Edge Scripting Deployment Steps

## 🎯 Current Status:
- ✅ **Frontend**: Working (Vercel)
- ❌ **Backend**: Not deployed (Failed to fetch)
- ✅ **Script**: Ready in `/backend` folder

## 🔧 Step-by-Step Deployment:

### Step 1: Go to Bunny Dashboard
1. Visit: `https://dash.bunny.net/scripts/`
2. Find your script: **Ishanime API** (ID: 47325)
3. Click on it to open

### Step 2: Deploy from GitHub
1. In the script view, click **"Redeploy with GitHub"**
2. Choose these settings:
   - **Repository**: `ishmaelishrealm/Ishanime`
   - **Branch**: `master` (or `main`)
   - **Directory path**: `backend/`
3. Click **"Deploy Script"**
4. Wait 10-20 seconds for deployment

### Step 3: Verify Deployment
Test these URLs in your browser:

1. **Health Check**: `https://ishanime-api-pzssf.bunny.run/api/health`
   - Expected: `{"status": "healthy", "service": "Ishanime Bunny Edge Scripting API"}`

2. **Anime List**: `https://ishanime-api-pzssf.bunny.run/api/anime`
   - Expected: JSON array of anime objects

3. **Site Config**: `https://ishanime-api-pzssf.bunny.run/api/site`
   - Expected: Site configuration JSON

### Step 4: Test Frontend
1. Visit: `https://ishanime.vercel.app`
2. Refresh the page
3. Should see: ✅ "Connected to backend - Loading real anime content..."
4. Anime list should load (not demo mode)

## 🚨 If Deployment Fails:

### Check GitHub Actions:
1. Go to: `https://github.com/ishmaelishrealm/Ishanime/actions`
2. Look for: "Deploy Bunny Edge Script Backend"
3. Check if it ran successfully

### Check GitHub Secrets:
Go to: `https://github.com/ishmaelishrealm/Ishanime/settings/secrets/actions`

Make sure you have:
- `BUNNY_SCRIPT_ID`: `47325`
- `BUNNY_DEPLOYMENT_KEY`: `d48c50f9-f1df-4993-a87913c67bbc-ec3f-4bf4`

### Manual Deployment:
If GitHub Actions fails, you can also:
1. Copy the content of `backend/bunny-edge-script.js`
2. Paste it directly in Bunny Dashboard editor
3. Click "Deploy"

## 🎌 Success Criteria:

- [ ] Backend URL returns JSON data
- [ ] Frontend shows "Connected to backend"
- [ ] Anime list loads (not demo mode)
- [ ] Videos play correctly

## 🚀 Quick Commands:

```bash
# Trigger deployment
git add .
git commit -m "Trigger Bunny Edge Script deployment"
git push origin master
```

**Once deployed, your complete anime streaming platform will be live!** 🎌
