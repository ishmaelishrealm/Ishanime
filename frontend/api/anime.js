// Vercel Serverless Function for Ishrealmanime
// Replaces Bunny Edge Script with a simpler, more reliable solution

const BUNNY_API_KEY = '7f0a1d07-a8a4-4e07-af7ed42722ee-bfbd-4896';
const LIBRARY_ID = '506159';
const DELIVERY_DOMAIN = 'vz-a01fffb9-e7a.b-cdn.net';

// In-memory cache for performance
let animeCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Helper function to create URL-friendly slugs
function slugify(text) {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

// Fetch videos from Bunny Video Library
async function fetchVideos() {
    try {
        const response = await fetch(`https://video.bunnycdn.com/library/${LIBRARY_ID}/videos`, {
            headers: { 
                'AccessKey': BUNNY_API_KEY, 
                'Accept': 'application/json' 
            }
        });

        if (!response.ok) {
            throw new Error(`Bunny API error: ${response.status}`);
        }

        const data = await response.json();
        return data.items || [];
    } catch (error) {
        console.error('Error fetching videos from Bunny:', error);
        throw error;
    }
}

// Parse video data into organized anime shows and episodes
function parseAnimeData(videos) {
    const animeMap = new Map();

    videos.forEach(video => {
        // Extract show name and episode number from title
        const titleMatch = video.title.match(/^(.+?)\s*-\s*Episode\s*(\d+)/i);
        if (!titleMatch) return;

        const showName = titleMatch[1].trim();
        const episodeNumber = parseInt(titleMatch[2]);

        // Create anime show entry if it doesn't exist
        if (!animeMap.has(showName)) {
            animeMap.set(showName, {
                id: slugify(showName),
                name: showName,
                title: showName,
                slug: slugify(showName),
                episodes: []
            });
        }

        // Add episode to the show
        animeMap.get(showName).episodes.push({
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
        });
    });

    // Sort episodes oldest → newest for each anime
    animeMap.forEach(anime => {
        anime.episodes.sort((a, b) => parseInt(a.episode) - parseInt(b.episode));
    });

    return Array.from(animeMap.values());
}

// Main Vercel serverless function handler
export default async function handler(req, res) {
    // Set CORS headers for cross-origin requests
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight OPTIONS requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const now = Date.now();
        
        // Use cache if it's still valid
        if (!animeCache || (now - cacheTimestamp) > CACHE_DURATION) {
            console.log('Fetching fresh anime data from Bunny...');
            const videos = await fetchVideos();
            animeCache = parseAnimeData(videos);
            cacheTimestamp = now;
        } else {
            console.log('Using cached anime data');
        }

        // Return successful response with anime data
        res.status(200).json({
            success: true,
            data: animeCache,
            count: animeCache.length,
            timestamp: new Date().toISOString(),
            cached: (now - cacheTimestamp) < CACHE_DURATION
        });

    } catch (error) {
        console.error('Serverless function error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: error.message
        });
    }
}
