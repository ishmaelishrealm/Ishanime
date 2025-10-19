# 🎌 Ishrealmanime - Modern Anime Streaming Platform

A fast, serverless anime streaming platform powered by Bunny.net Video Library and Vercel, featuring automatic video synchronization and a beautiful dark theme.

## 🚀 Features

- **🎬 Video Streaming**: Direct MP4, HLS, and iframe playback options
- **📱 Responsive Design**: Beautiful dark theme with pink accents
- **🔄 Auto-Sync**: Automatically detects new uploads from Bunny Video Library
- **⚡ Fast Loading**: Static JSON approach for instant page loads
- **🎮 Monetization**: Integrated GrabTap sponsorship popup
- **🌐 Global CDN**: Bunny.net CDN for worldwide fast delivery
- **📊 Smart Caching**: Only updates when new content is detected

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Bunny Video   │    │   GitHub Actions │    │     Vercel      │
│    Library      │───▶│   (Every 2hrs)   │───▶│   Frontend      │
│                 │    │                  │    │                 │
│ • Video Storage │    │ • Fetch Videos   │    │ • Static Site   │
│ • CDN Delivery  │    │ • Generate JSON  │    │ • Auto Deploy   │
│ • API Access    │    │ • Smart Updates  │    │ • Global Edge   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 📡 How It Works

1. **Video Storage**: Videos uploaded to Bunny Video Library
2. **Auto-Detection**: GitHub Actions checks for new uploads every 2 hours
3. **JSON Generation**: Script fetches video metadata and creates `anime.json`
4. **Frontend**: Static site consumes the JSON for instant loading
5. **Playback**: Multiple video formats (MP4, HLS, iframe) for compatibility

## 🎬 Video Formats Supported

- **Direct MP4**: `https://vz-a01fffb9-e7a.b-cdn.net/{video-id}/play_720p.mp4`
- **HLS Stream**: `https://vz-a01fffb9-e7a.b-cdn.net/{video-id}/playlist.m3u8`
- **Iframe Player**: `https://iframe.mediadelivery.net/play/506159/{video-id}`

## 🔧 Configuration

### Bunny Video Library Setup

1. **Create Video Library** at [Bunny Dashboard](https://dash.bunny.net)
2. **Upload Videos** with naming convention: `Show Name - Episode X`
3. **Get API Key** from Video Library settings
4. **Update Configuration** in `scripts/generate-anime-json.js`:

```javascript
const BUNNY_API_KEY = 'your-bunny-api-key';
const LIBRARY_ID = 'your-video-library-id';
const CDN_HOSTNAME = 'your-cdn-domain.b-cdn.net';
```

### GitHub Secrets

Add these secrets to your GitHub repository:

- `BUNNY_API_KEY`: Your Bunny Video Library API key
- `LIBRARY_ID`: Your video library ID
- `CDN_HOSTNAME`: Your CDN hostname

## 🚀 Deployment

### 1. Frontend (Vercel)

1. **Connect GitHub** to [Vercel](https://vercel.com)
2. **Import Repository** - Vercel auto-detects static site
3. **Deploy** - Automatic deployment on every push

### 2. Backend Sync (GitHub Actions)

The workflow automatically:
- ✅ Runs every 2 hours
- ✅ Fetches videos from Bunny Video Library
- ✅ Generates `anime.json` with video metadata
- ✅ Only commits when new content is detected
- ✅ Triggers Vercel redeployment

## 📁 Project Structure

```
├── frontend/
│   ├── index.html          # Main anime browsing page
│   ├── player.html         # Dedicated video player page
│   ├── script.js           # Frontend JavaScript
│   ├── styles.css          # Dark theme styling
│   ├── anime.json          # Auto-generated video data
│   └── public/assets/      # Logo and static assets
├── scripts/
│   ├── generate-anime-json.js  # Video sync script
│   └── package.json        # Node.js dependencies
├── .github/workflows/
│   └── update-anime-json.yml   # Auto-sync workflow
└── vercel.json             # Vercel configuration
```

## 🎮 Player Features

- **Multiple Formats**: Auto-detects best playback method
- **Quality Options**: 1080p, 720p, 480p support
- **Episode Navigation**: Easy episode switching
- **Fullscreen Support**: Immersive viewing experience
- **Mobile Optimized**: Touch-friendly controls

## 💰 Monetization

- **GrabTap Integration**: Gaming sponsorship popup
- **Non-intrusive**: Appears after 10 seconds
- **User-friendly**: "Later" option available
- **Revenue Sharing**: Supports site maintenance

## 🧪 Testing

### Local Development

```bash
# Install dependencies
cd scripts
npm install

# Generate anime.json locally
node generate-anime-json.js

# Test frontend locally
cd frontend
python -m http.server 8000
```

### Production Testing

```bash
# Test video URLs
curl -I "https://vz-a01fffb9-e7a.b-cdn.net/{video-id}/play_720p.mp4"

# Test iframe player
curl -I "https://iframe.mediadelivery.net/play/506159/{video-id}"
```

## 🔍 Troubleshooting

### Videos Not Playing

1. **Check CORS Settings** in Bunny Video Library
2. **Verify CDN Hostname** in configuration
3. **Test Direct URLs** in browser
4. **Check Browser Console** for errors

### Sync Issues

1. **Verify API Key** has correct permissions
2. **Check GitHub Actions** logs
3. **Ensure Video Naming** follows convention
4. **Test Script Locally** first

### Performance Issues

1. **Check CDN Status** at Bunny Dashboard
2. **Monitor GitHub Actions** frequency
3. **Optimize Video Sizes** in Bunny Library
4. **Check Vercel** deployment status

## 📊 Performance Metrics

| Metric | Value |
|--------|-------|
| Page Load Time | < 1 second |
| Video Start Time | < 2 seconds |
| Global CDN | 200+ locations |
| Uptime | 99.9% |
| Cost | $0-5/month |

## 🔄 Auto-Sync Features

- **Smart Detection**: Only updates when new videos found
- **Efficient**: Compares video counts before processing
- **Reliable**: Handles API errors gracefully
- **Fast**: 2-hour check intervals (configurable)

## 🎨 Customization

### Theme Colors

Update `frontend/styles.css`:

```css
:root {
    --primary-color: #ff2e97;    /* Pink accent */
    --background: #0a0a0a;       /* Dark background */
    --surface: #1a1a2e;          /* Card background */
}
```

### Player Settings

Modify `frontend/script.js`:

```javascript
let playerMode = 'iframe';  // 'auto', 'direct', 'hls', 'iframe'
```

## 📞 Support

- **Bunny Documentation**: [Video Library Guide](https://docs.bunny.net/docs/stream)
- **Vercel Documentation**: [Static Sites](https://vercel.com/docs/concepts/static-sites)
- **GitHub Issues**: Report bugs and feature requests

## 📄 License

MIT License - feel free to use and modify!

---

**Built with ❤️ for the anime community** 🎌

*Powered by Bunny.net CDN and Vercel*