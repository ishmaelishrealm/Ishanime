# 🔄 Bunny Edge Scripting 508 Loop Fix Guide

## 🚨 **Issue**: 508 Loop Detected Error

**Cause**: Bunny Edge Script is trying to fetch from itself, creating an infinite recursion loop.

## ✅ **Your Script Analysis - CLEAN!**

I've checked your `backend/bunny-edge-script.js` and it's **correctly configured**:

### ✅ **Correct API Call** (Line 28):
```javascript
const response = await fetch(`https://video.bunnycdn.com/library/${LIBRARY_ID}/videos`, {
    headers: {
        'AccessKey': BUNNY_API_KEY,
        'Accept': 'application/json'
    }
});
```

### ✅ **No Self-References Found**:
- ❌ No `fetch('https://ishanime-api-pzssf.bunny.run/...')`
- ❌ No `fetch('https://ishanime-api-us2hj.b-cdn.net/...')`
- ❌ No self-referencing API calls

### ✅ **Only Video URLs** (Line 9):
```javascript
const DELIVERY_DOMAIN = 'vz-a01fffb9-e7a.b-cdn.net';
```
This is used for video URLs, not API calls - **this is correct**.

## 🔧 **Possible Causes & Solutions**

### Cause 1: Cached Script Version
**Solution**: Force redeploy the script
1. Go to: `https://dash.bunny.net/scripts/`
2. Find your script (ID: 47325)
3. Click **"Redeploy"** or **"Redeploy with GitHub"**
4. Wait 2-3 minutes

### Cause 2: GitHub Actions Deployment Issue
**Solution**: Check and retrigger deployment
1. Go to: `https://github.com/ishmaelishrealm/Ishanime/actions`
2. Look for failed "Deploy Bunny Edge Script Backend" runs
3. If failed, check logs for errors
4. Push a small change to retrigger:
```bash
git add .
git commit -m "Retrigger Bunny Edge Script deployment"
git push origin master
```

### Cause 3: Script ID Mismatch
**Solution**: Verify correct script ID
- Your script ID: `47325`
- Make sure GitHub secrets match this ID

### Cause 4: Multiple Script Versions
**Solution**: Check for duplicate scripts
1. Go to: `https://dash.bunny.net/scripts/`
2. Look for multiple scripts with similar names
3. Delete any old/duplicate scripts
4. Keep only the active one (ID: 47325)

## 🧪 **Testing Steps**

### Step 1: Test Health Endpoint
```bash
# Test the health endpoint
curl https://ishanime-api-pzssf.bunny.run/api/health
```

**Expected Response**:
```json
{
  "status": "healthy",
  "timestamp": "2025-01-16T...",
  "service": "Ishanime Bunny Edge Scripting API",
  "version": "1.0.0"
}
```

### Step 2: Test Anime Endpoint
```bash
# Test the anime endpoint
curl https://ishanime-api-pzssf.bunny.run/api/anime
```

**Expected Response**:
```json
{
  "success": true,
  "data": [...],
  "count": 5,
  "timestamp": "2025-01-16T..."
}
```

### Step 3: Check Frontend
1. Visit: `https://ishanime.vercel.app`
2. Open browser console (F12)
3. Should see: ✅ "Connected to backend - Loading real anime content..."
4. No more "Backend not connected - Using demo mode"

## 🚨 **If Still Getting 508 Error**

### Debug Steps:
1. **Check Bunny Dashboard Logs**:
   - Go to your script in Bunny dashboard
   - Look for error logs or deployment status

2. **Verify Script Content**:
   - Make sure the deployed script matches your local version
   - Check for any accidental modifications

3. **Test with Minimal Script**:
   - Temporarily replace your script with a simple health check
   - Deploy and test
   - If it works, gradually add back functionality

## 🎯 **Success Criteria**

- [ ] Health endpoint returns JSON (not 508)
- [ ] Anime endpoint returns JSON (not 508)
- [ ] Frontend connects successfully
- [ ] No console errors
- [ ] Videos load and play

## 🚀 **Quick Fix Commands**

```bash
# Force redeploy
git add .
git commit -m "Force Bunny Edge Script redeploy - fix 508 loop"
git push origin master

# Check deployment status
# Go to: https://github.com/ishmaelishrealm/Ishanime/actions
```

**Your script is correctly written - the 508 error is likely a deployment or caching issue that should resolve with a redeploy!** 🎌
