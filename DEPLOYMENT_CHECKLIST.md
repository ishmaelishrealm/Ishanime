# 🐇 Bunny Edge Script + Frontend Sync Checklist

## ✅ Step 1: Verify Bunny Script Deployment

### 1.1 Check Bunny Dashboard
- [ ] Go to **Bunny Dashboard → Scripts → Standalone Script**
- [ ] Find your script ID: `47325`
- [ ] Check deployment status: Should be "Deployed" or "Active"

### 1.2 Test Deployment URL
Test these endpoints in your browser:

- [ ] **Health Check**: `https://ishanime-api-pzssf.bunny.run/api/health`
  - Expected: `{"status": "healthy", "timestamp": "...", "service": "Ishanime Bunny Edge Scripting API"}`
  
- [ ] **Anime List**: `https://ishanime-api-pzssf.bunny.run/api/anime`
  - Expected: JSON array of anime objects

- [ ] **Site Info**: `https://ishanime-api-pzssf.bunny.run/api/site`
  - Expected: Site configuration JSON

### 1.3 If 404 Errors
- [ ] Redeploy script from Bunny Dashboard
- [ ] Check GitHub Actions workflow ran successfully
- [ ] Verify secrets are correct in GitHub

## ✅ Step 2: Verify Frontend Configuration

### 2.1 Check API URL
- [ ] Open `frontend/script.js`
- [ ] Confirm line 12: `const API_URL = 'https://ishanime-api-pzssf.bunny.run';`
- [ ] Verify no Railway references remain

### 2.2 Check Frontend Files
- [ ] `frontend/index.html` exists
- [ ] `frontend/script.js` exists  
- [ ] `frontend/styles.css` exists
- [ ] `frontend/vercel.json` exists

## ✅ Step 3: Deploy Frontend

### 3.1 GitHub Secrets (Required)
Add these to `https://github.com/ishmaelishrealm/Ishanime/settings/secrets/actions`:

- [ ] `VERCEL_TOKEN`: `YhTst2rzEULthYyHCMRzkDA7`
- [ ] `VERCEL_PROJECT_ID`: `prj_dVs35euHJ9mbpAgWlbxBZ0LF2WaA`
- [ ] `VERCEL_ORG_ID`: `ishmaels-projects-2dd9b02f`
- [ ] `BUNNY_SCRIPT_ID`: `47325`
- [ ] `BUNNY_DEPLOYMENT_KEY`: `d48c50f9-f1df-4993-a87913c67bbc-ec3f-4bf4`

### 3.2 Trigger Deployment
- [ ] Push changes to GitHub: `git push origin master`
- [ ] Check GitHub Actions: `https://github.com/ishmaelishrealm/Ishanime/actions`
- [ ] Verify both workflows run successfully:
  - "Deploy Frontend to Vercel"
  - "Deploy Bunny Edge Script Backend"

## ✅ Step 4: Test Complete System

### 4.1 Test Frontend
- [ ] Visit: `https://ishanime.vercel.app`
- [ ] Open browser console (F12)
- [ ] Check for any fetch errors
- [ ] Verify anime list loads
- [ ] Test video playback

### 4.2 Test API Connection
- [ ] Console should show successful API calls
- [ ] No 404 errors in network tab
- [ ] Anime data displays correctly

## 🚨 Troubleshooting

### If Frontend Shows 404
1. Check Vercel deployment logs
2. Verify frontend files are in `/frontend` folder
3. Check `vercel.json` configuration

### If API Returns 404
1. Test Bunny Edge Script URL directly in browser
2. Redeploy script from Bunny Dashboard
3. Check GitHub Actions workflow for backend deployment

### If Videos Don't Play
1. Check Bunny CDN video URLs are accessible
2. Verify CORS headers in Edge Script
3. Check browser console for video loading errors

## 🎯 Success Criteria
- [ ] Frontend loads at `https://ishanime.vercel.app`
- [ ] API responds at `https://ishanime-api-pzssf.bunny.run/api/anime`
- [ ] Anime list displays correctly
- [ ] Videos play without errors
- [ ] No console errors
- [ ] No Railway dependencies

## 🚀 Final Result
Your complete anime streaming platform will be:
- **Frontend**: Vercel (fast, global CDN)
- **Backend**: Bunny Edge Scripting (serverless, fast)
- **Storage**: Bunny CDN (videos and thumbnails)
- **Deployment**: Automatic on every push
- **Cost**: Much cheaper than Railway