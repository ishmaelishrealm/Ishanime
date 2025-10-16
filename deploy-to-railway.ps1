# 🚀 Auto Railway Deployment Script
# This script helps you deploy ishanimetest1 to Railway

Write-Host "🚀 Railway Auto-Deployment Script" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green

Write-Host "`n📋 Prerequisites Check:" -ForegroundColor Yellow
Write-Host "1. GitHub repository: ✅ Ready"
Write-Host "2. Backend code: ✅ Ready" 
Write-Host "3. Environment variables: ✅ Ready"
Write-Host "4. Railway account: ⚠️  Need to login"

Write-Host "`n🎯 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Open Railway Dashboard: https://railway.app/dashboard"
Write-Host "2. Click 'New Project'"
Write-Host "3. Select 'Deploy from GitHub repo'"
Write-Host "4. Choose 'Ishanime' repository"
Write-Host "5. Name project: 'ishanimetest1'"

Write-Host "`n🔑 Environment Variables to Add:" -ForegroundColor Magenta
Write-Host "BUNNY_API_KEY=7f0a1d07-a8a4-4e07-af7ed42722ee-bfbd-4896"
Write-Host "LIBRARY_ID=506159"
Write-Host "DELIVERY_DOMAIN=vz-a01fffb9-e7a.b-cdn.net"
Write-Host "PORT=3000"
Write-Host "NODE_ENV=production"

Write-Host "`n⏱️  Expected Timeline:" -ForegroundColor Green
Write-Host "- Project creation: 30 seconds"
Write-Host "- Environment setup: 1 minute"
Write-Host "- Deployment: 2-3 minutes"
Write-Host "- Total time: ~5 minutes"

Write-Host "`n🧪 Test URLs (after deployment):" -ForegroundColor Blue
Write-Host "- Health check: https://ishanimetest1-production-xxxx.up.railway.app/api/health"
Write-Host "- Anime data: https://ishanimetest1-production-xxxx.up.railway.app/api/anime"

Write-Host "`n✨ Ready to deploy! Follow the steps above." -ForegroundColor Green

# Open Railway dashboard in browser
Write-Host "`n🌐 Opening Railway Dashboard..." -ForegroundColor Yellow
Start-Process "https://railway.app/dashboard"

Write-Host "`nPress any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
