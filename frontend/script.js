// Configuration
// 🚀 Using Static JSON - Fastest, most reliable approach!
// Pre-generated anime.json updated every 5 minutes via GitHub Actions
const ANIME_JSON_URL = '/anime.json'; // ✅ Static JSON file
let animeData = [];
let currentFilter = 'all';
let currentAnime = null;
let currentEpisodeIndex = 0;
let isPlaying = false;

// Player preferences
let useIframeFallback = false; // Set to true to allow iframe fallback
let playerMode = 'iframe'; // 'auto', 'direct', 'hls', 'iframe' - iframe is default

// Toggle iframe fallback function
function toggleIframeFallback() {
    useIframeFallback = !useIframeFallback;
    console.log(`🔄 Iframe fallback ${useIframeFallback ? 'enabled' : 'disabled'}`);
    
    // Reload current episode with new settings
    if (currentAnime && currentAnime.episodes && currentAnime.episodes[currentEpisodeIndex]) {
        openPlayer(currentAnime.episodes[currentEpisodeIndex], currentAnime);
    }
}

// Change player mode
function setPlayerMode(mode) {
    playerMode = mode;
    console.log(`🎮 Player mode changed to: ${mode}`);
    
    // Reload current episode with new mode
    if (currentAnime && currentAnime.episodes && currentAnime.episodes[currentEpisodeIndex]) {
        openPlayer(currentAnime.episodes[currentEpisodeIndex], currentAnime);
    }
}

// Test thumbnail URL accessibility
async function testThumbnailUrl(url) {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        console.log(`🖼️ Thumbnail test: ${url} - Status: ${response.status}`);
        return response.ok;
    } catch (error) {
        console.log(`❌ Thumbnail test failed: ${url} - Error: ${error.message}`);
        return false;
    }
}

// Force refresh all thumbnails
function refreshThumbnails() {
    console.log('🔄 Refreshing all thumbnails...');
    const thumbnails = document.querySelectorAll('.show-thumbnail');
    thumbnails.forEach(img => {
        const originalSrc = img.src;
        img.src = '';
        img.src = originalSrc;
        console.log(`🔄 Refreshed: ${originalSrc}`);
    });
}

// Test all thumbnail URLs
async function testAllThumbnails() {
    console.log('🧪 Testing all thumbnail URLs...');
    if (animeData.length === 0) {
        console.log('❌ No anime data loaded');
        return;
    }
    
    for (const anime of animeData.slice(0, 3)) { // Test first 3 anime
        const firstEpisode = anime.episodes?.[0];
        if (firstEpisode) {
            const thumbnail = firstEpisode.thumbnailPreview || firstEpisode.thumbnail;
            if (thumbnail) {
                await testThumbnailUrl(thumbnail);
            }
        }
    }
}

// Individual playback functions
function playDirectVideo(episode) {
    const videoPlayer = document.getElementById('videoPlayer');
    const videoContainer = document.getElementById('videoContainer');
    
    // Clear any existing iframe
    const existingIframe = videoContainer.querySelector('iframe');
    if (existingIframe) {
        existingIframe.remove();
    }
    
    // Clear background image
    if (videoContainer) {
        videoContainer.style.backgroundImage = 'none';
    }
    
    // Show video player
    videoPlayer.style.display = 'block';
    videoPlayer.style.width = '100%';
    videoPlayer.style.height = '100%';
    
    // Try different MP4 qualities - use the correct Bunny CDN format
    const mp4Urls = [
        { url: `https://vz-a01fffb9-e7a.b-cdn.net/${episode.id}/play_1080p.mp4`, quality: '1080p' },
        { url: `https://vz-a01fffb9-e7a.b-cdn.net/${episode.id}/play_720p.mp4`, quality: '720p' },
        { url: `https://vz-a01fffb9-e7a.b-cdn.net/${episode.id}/play_480p.mp4`, quality: '480p' },
        { url: `https://vz-a01fffb9-e7a.b-cdn.net/${episode.id}/play.mp4`, quality: 'default' }
    ];
    
    console.log('🔍 Available MP4 URLs:', mp4Urls);
    console.log('🎬 Episode ID:', episode.id);
    
    for (const mp4 of mp4Urls) {
        if (mp4.url) {
            console.log(`🎬 Trying Direct MP4 ${mp4.quality}:`, mp4.url);
            videoPlayer.src = mp4.url;
            
            // Add event listeners for debugging
            videoPlayer.onloadstart = () => console.log(`✅ ${mp4.quality} started loading`);
            videoPlayer.oncanplay = () => console.log(`✅ ${mp4.quality} can play`);
            videoPlayer.onerror = (e) => console.log(`❌ ${mp4.quality} error:`, e);
            
            // Test if URL is accessible
            testVideoUrl(mp4.url, mp4.quality);
            return true;
        }
    }
    
    console.log('❌ No direct MP4 URLs available');
    return false;
}

