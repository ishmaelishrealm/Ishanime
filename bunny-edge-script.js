// Bunny Edge Scripting - Standalone Script for Ishrealmanime
// This replaces the Railway Node.js backend entirely
// Deployed via GitHub Actions - Ready for deployment

// Import Bunny SDK for environment variables
import * as BunnySDK from "https://esm.sh/@bunny.net/edgescript-sdk@0.11";

// Configuration - Using environment variables
const BUNNY_API_KEY = BunnySDK.env.BUNNY_API_KEY;
const LIBRARY_ID = BunnySDK.env.LIBRARY_ID;
const DELIVERY_DOMAIN = BunnySDK.env.DELIVERY_DOMAIN;

// Cache for anime data (Edge Scripting has memory limitations, so keep cache small)
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
        console.error('Error fetching videos:', error);
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
                    title: showName, // Add title field for compatibility
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

    return Array.from(animeMap.values());
}

// Get anime data (with caching)
async function getAnimeData() {
    const now = Date.now();
    
    if (animeCache && cacheTimestamp && (now - cacheTimestamp) < CACHE_DURATION) {
        return animeCache;
    }

    try {
        const videos = await fetchVideos();
        animeCache = parseAnimeData(videos);
        cacheTimestamp = now;
        return animeCache;
    } catch (error) {
        console.error('Error getting anime data:', error);
        throw error;
    }
}

// Main Edge Script handler using Bunny SDK
BunnySDK.net.http.serve(async (request) => {
    const url = new URL(request.url);
    const path = url.pathname;

    // Set CORS headers
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
        return new Response(null, { 
            status: 200, 
            headers: corsHeaders 
        });
    }

    try {
        // Health check endpoint
        if (path === '/api/health') {
            return new Response(JSON.stringify({
                status: 'healthy',
                timestamp: new Date().toISOString(),
                service: 'Ishanime Bunny Edge Scripting API',
                version: '1.0.0',
                bunny_cdn: {
                    api_key: BUNNY_API_KEY ? 'configured' : 'missing',
                    library_id: LIBRARY_ID || 'missing',
                    delivery_domain: DELIVERY_DOMAIN || 'missing'
                }
            }), {
                status: 200,
                headers: corsHeaders
            });
        }

        // Anime data endpoint
        if (path === '/api/anime') {
            const animeData = await getAnimeData();
            return new Response(JSON.stringify({
                success: true,
                data: animeData,
                count: animeData.length,
                timestamp: new Date().toISOString()
            }), {
                status: 200,
                headers: corsHeaders
            });
        }

        // Site configuration endpoint
        if (path === '/api/site') {
            return new Response(JSON.stringify({
                success: true,
                data: {
                    name: 'Ishrealmanime',
                    description: 'Your ultimate anime streaming destination',
                    version: '1.0.0',
                    features: {
                        multipleVideoQualities: true,
                        adaptiveStreaming: true,
                        thumbnailPreviews: true,
                        episodeOrdering: 'oldest-first'
                    }
                }
            }), {
                status: 200,
                headers: corsHeaders
            });
        }

        // Individual anime endpoint (e.g., /api/anime/solo-leveling)
        if (path.startsWith('/api/anime/')) {
            const slug = path.split('/').pop();
            const animeData = await getAnimeData();
            const anime = animeData.find(a => a.slug === slug);
            
            if (anime) {
                return new Response(JSON.stringify({
                    success: true,
                    data: anime
                }), {
                    status: 200,
                    headers: corsHeaders
                });
            } else {
                return new Response(JSON.stringify({
                    success: false,
                    error: 'Anime not found'
                }), {
                    status: 404,
                    headers: corsHeaders
                });
            }
        }

        // 404 for unknown routes
        return new Response(JSON.stringify({
            success: false,
            error: 'Not found',
            message: `Route ${path} not found`
        }), {
            status: 404,
            headers: corsHeaders
        });

    } catch (error) {
        console.error('Edge Script error:', error);
        return new Response(JSON.stringify({
            success: false,
            error: 'Internal server error',
            message: error.message
        }), {
            status: 500,
            headers: corsHeaders
        });
    }
});
