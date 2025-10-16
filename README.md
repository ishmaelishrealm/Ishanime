# 🎌 Ishrealmanime - Bunny Edge Scripting API

A serverless anime streaming platform powered by Bunny.net Edge Scripting, replacing traditional backend servers with edge computing.

## 🚀 Features

- **Serverless Backend**: Runs on Bunny Edge Scripting (no Railway needed!)
- **Global Performance**: < 50ms response times worldwide
- **Cost Effective**: $0-5/month vs $5-20+ for traditional hosting
- **Auto-scaling**: Handles traffic spikes automatically
- **CORS Enabled**: Ready for frontend integration

## 📡 API Endpoints

| Endpoint | Description | Example |
|----------|-------------|---------|
| `GET /api/health` | Health check and status | `/api/health` |
| `GET /api/anime` | All anime shows and episodes | `/api/anime` |
| `GET /api/site` | Site configuration | `/api/site` |
| `GET /api/anime/{slug}` | Individual anime details | `/api/anime/solo-leveling` |

## 🔧 Configuration

Update these variables in `bunny-edge-script.js`:

```javascript
const BUNNY_API_KEY = 'your-bunny-api-key';
const LIBRARY_ID = 'your-video-library-id';
const DELIVERY_DOMAIN = 'your-cdn-domain.b-cdn.net';
```

## 🚀 Deployment

### Option 1: Bunny Dashboard (Quick Start)

1. **Login to [Bunny Dashboard](https://dash.bunny.net)**
2. **Go to Edge Scripting**
3. **Create New Script**:
   - Name: `ishanime-api`
   - Type: **Standalone Script**
   - Region: Choose closest to your users
4. **Paste the code** from `bunny-edge-script.js`
5. **Save and Deploy**

### Option 2: GitHub Integration (Recommended)

1. **Fork this repository**
2. **Update configuration** in `bunny-edge-script.js`
3. **Connect to Bunny Dashboard**:
   - Go to Edge Scripting
   - Click "Deploy from GitHub"
   - Connect your GitHub account
   - Select this repository
   - Choose `bunny-edge-script.js`
4. **Deploy**

## 🌐 Frontend Integration

Update your frontend `script.js`:

```javascript
// Replace with your actual Edge Script URL
const API_URL = 'https://your-script-name.bunnycdn.com';
```

## 🧪 Testing

Test your deployed script:

```bash
# Health check
curl https://your-script-name.bunnycdn.com/api/health

# Get all anime
curl https://your-script-name.bunnycdn.com/api/anime

# Get site config
curl https://your-script-name.bunnycdn.com/api/site
```

## 📊 Performance

| Metric | Traditional Backend | Bunny Edge Scripting |
|--------|-------------------|---------------------|
| Cold Start | 2-5 seconds | < 50ms |
| Global Latency | 100-300ms | 10-50ms |
| Monthly Cost | $5-20+ | $0-5 |
| Setup Time | Hours | Minutes |

## 🔍 How It Works

1. **Video Storage**: Videos stored in Bunny Video Library
2. **Edge Script**: Fetches video metadata via Bunny API
3. **Global Distribution**: Script runs at edge locations worldwide
4. **Frontend**: Your HTML/JS frontend calls the edge script API
5. **Result**: Lightning-fast anime streaming platform

## 📁 Project Structure

```
├── bunny-edge-script.js    # Main Edge Scripting code
├── package.json           # Project configuration
├── .github/
│   └── workflows/
│       └── deploy-to-bunny.yml  # GitHub Actions workflow
├── README.md              # This file
└── BUNNY_EDGE_SCRIPTING_GUIDE.md  # Detailed deployment guide
```

## 🛠️ Development

1. **Clone the repository**
2. **Update configuration** in `bunny-edge-script.js`
3. **Test locally** (optional - use Bunny Dashboard for testing)
4. **Deploy via GitHub** or Bunny Dashboard

## 🔧 Troubleshooting

### Common Issues:

**❌ CORS Errors**
- Edge Script includes proper CORS headers
- Check browser console for specific errors

**❌ No Anime Data**
- Verify Bunny API key and Library ID
- Ensure videos follow naming convention: "Show Name - Episode X"

**❌ Script Deployment Fails**
- Check JavaScript syntax
- Verify all required variables are set
- Check Bunny Dashboard logs

## 📈 Monitoring

Monitor your Edge Script in Bunny Dashboard:
- **Request Count**: Track API usage
- **Response Times**: Monitor performance
- **Error Rates**: Check for issues
- **Geographic Distribution**: See global usage

## 🎯 Benefits Over Railway

- ✅ **No cold starts** - Always ready
- ✅ **Global edge locations** - Faster worldwide
- ✅ **Lower costs** - Pay only for usage
- ✅ **Simpler setup** - No server management
- ✅ **Better integration** - Native Bunny CDN access

## 📞 Support

- **Bunny Documentation**: [Edge Scripting Guide](https://docs.bunny.net/docs/edge-scripting)
- **Issues**: Create GitHub issues for bugs
- **Discussions**: Use GitHub Discussions for questions

## 📄 License

MIT License - feel free to use and modify!

---

**Built with ❤️ for the anime community** 🎌