// Test if video URL is accessible
async function testVideoUrl(url, quality) {
    try {
        console.log(`🧪 Testing ${quality} URL: ${url}`);
        const response = await fetch(url, { method: 'HEAD' });
        console.log(`📊 ${quality} URL Status: ${response.status} ${response.statusText}`);
        
        if (response.ok) {
            console.log(`✅ ${quality} URL is accessible`);
        } else {
            console.log(`❌ ${quality} URL failed: ${response.status}`);
        }
    } catch (error) {
        console.log(`❌ ${quality} URL error: ${error.message}`);
    }
}

// Manual test function for debugging
function testCurrentVideo() {
    const videoPlayer = document.getElementById('videoPlayer');
    const iframe = document.getElementById('bunnyIframe');
    
    console.log('🔍 Current video debug info:');
    console.log('  Video Player src:', videoPlayer.src);
    console.log('  Video Player readyState:', videoPlayer.readyState);
    console.log('  Video Player networkState:', videoPlayer.networkState);
    console.log('  Video Player error:', videoPlayer.error);
    console.log('  Video Player paused:', videoPlayer.paused);
    console.log('  Video Player currentTime:', videoPlayer.currentTime);
    console.log('  Video Player duration:', videoPlayer.duration);
    console.log('  Video Player display:', videoPlayer.style.display);
    
    if (iframe) {
        console.log('  Iframe src:', iframe.src);
        console.log('  Iframe display:', iframe.style.display);
    }
    
    // Test current episode URLs
    if (currentAnime && currentAnime.episodes && currentAnime.episodes[currentEpisodeIndex]) {
        const episode = currentAnime.episodes[currentEpisodeIndex];
        console.log('🧪 Testing all URLs for current episode:', episode.id);
        
        // Test all possible URLs
        const testUrls = [
            { url: `https://vz-a01fffb9-e7a.b-cdn.net/${episode.id}/play_1080p.mp4`, type: 'Direct MP4 1080p' },
            { url: `https://vz-a01fffb9-e7a.b-cdn.net/${episode.id}/play_720p.mp4`, type: 'Direct MP4 720p' },
            { url: `https://vz-a01fffb9-e7a.b-cdn.net/${episode.id}/play_480p.mp4`, type: 'Direct MP4 480p' },
            { url: `https://vz-a01fffb9-e7a.b-cdn.net/${episode.id}/play.mp4`, type: 'Direct MP4 Default' },
            { url: `https://vz-a01fffb9-e7a.b-cdn.net/${episode.id}/playlist.m3u8`, type: 'HLS Stream' },
            { url: `https://iframe.mediadelivery.net/play/506159/${episode.id}`, type: 'Iframe Player' }
        ];
        
        testUrls.forEach(test => {
            testVideoUrl(test.url, test.type);
        });
    }
    
    if (videoPlayer.src) {
        testVideoUrl(videoPlayer.src, 'Current Video Player');
    }
}

function playHLSVideo(episode) {
    const videoPlayer = document.getElementById('videoPlayer');
    const videoContainer = document.getElementById('videoContainer');
    
    // Clear any existing iframe
    const existingIframe = videoContainer.querySelector('iframe');
    if (existingIframe) {
        existingIframe.remove();
    }
    
    // Clear background image
    if (videoContainer) {
        videoContainer.style.backgroundImage = 'none';
    }
    
    // Show video player
    videoPlayer.style.display = 'block';
    videoPlayer.style.width = '100%';
    videoPlayer.style.height = '100%';
    
    // Use the correct HLS URL format
    const hlsUrl = `https://vz-a01fffb9-e7a.b-cdn.net/${episode.id}/playlist.m3u8`;
    
    console.log('🎬 HLS Stream:', hlsUrl);
    console.log('🎬 Episode ID:', episode.id);
    
    videoPlayer.src = hlsUrl;
    
    // Add event listeners for debugging
    videoPlayer.onloadstart = () => console.log('✅ HLS started loading');
    videoPlayer.oncanplay = () => console.log('✅ HLS can play');
    videoPlayer.onerror = (e) => console.log('❌ HLS error:', e);
    
    // Test if URL is accessible
    testVideoUrl(hlsUrl, 'HLS');
    return true;
}

function playIframeVideo(episode) {
    const videoPlayer = document.getElementById('videoPlayer');
    const videoContainer = document.getElementById('videoContainer');
    
    // Clear any existing iframe first
    const existingIframe = videoContainer.querySelector('iframe');
    if (existingIframe) {
        existingIframe.remove();
    }
    
    // Use the correct iframe URL format
    const iframeUrl = `https://iframe.mediadelivery.net/play/506159/${episode.id}`;
    
    console.log('🎬 Iframe Player (Default):', iframeUrl);
    console.log('🎬 Episode ID:', episode.id);
    
    const iframe = document.createElement('iframe');
    iframe.id = 'bunnyIframe';
    iframe.src = iframeUrl;
    iframe.style.cssText = `
        width: 100%;
        height: 100%;
        border: none;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 10;
    `;
    iframe.allowFullscreen = true;
    iframe.allow = 'autoplay; fullscreen; picture-in-picture';
    iframe.setAttribute('loading', 'lazy');
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-presentation');
    
    // Hide video player and show iframe
    videoPlayer.style.display = 'none';
    
    // Set background image for the container
    if (videoContainer) {
        videoContainer.style.backgroundImage = `url('/public/assets/ishanime-logo.png')`;
        videoContainer.style.backgroundSize = 'contain';
        videoContainer.style.backgroundRepeat = 'no-repeat';
        videoContainer.style.backgroundPosition = 'center';
    }
    
    // Add iframe to container
    videoContainer.appendChild(iframe);
    
    // Add load event listener
    iframe.onload = function() {
        console.log('✅ Iframe loaded successfully');
    };
    
    iframe.onerror = function() {
        console.log('❌ Iframe failed to load');
    };
    
    // Test if URL is accessible
    testVideoUrl(iframeUrl, 'Iframe');
    return true;
}

