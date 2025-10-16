# Bunny Edge Scripting Deployment Guide

## 🚀 Complete Migration from Railway to Bunny Edge Scripting

This guide will help you deploy your anime streaming site using **only** Bunny.net services, eliminating the need for Railway entirely.

## 📋 What You'll Need

- Bunny.net account with Edge Scripting enabled
- Your existing Bunny CDN credentials
- GitHub account (for deployment)

## 🎯 Benefits of Bunny Edge Scripting

✅ **No Railway needed** - Complete serverless solution  
✅ **Faster performance** - Code runs at the edge, closer to users  
✅ **Lower costs** - No separate backend hosting fees  
✅ **Simpler architecture** - Everything in one ecosystem  
✅ **Better integration** - Direct access to your Bunny CDN data  

## 🔧 Step 1: Prepare Your Edge Script

1. **Copy the edge script**: Use the `bunny-edge-script.js` file provided
2. **Update configuration**: Edit these variables in the script:
   ```javascript
   const BUNNY_API_KEY = 'your-api-key-here';
   const LIBRARY_ID = 'your-library-id';
   const DELIVERY_DOMAIN = 'your-cdn-domain.b-cdn.net';
   ```

## 🌐 Step 2: Deploy to Bunny Edge Scripting

### Option A: Deploy via Bunny Dashboard (Recommended for testing)

1. **Login to Bunny.net Dashboard**
2. **Navigate to Edge Scripting**
3. **Create New Script**
   - Name: `ishanime-api`
   - Type: **Standalone Script**
   - Region: Choose closest to your users
4. **Paste the script code** from `bunny-edge-script.js`
5. **Save and Deploy**

### Option B: Deploy via GitHub (Recommended for production)

1. **Create GitHub Repository**
   ```bash
   git init
   git add bunny-edge-script.js
   git commit -m "Add Bunny Edge Scripting for Ishrealmanime"
   git remote add origin https://github.com/yourusername/ishanime-edge-script.git
   git push -u origin main
   ```

2. **Connect to Bunny Edge Scripting**
   - In Bunny Dashboard → Edge Scripting
   - Click "Deploy from GitHub"
   - Connect your GitHub account
   - Select your repository
   - Choose the script file
   - Deploy

## 🔗 Step 3: Update Your Frontend

1. **Get your Edge Script URL** from Bunny Dashboard
   - Format: `https://your-script-name.bunnycdn.com`
   - Or use your custom domain if configured

2. **Update `script.js`**
   ```javascript
   const API_URL = 'https://your-script-name.bunnycdn.com';
   ```

3. **Test the endpoints**:
   - Health: `https://your-script-name.bunnycdn.com/api/health`
   - Anime: `https://your-script-name.bunnycdn.com/api/anime`
   - Site: `https://your-script-name.bunnycdn.com/api/site`

## 🎨 Step 4: Deploy Your Frontend

### Option A: Vercel (Recommended)
```bash
npm install -g vercel
vercel --prod
```

### Option B: Bunny CDN Static Hosting
1. Upload your frontend files to Bunny Storage
2. Create a Pull Zone
3. Point your domain to the Pull Zone

## 🔧 Step 5: Configure Custom Domain (Optional)

1. **In Bunny Dashboard → Edge Scripting**
2. **Add Custom Domain**
3. **Update DNS records** as instructed
4. **Update frontend API_URL** to use your custom domain

## 📊 Step 6: Test Your Setup

1. **Health Check**: Visit `https://your-domain.com/api/health`
2. **Anime API**: Visit `https://your-domain.com/api/anime`
3. **Frontend**: Visit your frontend URL
4. **Verify**: Check that anime loads and videos play

## 🚨 Troubleshooting

### Common Issues:

**❌ CORS Errors**
- Edge Script includes CORS headers
- Check browser console for specific errors

**❌ API Key Issues**
- Verify your Bunny API key is correct
- Check Library ID and Delivery Domain

**❌ No Anime Data**
- Ensure videos are uploaded to your Bunny Video Library
- Check video titles follow the format: "Show Name - Episode X"

**❌ Script Not Deploying**
- Check JavaScript syntax in the edge script
- Verify all required variables are set

## 📈 Performance Benefits

| Metric | Railway | Bunny Edge Scripting |
|--------|---------|---------------------|
| Cold Start | 2-5 seconds | < 50ms |
| Global Latency | 100-300ms | 10-50ms |
| Monthly Cost | $5-20+ | $0-5 |
| Setup Complexity | High | Low |

## 🔄 Migration Checklist

- [ ] Deploy Bunny Edge Script
- [ ] Update frontend API_URL
- [ ] Test all endpoints
- [ ] Deploy frontend
- [ ] Configure custom domain (optional)
- [ ] Remove Railway deployment
- [ ] Update DNS if needed

## 🎉 You're Done!

Your anime streaming site now runs entirely on Bunny.net:
- **Frontend**: Vercel or Bunny CDN
- **Backend API**: Bunny Edge Scripting
- **Video Storage**: Bunny CDN
- **No Railway needed!**

## 📞 Support

If you encounter issues:
1. Check Bunny Edge Scripting logs in dashboard
2. Verify your Bunny CDN configuration
3. Test endpoints individually
4. Check browser console for errors

---

**Result**: Faster, cheaper, and simpler anime streaming platform! 🚀
