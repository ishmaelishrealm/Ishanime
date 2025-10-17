// Configuration
// 🚀 REPLACE THIS URL with your actual Bunny Edge Scripting URL after deployment
// 
// Steps to get your URL:
// 1. Deploy bunny-edge-script.js to Bunny Dashboard → Edge Scripting
// 2. Your URL will be: https://your-script-name.bunnycdn.com
// 3. Or use your custom domain if configured
//
// Example URLs:
// - https://ishanime-api.bunnycdn.com
// - https://api.ishanime.me (custom domain)
const API_URL = 'https://ishanime-api-pzssf.bunny.run'; // ✅ Bunny Edge Scripting URL
let animeData = [];
let currentFilter = 'all';
let currentAnime = null;
let currentEpisodeIndex = 0;
let isPlaying = false;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
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
    
    // Always try to connect to backend via API proxy
    
    try {
        console.log('🔍 Testing backend connection...');
        console.log('🌐 Health check URL:', `${API_URL}/api/health`);
        const response = await fetch(`${API_URL}/api/health`);
        console.log('📡 Health check status:', response.status);
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Backend health data:', data);
            statusElement.innerHTML = `
                <div class="status-content">
                    <div class="status-icon">✅</div>
                    <p>Connected to backend - Loading real anime content...</p>
                </div>
            `;
            // Hide status after 3 seconds
            setTimeout(() => {
                statusElement.style.display = 'none';
            }, 3000);
        } else {
            console.log('❌ Health check failed with status:', response.status);
            showBackendError();
        }
    } catch (error) {
        console.error('❌ Backend connection failed:', error);
        console.error('❌ Connection error details:', error.message);
        console.error('❌ API URL being used:', API_URL);
        console.error('❌ Full health check URL:', `${API_URL}/api/health`);
        showBackendError();
    }
}

// Show backend error
function showBackendError() {
    const statusElement = document.getElementById('backendStatus');
    statusElement.innerHTML = `
        <div class="status-content">
            <div class="status-icon">⚠️</div>
            <p>Backend not connected - Using demo mode</p>
            <p style="font-size: 0.8em; margin-top: 5px; opacity: 0.7;">
                Check console (F12) for connection details
            </p>
        </div>
    `;
}

// Load site configuration from backend
async function loadSiteConfig() {
    try {
        const response = await fetch(`${API_URL}/api/site`);
        if (response.ok) {
            const data = await response.json();
            if (data.success && data.data) {
                updateSiteBranding(data.data);
            }
        }
    } catch (error) {
        console.error('Failed to load site config:', error);
    }
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

// Load anime from backend
async function loadAnime() {
    showLoading();
    
    // Always try to load from backend via API proxy
    
    try {
        console.log('🔄 Fetching anime from backend...');
        console.log('🌐 API URL:', API_URL);
        const response = await fetch(`${API_URL}/api/anime`);
        console.log('📡 Backend response status:', response.status);
        console.log('📡 Backend response headers:', response.headers);
        
        if (response.ok) {
            const data = await response.json();
            console.log('📊 Backend response data:', data);
            
            if (data.success && data.data && data.data.length > 0) {
                animeData = data.data;
                console.log(`✅ Loaded ${animeData.length} anime shows from backend`);
                displayAnime(animeData);
            } else {
                console.log('⚠️ No anime data from backend, using demo data');
                loadDemoAnime();
            }
        } else {
            console.log('❌ Backend request failed, using demo data');
            loadDemoAnime();
        }
    } catch (error) {
        console.error('❌ Failed to load anime:', error);
        console.error('❌ Error details:', error.message);
        console.error('❌ Error stack:', error.stack);
        
        // Show user-friendly error message
        const statusElement = document.getElementById('backendStatus');
        if (statusElement) {
            statusElement.innerHTML = `
                <div class="status-content">
                    <div class="status-icon">❌</div>
                    <p>Backend connection failed: ${error.message}</p>
                    <p>Check if Bunny Edge Scripting is deployed</p>
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
    
    // Get the best available thumbnail
    const firstEpisode = anime.episodes && anime.episodes.length > 0 ? anime.episodes[0] : null;
    const thumbnail = firstEpisode?.thumbnailPreview || firstEpisode?.thumbnail || 'public/assets/ishanime-logo.png';
    
    card.innerHTML = `
        <img src="${thumbnail}" alt="${anime.title}" class="show-thumbnail" 
             onerror="this.src='public/assets/ishanime-logo.png'" 
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
        currentAnime = anime;
        currentEpisodeIndex = 0;
        openPlayer(anime.episodes[0], anime);
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
    const episodeList = document.getElementById('episodeList');
    
    // Update player info
    playerTitle.textContent = anime.title;
    playerEpisode.textContent = `Episode ${episode.episode}: ${episode.title}`;
    
    // Clear previous video source
    videoPlayer.src = '';
    videoPlayer.innerHTML = '';
    
    // Try different video sources in order of preference
    if (episode.directMp4_1080p) {
        // Use HTML5 video for direct MP4 1080p
        videoPlayer.src = episode.directMp4_1080p;
        videoPlayer.style.display = 'block';
        console.log('🎬 Using direct MP4 1080p:', episode.directMp4_1080p);
    } else if (episode.directMp4) {
        // Use HTML5 video for direct MP4 720p
        videoPlayer.src = episode.directMp4;
        videoPlayer.style.display = 'block';
        console.log('🎬 Using direct MP4 720p:', episode.directMp4);
    } else if (episode.directMp4_480p) {
        // Use HTML5 video for direct MP4 480p
        videoPlayer.src = episode.directMp4_480p;
        videoPlayer.style.display = 'block';
        console.log('🎬 Using direct MP4 480p:', episode.directMp4_480p);
    } else if (episode.hlsUrl) {
        // Use HTML5 video for HLS
        videoPlayer.src = episode.hlsUrl;
        videoPlayer.style.display = 'block';
        console.log('🎬 Using HLS:', episode.hlsUrl);
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
        videoPlayer.parentNode.appendChild(iframe);
        console.log('🎬 Using iframe:', episode.videoUrl);
    } else {
        alert('Video not available');
        return;
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
        
        // Update player info
        const playerEpisode = document.getElementById('playerEpisode');
        playerEpisode.textContent = `Episode ${episode.episode}: ${episode.title}`;
        
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
    if (isPlaying) {
        videoPlayer.pause();
    } else {
        videoPlayer.play();
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
            newSource = episode.directMp4_1080p || episode.directMp4 || episode.directMp4_480p;
            break;
    }
    
    if (newSource && newSource !== videoPlayer.src) {
        const currentTime = videoPlayer.currentTime;
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

// Service Worker registration (for PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}