// Add player mode selector to the player section
function addPlayerModeSelector() {
    const playerSection = document.getElementById('playerSection');
    let selector = document.getElementById('playerModeSelector');
    
    if (!selector) {
        selector = document.createElement('div');
        selector.id = 'playerModeSelector';
        selector.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            z-index: 1000;
            background: rgba(0,0,0,0.8);
            padding: 10px;
            border-radius: 8px;
            color: white;
        `;
        
        selector.innerHTML = `
            <label style="display: block; margin-bottom: 5px; font-size: 12px;">Player Mode:</label>
            <select id="playerModeSelect" onchange="setPlayerMode(this.value)" style="
                background: #333;
                color: white;
                border: 1px solid #555;
                border-radius: 4px;
                padding: 5px;
                font-size: 12px;
            ">
                <option value="auto">Auto</option>
                <option value="direct">Direct MP4</option>
                <option value="hls">HLS Stream</option>
                <option value="iframe" selected>Iframe (Default)</option>
            </select>
        `;
        
        playerSection.appendChild(selector);
    }
    
    // Set current mode
    const select = document.getElementById('playerModeSelect');
    if (select) {
        select.value = playerMode;
    }
}

// Revert to simple player logic (previous stable version)

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    if (window.__ISH_INIT_DONE) return;
    window.__ISH_INIT_DONE = true;
    checkBackendStatus();
    loadSiteConfig();
    loadAnime();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // Video player events
    const videoPlayer = document.getElementById('videoPlayer');
    videoPlayer.addEventListener('play', () => {
        isPlaying = true;
        updatePlayPauseIcon();
    });
    
    videoPlayer.addEventListener('pause', () => {
        isPlaying = false;
        updatePlayPauseIcon();
    });
    
    videoPlayer.addEventListener('ended', () => {
        nextEpisode();
    });
}

// Check backend status
async function checkBackendStatus() {
    const statusElement = document.getElementById('backendStatus');
    
    try {
        console.log('🔍 Testing static JSON availability...');
        console.log('🌐 JSON URL:', ANIME_JSON_URL);
        const response = await fetch(ANIME_JSON_URL);
        console.log('📡 JSON response status:', response.status);
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Static JSON loaded:', data);
            statusElement.innerHTML = `
                <div class="status-content">
                    <div class="status-icon">✅</div>
                    <p>Static JSON loaded - ${data.count || 0} anime shows available</p>
                </div>
            `;
            // Hide status after 3 seconds
            setTimeout(() => {
                statusElement.style.display = 'none';
            }, 3000);
        } else {
            console.log('❌ JSON load failed with status:', response.status);
            showBackendError();
        }
    } catch (error) {
        console.error('❌ Static JSON load failed:', error);
        console.error('❌ Error details:', error.message);
        showBackendError();
    }
}

// Show backend error
function showBackendError() {
    const statusElement = document.getElementById('backendStatus');
    statusElement.innerHTML = `
        <div class="status-content">
            <div class="status-icon">⚠️</div>
            <p>Static JSON not available - Using demo mode</p>
            <p style="font-size: 0.8em; margin-top: 5px; opacity: 0.7;">
                Check console (F12) for connection details
            </p>
        </div>
    `;
}

// Load site configuration (static for now)
async function loadSiteConfig() {
    // Static site configuration - no API call needed
    const config = {
        name: 'Ishrealmanime',
        description: 'Your ultimate anime streaming destination',
        domain: 'ishanime.me',
        version: '1.0.0',
        features: {
            multipleVideoQualities: true,
            adaptiveStreaming: true,
            thumbnailPreviews: true,
            episodeOrdering: 'oldest-first',
            staticJson: true,
            autoUpdate: '5 minutes'
        }
    };
    updateSiteBranding(config);
}

// Update site branding from backend
function updateSiteBranding(config) {
    // Update logo if provided
    if (config.logo) {
        const logo = document.querySelector('.logo');
        if (logo) {
            logo.src = config.logo;
        }
    }
    
    // Update site name if provided
    if (config.siteName) {
        const siteName = document.querySelector('.site-name');
        if (siteName) {
            siteName.textContent = config.siteName;
        }
    }
    
    // Update page title
    if (config.siteName) {
        document.title = `${config.siteName} - Modern Anime Streaming Platform`;
    }
    
    console.log('🎨 Site branding updated from backend:', config);
}

// Load anime from static JSON
async function loadAnime() {
    showLoading();
    
    try {
        console.log('🔄 Loading anime from static JSON...');
        console.log('🌐 JSON URL:', ANIME_JSON_URL);
        const response = await fetch(ANIME_JSON_URL);
        console.log('📡 JSON response status:', response.status);
        
        if (response.ok) {
            const data = await response.json();
            console.log('📊 JSON response data:', data);
            
            if (data.success && data.data && data.data.length > 0) {
                animeData = data.data;
                console.log(`✅ Loaded ${animeData.length} anime shows from static JSON`);
                console.log(`🕒 Last updated: ${data.timestamp}`);
                
                // Debug first anime to check thumbnail URLs
                if (animeData.length > 0) {
                    const firstAnime = animeData[0];
                    console.log('🔍 First anime debug:', {
                        title: firstAnime.title,
                        episodes: firstAnime.episodes?.length || 0,
                        firstEpisode: firstAnime.episodes?.[0] ? {
                            thumbnail: firstAnime.episodes[0].thumbnail,
                            thumbnailPreview: firstAnime.episodes[0].thumbnailPreview
                        } : 'No episodes'
                    });
                }
                
                displayAnime(animeData);
            } else {
                console.log('⚠️ No anime data in JSON, using demo data');
                loadDemoAnime();
            }
        } else {
            console.log('❌ JSON request failed, using demo data');
            loadDemoAnime();
        }
    } catch (error) {
        console.error('❌ Failed to load anime from static JSON:', error);
        console.error('❌ Error details:', error.message);
        
        // Show user-friendly error message
        const statusElement = document.getElementById('backendStatus');
        if (statusElement) {
            statusElement.innerHTML = `
                <div class="status-content">
                    <div class="status-icon">❌</div>
                    <p>Static JSON load failed: ${error.message}</p>
                    <p>Check if anime.json exists and is accessible</p>
                </div>
            `;
            statusElement.style.display = 'block';
        }
        
        loadDemoAnime();
    } finally {
        hideLoading();
    }
}

// Load demo anime if backend is not available
function loadDemoAnime() {
    console.log('🎭 Loading demo anime data...');
    animeData = [
        {
            id: 'demo-1',
            title: 'Demon Slayer: Kimetsu no Yaiba',
            slug: 'demon-slayer',
            episodes: [
                {
                    id: 'demo-ep-1-1',
                    episode: '01',
                    title: 'Cruelty',
                    videoUrl: 'https://iframe.mediadelivery.net/embed/506159/demo-ep-1-1',
                    directMp4: 'https://vz-a01fffb9-e7a.b-cdn.net/demo-ep-1-1/play_720p.mp4',
                    thumbnail: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&h=225&fit=crop'
                },
                {
                    id: 'demo-ep-1-2',
                    episode: '02',
                    title: 'Trainer Sakonji Urokodaki',
                    videoUrl: 'https://iframe.mediadelivery.net/embed/506159/demo-ep-1-2',
                    directMp4: 'https://vz-a01fffb9-e7a.b-cdn.net/demo-ep-1-2/play_720p.mp4',
                    thumbnail: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&h=225&fit=crop'
                },
                {
                    id: 'demo-ep-1-3',
                    episode: '03',
                    title: 'Sabito and Makomo',
                    videoUrl: 'https://iframe.mediadelivery.net/embed/506159/demo-ep-1-3',
                    directMp4: 'https://vz-a01fffb9-e7a.b-cdn.net/demo-ep-1-3/play_720p.mp4',
                    thumbnail: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&h=225&fit=crop'
                }
            ]
        },
        {
            id: 'demo-2',
            title: 'Attack on Titan',
            slug: 'attack-on-titan',
            episodes: [
                {
                    id: 'demo-ep-2-1',
                    episode: '01',
                    title: 'To You, in 2000 Years: The Fall of Shiganshina, Part 1',
                    videoUrl: 'https://iframe.mediadelivery.net/embed/506159/demo-ep-2-1',
                    directMp4: 'https://vz-a01fffb9-e7a.b-cdn.net/demo-ep-2-1/play_720p.mp4',
                    thumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=225&fit=crop'
                },
                {
                    id: 'demo-ep-2-2',
                    episode: '02',
                    title: 'That Day: The Fall of Shiganshina, Part 2',
                    videoUrl: 'https://iframe.mediadelivery.net/embed/506159/demo-ep-2-2',
                    directMp4: 'https://vz-a01fffb9-e7a.b-cdn.net/demo-ep-2-2/play_720p.mp4',
                    thumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=225&fit=crop'
                }
            ]
        },
        {
            id: 'demo-3',
            title: 'My Hero Academia',
            slug: 'my-hero-academia',
            episodes: [
                {
                    id: 'demo-ep-3-1',
                    episode: '01',
                    title: 'Izuku Midoriya: Origin',
                    videoUrl: 'https://iframe.mediadelivery.net/embed/506159/demo-ep-3-1',
                    directMp4: 'https://vz-a01fffb9-e7a.b-cdn.net/demo-ep-3-1/play_720p.mp4',
                    thumbnail: 'https://images.unsplash.com/photo-1613376023733-0a73315d9b06?w=400&h=225&fit=crop'
                },
                {
                    id: 'demo-ep-3-2',
                    episode: '02',
                    title: 'What It Takes to Be a Hero',
                    videoUrl: 'https://iframe.mediadelivery.net/embed/506159/demo-ep-3-2',
                    directMp4: 'https://vz-a01fffb9-e7a.b-cdn.net/demo-ep-3-2/play_720p.mp4',
                    thumbnail: 'https://images.unsplash.com/photo-1613376023733-0a73315d9b06?w=400&h=225&fit=crop'
                }
            ]
        },
        {
            id: 'demo-4',
            title: 'Jujutsu Kaisen',
            slug: 'jujutsu-kaisen',
            episodes: [
                {
                    id: 'demo-ep-4-1',
                    episode: '01',
                    title: 'Ryomen Sukuna',
                    videoUrl: 'https://iframe.mediadelivery.net/embed/506159/demo-ep-4-1',
                    directMp4: 'https://vz-a01fffb9-e7a.b-cdn.net/demo-ep-4-1/play_720p.mp4',
                    thumbnail: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=400&h=225&fit=crop'
                }
            ]
        },
        {
            id: 'demo-5',
            title: 'One Piece',
            slug: 'one-piece',
            episodes: [
                {
                    id: 'demo-ep-5-1',
                    episode: '01',
                    title: 'I\'m Luffy! The Man Who\'s Gonna Be King of the Pirates!',
                    videoUrl: 'https://iframe.mediadelivery.net/embed/506159/demo-ep-5-1',
                    directMp4: 'https://vz-a01fffb9-e7a.b-cdn.net/demo-ep-5-1/play_720p.mp4',
                    thumbnail: 'https://images.unsplash.com/photo-1613376023733-0a73315d9b06?w=400&h=225&fit=crop'
                }
            ]
        },
        {
            id: 'demo-6',
            title: 'Naruto',
            slug: 'naruto',
            episodes: [
                {
                    id: 'demo-ep-6-1',
                    episode: '01',
                    title: 'Enter: Naruto Uzumaki!',
                    videoUrl: 'https://iframe.mediadelivery.net/embed/506159/demo-ep-6-1',
                    directMp4: 'https://vz-a01fffb9-e7a.b-cdn.net/demo-ep-6-1/play_720p.mp4',
                    thumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=225&fit=crop'
                }
            ]
        }
    ];
    console.log(`✅ Loaded ${animeData.length} demo anime shows`);
    displayAnime(animeData);
}

// Display anime in the grid
function displayAnime(anime) {
    const showsGrid = document.getElementById('showsGrid');
    showsGrid.innerHTML = '';
    
    anime.forEach(animeItem => {
        const animeCard = createAnimeCard(animeItem);
        showsGrid.appendChild(animeCard);
    });
}

// Create an anime card element
function createAnimeCard(anime) {
    const card = document.createElement('div');
    card.className = 'show-card';
    card.onclick = () => openAnimeDetail(anime);
    
    // Get the best available thumbnail with debugging
    const firstEpisode = anime.episodes && anime.episodes.length > 0 ? anime.episodes[0] : null;
    const thumbnail = firstEpisode?.thumbnailPreview || firstEpisode?.thumbnail || '/public/assets/ishanime-logo.png';
    
    // Debug thumbnail URLs
    console.log(`🖼️ Anime: ${anime.title}`);
    console.log(`   Thumbnail Preview: ${firstEpisode?.thumbnailPreview || 'N/A'}`);
    console.log(`   Thumbnail: ${firstEpisode?.thumbnail || 'N/A'}`);
    console.log(`   Using: ${thumbnail}`);
    
    // Test thumbnail URL if it's from Bunny CDN
    if (thumbnail.includes('b-cdn.net')) {
        testThumbnailUrl(thumbnail);
    }
    
    card.innerHTML = `
        <img src="${thumbnail}" alt="${anime.title}" class="show-thumbnail" 
             onerror="console.log('❌ Thumbnail failed:', this.src); this.src='/public/assets/ishanime-logo.png'" 
             onload="console.log('✅ Thumbnail loaded:', this.src)"
             loading="lazy">
        <div class="show-info">
            <h3 class="show-title">${anime.title}</h3>
            <p class="show-episodes">${anime.episodes ? anime.episodes.length : 0} episodes</p>
        </div>
    `;
    
    return card;
}

// Open anime detail and player
function openAnimeDetail(anime) {
    if (anime.episodes && anime.episodes.length > 0) {
        // Navigate to player page with anime ID and episode 0 (first episode)
        const playerUrl = `player.html?anime=${encodeURIComponent(anime.id)}&episode=0`;
        window.location.href = playerUrl;
    } else {
        alert('No episodes available for this anime.');
    }
}

// Open player section
function openPlayer(episode, anime) {
    const playerSection = document.getElementById('playerSection');
    const playerTitle = document.getElementById('playerTitle');
    const playerEpisode = document.getElementById('playerEpisode');
    const videoPlayer = document.getElementById('videoPlayer');
    const videoContainer = document.getElementById('videoContainer');
    const episodeList = document.getElementById('episodeList');
    
    // Update player info
    if (playerTitle) playerTitle.textContent = anime.title;
    if (playerEpisode) playerEpisode.textContent = `Episode ${episode.episode}: ${episode.title}`;
    
    // Clear previous players completely
    if (videoContainer) {
        // Remove any existing iframe
        const existingIframe = videoContainer.querySelector('iframe');
        if (existingIframe) {
            existingIframe.remove();
        }
        
        // Remove any error messages
        const errorDiv = videoContainer.querySelector('div[style*="color: #ff6b6b"]');
        if (errorDiv) {
            errorDiv.remove();
        }
        
        // Clear background image
        videoContainer.style.backgroundImage = 'none';
    }
    
    // Reset video player
    if (videoPlayer) {
        videoPlayer.pause();
        videoPlayer.removeAttribute('src');
        videoPlayer.load();
        videoPlayer.style.display = 'none'; // Hide by default
    }
    
    // Add player mode selector if not exists
    addPlayerModeSelector();
    
    let started = false;
    let currentMethod = '';
    
    console.log(`🎮 Player mode: ${playerMode}`);
    console.log(`📺 Episode data:`, episode);
    console.log(`🎬 Episode ID:`, episode.id);
    
    // Play based on selected mode
    if (playerMode === 'direct') {
        started = playDirectVideo(episode);
        currentMethod = 'Direct MP4';
    } else if (playerMode === 'hls') {
        started = playHLSVideo(episode);
        currentMethod = 'HLS Stream';
    } else if (playerMode === 'iframe') {
        started = playIframeVideo(episode);
        currentMethod = 'Iframe Player';
    } else {
        // Auto mode - try all methods
        started = playDirectVideo(episode) || playHLSVideo(episode) || playIframeVideo(episode);
        currentMethod = 'Auto Mode';
    }

    // Show error if no method worked
    if (!started) {
        console.log('❌ No video source available');
        videoPlayer.style.display = 'none';
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = 'padding: 20px; text-align: center; color: #ff6b6b; background: #ffe0e0; border-radius: 8px; margin: 20px;';
        errorDiv.innerHTML = `
            <h3>Video Not Available</h3>
            <p>No video source could be loaded. Try different player modes.</p>
            <div style="margin-top: 10px;">
                <button onclick="setPlayerMode('direct')" style="margin: 5px; padding: 8px 16px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">Try Direct MP4</button>
                <button onclick="setPlayerMode('hls')" style="margin: 5px; padding: 8px 16px; background: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer;">Try HLS</button>
                <button onclick="setPlayerMode('iframe')" style="margin: 5px; padding: 8px 16px; background: #FF9800; color: white; border: none; border-radius: 4px; cursor: pointer;">Try Iframe</button>
            </div>
        `;
        videoPlayer.parentNode.appendChild(errorDiv);
    } else {
        // Success handler
        videoPlayer.onloadstart = () => {
            console.log(`✅ ${currentMethod} started loading successfully`);
        };
        
        videoPlayer.oncanplay = () => {
            console.log(`🎬 ${currentMethod} can start playing`);
        };
        
        videoPlayer.onloadeddata = () => {
            console.log(`📊 ${currentMethod} data loaded`);
        };
        
        // Error handler with detailed info
        videoPlayer.onerror = (e) => {
            console.log(`❌ ${currentMethod} failed to load`);
            console.log('Video error details:', e);
            console.log('Video error code:', videoPlayer.error?.code);
            console.log('Video error message:', videoPlayer.error?.message);
            console.log('Current video src:', videoPlayer.src);
            console.log('Video ready state:', videoPlayer.readyState);
            console.log('Video network state:', videoPlayer.networkState);
        };
        
        // Add timeout to detect if video never loads
        setTimeout(() => {
            if (videoPlayer.readyState === 0) {
                console.log(`⏰ ${currentMethod} timeout - video never started loading`);
            }
        }, 5000);
    }
    
    // Update episode list
    updateEpisodeList(anime.episodes);
    
    // Show player
    playerSection.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

// Update episode list
function updateEpisodeList(episodes) {
    const episodeList = document.getElementById('episodeList');
    episodeList.innerHTML = '';
    
    episodes.forEach((episode, index) => {
        const episodeItem = document.createElement('div');
        episodeItem.className = `episode-item ${index === currentEpisodeIndex ? 'active' : ''}`;
        episodeItem.onclick = () => selectEpisode(index);
        
        episodeItem.innerHTML = `
            <h5>Episode ${episode.episode}</h5>
            <p>${episode.title}</p>
        `;
        
        episodeList.appendChild(episodeItem);
    });
}

// Select episode
function selectEpisode(index) {
    if (currentAnime && currentAnime.episodes[index]) {
        currentEpisodeIndex = index;
        const episode = currentAnime.episodes[index];
        
        // Check if we're on the player page
        if (window.location.pathname.includes('player.html')) {
            // Update URL without reloading
            const newUrl = `player.html?anime=${encodeURIComponent(currentAnime.id)}&episode=${index}`;
            window.history.pushState({}, '', newUrl);
            
            // Update page title
            document.title = `${currentAnime.title} - Episode ${episode.episode} | Ishrealmanime`;
            
            // Update player info
            const playerTitle = document.getElementById('playerTitle');
            const playerEpisode = document.getElementById('playerEpisode');
            
            if (playerTitle) playerTitle.textContent = currentAnime.title;
            if (playerEpisode) playerEpisode.textContent = `Episode ${episode.episode}: ${episode.title}`;
            
            // Update anime info
            const animeInfo = document.getElementById('animeInfo');
            if (animeInfo) {
                animeInfo.innerHTML = `
                    <strong>Title:</strong> ${currentAnime.title}<br>
                    <strong>Episodes:</strong> ${currentAnime.episodes.length}<br>
                    <strong>Current:</strong> Episode ${episode.episode}
                `;
            }
        } else {
            // Update player info for section view
            const playerEpisode = document.getElementById('playerEpisode');
            if (playerEpisode) playerEpisode.textContent = `Episode ${episode.episode}: ${episode.title}`;
        }
        
        // Update video source
        const videoPlayer = document.getElementById('videoPlayer');
        const videoContainer = videoPlayer.parentNode;
        
        // Remove any existing iframe
        const existingIframe = videoContainer.querySelector('iframe');
        if (existingIframe) {
            existingIframe.remove();
        }
        
        // Clear video source
        videoPlayer.src = '';
        videoPlayer.style.display = 'block';
        
        // Try different video sources in order of preference
        if (episode.directMp4_1080p) {
            // Use HTML5 video for direct MP4 1080p
            videoPlayer.src = episode.directMp4_1080p;
            console.log('🎬 Switching to direct MP4 1080p:', episode.directMp4_1080p);
        } else if (episode.directMp4) {
            // Use HTML5 video for direct MP4 720p
            videoPlayer.src = episode.directMp4;
            console.log('🎬 Switching to direct MP4 720p:', episode.directMp4);
        } else if (episode.directMp4_480p) {
            // Use HTML5 video for direct MP4 480p
            videoPlayer.src = episode.directMp4_480p;
            console.log('🎬 Switching to direct MP4 480p:', episode.directMp4_480p);
        } else if (episode.hlsUrl) {
            // Use HTML5 video for HLS
            videoPlayer.src = episode.hlsUrl;
            console.log('🎬 Switching to HLS:', episode.hlsUrl);
        } else if (episode.videoUrl) {
            // Use iframe for Bunny CDN iframe URLs
            const iframe = document.createElement('iframe');
            iframe.src = episode.videoUrl;
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.style.border = 'none';
            iframe.allowFullscreen = true;
            iframe.allow = 'autoplay; fullscreen';
            iframe.setAttribute('loading', 'lazy');
            
            videoPlayer.style.display = 'none';
            videoContainer.appendChild(iframe);
            console.log('🎬 Switching to iframe:', episode.videoUrl);
        }
        
        // Update episode list to show active episode
        updateEpisodeList(currentAnime.episodes);
    }
}

// Player controls
function togglePlayPause() {
    const videoPlayer = document.getElementById('videoPlayer');
    const iframe = document.getElementById('bunnyIframe');
    
    // Check if iframe is currently active
    if (iframe && iframe.style.display !== 'none' && videoPlayer.style.display === 'none') {
        // Iframe is active - try to control it
        try {
            // Send spacebar to iframe for play/pause
            iframe.contentWindow.postMessage({
                type: 'keydown',
                key: ' ',
                code: 'Space'
            }, '*');
            console.log('🎮 Sent play/pause to iframe via existing button');
        } catch (err) {
            console.log('❌ Cannot control iframe (CORS restriction)');
            // Fallback: click on iframe to focus it
            iframe.click();
        }
    } else {
        // Regular video player is active
        if (isPlaying) {
            videoPlayer.pause();
        } else {
            videoPlayer.play();
        }
    }
}

function previousEpisode() {
    if (currentAnime && currentEpisodeIndex > 0) {
        selectEpisode(currentEpisodeIndex - 1);
    }
}

function nextEpisode() {
    if (currentAnime && currentEpisodeIndex < currentAnime.episodes.length - 1) {
        selectEpisode(currentEpisodeIndex + 1);
    }
}

function closePlayer() {
    const playerSection = document.getElementById('playerSection');
    const videoPlayer = document.getElementById('videoPlayer');
    const videoContainer = videoPlayer.parentNode;
    
    // Remove any existing iframe
    const existingIframe = videoContainer.querySelector('iframe');
    if (existingIframe) {
        existingIframe.remove();
    }
    
    // Reset video player
    videoPlayer.pause();
    videoPlayer.src = '';
    videoPlayer.style.display = 'block';
    
    // Hide player
    playerSection.classList.add('hidden');
    document.body.style.overflow = 'auto';
    
    // Reset state
    currentAnime = null;
    currentEpisodeIndex = 0;
}

// Update play/pause icon
function updatePlayPauseIcon() {
    const playPauseIcon = document.getElementById('playPauseIcon');
    if (isPlaying) {
        playPauseIcon.innerHTML = '<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>';
    } else {
        playPauseIcon.innerHTML = '<polygon points="5,3 19,12 5,21 5,3"></polygon>';
    }
}

// Change video quality
function changeVideoQuality() {
    if (!currentAnime || !currentAnime.episodes[currentEpisodeIndex]) return;
    
    const qualitySelector = document.getElementById('qualitySelector');
    const selectedQuality = qualitySelector.value;
    const episode = currentAnime.episodes[currentEpisodeIndex];
    const videoPlayer = document.getElementById('videoPlayer');
    
    let newSource = '';
    
    switch (selectedQuality) {
        case '1080p':
            newSource = episode.directMp4_1080p || episode.directMp4 || episode.directMp4_480p;
            break;
        case '720p':
            newSource = episode.directMp4 || episode.directMp4_1080p || episode.directMp4_480p;
            break;
        case '480p':
            newSource = episode.directMp4_480p || episode.directMp4 || episode.directMp4_1080p;
            break;
        case 'auto':
        default:
            // Prefer HLS in auto mode
            if (episode.hlsUrl && (window.Hls && window.Hls.isSupported() || (videoPlayer.canPlayType && videoPlayer.canPlayType('application/vnd.apple.mpegurl')))) {
                playWithHlsIfPossible(videoPlayer, episode.hlsUrl);
                console.log('🎚️ Auto quality using HLS:', episode.hlsUrl);
                return;
            }
            newSource = episode.directMp4 || episode.directMp4_1080p || episode.directMp4_480p;
            break;
    }
    
    if (newSource && newSource !== videoPlayer.src) {
        const currentTime = videoPlayer.currentTime;
        destroyHls();
        videoPlayer.src = newSource;
        videoPlayer.currentTime = currentTime;
        console.log(`🎬 Quality changed to ${selectedQuality}:`, newSource);
    }
}

// Filter anime
function filterShows(filter) {
    currentFilter = filter;
    
    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Filter anime based on current filter
    let filteredAnime = animeData;
    
    switch (filter) {
        case 'popular':
            // Sort by episode count (assuming more episodes = more popular)
            filteredAnime = [...animeData].sort((a, b) => (b.episodes?.length || 0) - (a.episodes?.length || 0));
            break;
        case 'new':
            // Sort by title (assuming newer shows come later alphabetically)
            filteredAnime = [...animeData].sort((a, b) => b.title.localeCompare(a.title));
            break;
        case 'spring':
            // Filter for spring-themed anime (demo)
            filteredAnime = animeData.filter(anime => 
                anime.title.toLowerCase().includes('spring') || 
                anime.title.toLowerCase().includes('cherry') ||
                anime.title.toLowerCase().includes('blossom')
            );
            break;
        case 'random':
            // Shuffle anime
            filteredAnime = [...animeData].sort(() => Math.random() - 0.5);
            break;
        default:
            filteredAnime = animeData;
    }
    
    displayAnime(filteredAnime);
}

// Toggle view
function toggleView(view) {
    const showsGrid = document.getElementById('showsGrid');
    const viewToggles = document.querySelectorAll('.view-toggle');
    
    viewToggles.forEach(toggle => toggle.classList.remove('active'));
    event.target.classList.add('active');
    
    if (view === 'list') {
        showsGrid.classList.add('list-view');
    } else {
        showsGrid.classList.remove('list-view');
    }
}

// Perform search
function performSearch() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.toLowerCase().trim();
    
    if (query === '') {
        displayAnime(animeData);
        return;
    }
    
    const filteredAnime = animeData.filter(anime => 
        anime.title.toLowerCase().includes(query)
    );
    
    displayAnime(filteredAnime);
}

// Navigation functions
function goHome() {
    window.location.href = '/';
}


function showNotifications() {
    alert('Notifications feature coming soon!');
}

function showBookmarks() {
    alert('Bookmarks feature coming soon!');
}

// Loading functions
function showLoading() {
    document.getElementById('loadingSpinner').classList.remove('hidden');
}

function hideLoading() {
    document.getElementById('loadingSpinner').classList.add('hidden');
}

// Handle keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Escape key to close player
    if (e.key === 'Escape') {
        closePlayer();
    }
    
    // Space bar to play/pause
    if (e.key === ' ' && !document.getElementById('playerSection').classList.contains('hidden')) {
        e.preventDefault();
        togglePlayPause();
    }
    
    // Arrow keys for episode navigation
    if (!document.getElementById('playerSection').classList.contains('hidden')) {
        if (e.key === 'ArrowLeft') {
            previousEpisode();
        } else if (e.key === 'ArrowRight') {
            nextEpisode();
        }
    }
    
    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('searchInput').focus();
    }
});

// Handle window resize
window.addEventListener('resize', function() {
    // Adjust video player size if player is open
    const playerSection = document.getElementById('playerSection');
    if (!playerSection.classList.contains('hidden')) {
        // Video player will automatically adjust due to CSS
    }
});

// Service worker disabled to prevent potential reload loops during development