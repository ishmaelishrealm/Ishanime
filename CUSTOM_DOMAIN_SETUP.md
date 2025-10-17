# 🌐 Custom Domain Setup for Bunny Edge Scripting

## 🎯 **Goal**: Connect `api.ishanime.com` to your Bunny Edge Script

### Current Setup:
- **Backend URL**: `https://ishanime-api-pzssf.bunny.run`
- **Target**: `https://api.ishanime.com`

---

## 📋 **Step-by-Step Namecheap Setup**

### Step 1: Access Namecheap DNS
1. Go to: `https://namecheap.com`
2. Click **"Domain List"** on the left
3. Find your domain: `ishanime.com`
4. Click **"Manage"** next to it
5. Go to **"Advanced DNS"** tab

### Step 2: Add CNAME Record
In the **"Host Records"** section, add:

| Type | Host | Value | TTL |
|------|------|-------|-----|
| **CNAME** | `api` | `ishanime-api-pzssf.bunny.run` | **Automatic** |

**What this does:**
- Creates: `api.ishanime.com`
- Points to: `ishanime-api-pzssf.bunny.run`

### Step 3: Wait for DNS Propagation
- **Time**: 5-30 minutes
- **Check**: `ping api.ishanime.com`
- **Online Check**: `https://dnschecker.org`

---

## 🐰 **Bunny Edge Scripting Setup**

### Step 1: Add Custom Domain
1. Go to: `https://dash.bunny.net/scripts/`
2. Find your script (ID: 47325)
3. Go to **"Hostnames"** tab
4. Click **"Add Hostname"**
5. Enter: `api.ishanime.com`
6. Click **"Add"**

### Step 2: Enable SSL
1. In the **"Hostnames"** tab
2. Find `api.ishanime.com`
3. Click **"Enable SSL"**
4. Wait for green lock icon (free SSL from Bunny)

### Step 3: Force SSL (Optional)
1. Toggle **"Force SSL"** to **ON**
2. This redirects HTTP → HTTPS automatically

---

## 🔄 **Update Frontend**

### Step 1: Update API URL
In `frontend/script.js`, change:

```javascript
// Before
const API_URL = 'https://ishanime-api-pzssf.bunny.run';

// After
const API_URL = 'https://api.ishanime.com';
```

### Step 2: Test New Endpoints
After setup, test these URLs:

1. **Health**: `https://api.ishanime.com/api/health`
2. **Anime**: `https://api.ishanime.com/api/anime`
3. **Site**: `https://api.ishanime.com/api/site`

---

## ✅ **Success Criteria**

- [ ] DNS propagates: `api.ishanime.com` resolves
- [ ] SSL enabled: Green lock icon in Bunny
- [ ] Backend responds: JSON data from custom domain
- [ ] Frontend updated: Points to custom domain
- [ ] No CORS errors: Custom domain works

---

## 🚨 **Troubleshooting**

### If DNS Doesn't Resolve:
- Wait longer (up to 24 hours)
- Check CNAME record spelling
- Verify domain ownership

### If SSL Fails:
- Wait for SSL certificate generation
- Check hostname is added in Bunny
- Verify DNS is fully propagated

### If Backend Returns 404:
- Check Bunny hostname configuration
- Verify script is deployed
- Test original Bunny URL still works

---

## 🎌 **Benefits of Custom Domain**

✅ **Professional**: `api.ishanime.com` looks better  
✅ **Stable**: Won't change if you recreate script  
✅ **Branded**: Matches your domain  
✅ **SSL**: Free HTTPS from Bunny  
✅ **Fast**: Same Bunny CDN performance  

**Once set up, your anime streaming platform will have a professional custom API domain!** 🚀
