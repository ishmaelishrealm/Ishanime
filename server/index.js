const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Bunny CDN Configuration
const BUNNY_API_KEY = process.env.BUNNY_API_KEY;
const LIBRARY_ID = process.env.LIBRARY_ID;
const DELIVERY_DOMAIN = process.env.DELIVERY_DOMAIN;

// Cache for anime data
let animeCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Helper function to slugify strings
function slugify(text) {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

// Fetch videos from Bunny CDN
async function fetchVideos() {
    try {
        console.log('🔄 Fetching videos from Bunny CDN...');
        const response = await axios.get(`https://video.bunnycdn.com/library/${LIBRARY_ID}/videos`, {
            headers: {
                'AccessKey': BUNNY_API_KEY,
                'Accept': 'application/json'
            }
        });

        const videos = response.data.items || [];
        console.log(`📹 Found ${videos.length} videos`);
        return videos;
    } catch (error) {
        console.error('❌ Error fetching videos:', error.message);
        throw error;
    }
}

// Parse videos into anime shows and episodes
function parseAnimeData(videos) {
    const animeMap = new Map();

    videos.forEach(video => {
        // Extract show name and episode number from title
        const titleMatch = video.title.match(/^(.+?)\s*-\s*Episode\s*(\d+)/i);
        
        if (titleMatch) {
            const showName = titleMatch[1].trim();
            const episodeNumber = parseInt(titleMatch[2]);
            
            if (!animeMap.has(showName)) {
                animeMap.set(showName, {
                    id: slugify(showName),
                    name: showName,
                    slug: slugify(showName),
                    episodes: []
                });
            }

            const episode = {
                id: video.guid,
                episode: episodeNumber.toString().padStart(2, '0'),
                title: video.title,
                videoUrl: `https://iframe.mediadelivery.net/play/${LIBRARY_ID}/${video.guid}`,
                directMp4: `https://${DELIVERY_DOMAIN}/${video.guid}/play_720p.mp4`,
                directMp4_480p: `https://${DELIVERY_DOMAIN}/${video.guid}/play_480p.mp4`,
                directMp4_1080p: `https://${DELIVERY_DOMAIN}/${video.guid}/play_1080p.mp4`,
                hlsUrl: `https://${DELIVERY_DOMAIN}/${video.guid}/playlist.m3u8`,
                thumbnail: `https://${DELIVERY_DOMAIN}/${video.guid}/thumbnail.jpg`,
                thumbnailPreview: `https://${DELIVERY_DOMAIN}/${video.guid}/preview.jpg`,
                uploadedAt: video.dateUploaded || video.createdAt || new Date().toISOString()
            };

            animeMap.get(showName).episodes.push(episode);
        }
    });

    // Sort episodes by episode number (oldest first)
    animeMap.forEach(anime => {
        anime.episodes.sort((a, b) => {
            const episodeA = parseInt(a.episode);
            const episodeB = parseInt(b.episode);
            return episodeA - episodeB;
        });
    });

    const animeList = Array.from(animeMap.values());
    console.log(`🎌 Parsed ${animeList.length} anime shows`);
    
    return animeList;
}

// Get anime data (with caching)
async function getAnimeData() {
    const now = Date.now();
    
    if (animeCache && cacheTimestamp && (now - cacheTimestamp) < CACHE_DURATION) {
        console.log('📋 Using cached anime data');
        return animeCache;
    }

    try {
        const videos = await fetchVideos();
        animeCache = parseAnimeData(videos);
        cacheTimestamp = now;
        return animeCache;
    } catch (error) {
        console.error('❌ Error getting anime data:', error);
        throw error;
    }
}

// Routes
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'Ishanime Backend API',
        version: '1.0.0'
    });
});

app.get('/api/anime', async (req, res) => {
    try {
        const animeData = await getAnimeData();
        res.json(animeData);
    } catch (error) {
        console.error('❌ Error in /api/anime:', error);
        res.status(500).json({
            error: 'Failed to fetch anime data',
            message: error.message
        });
    }
});

app.get('/api/site', (req, res) => {
    res.json({
        name: 'Ishrealmanime',
        description: 'Your ultimate anime streaming destination',
        version: '1.0.0',
        features: {
            multipleVideoQualities: true,
            adaptiveStreaming: true,
            thumbnailPreviews: true,
            episodeOrdering: 'oldest-first'
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('❌ Server error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: err.message
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Not found',
        message: `Route ${req.originalUrl} not found`
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
    console.log(`📺 Anime API: http://localhost:${PORT}/api/anime`);
});

module.exports = app;
