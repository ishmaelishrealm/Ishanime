// ============================================================
// Ishanime Bunny Edge Script — Clean, Loop-Proof, Stable Build
// Version: 1.1.0
// Description: Replaces Node backend for Ishrealmanime frontend
// Updated: Fix infinite loop (508), CORS, caching & data parsing
// ============================================================

// BunnyCDN Configuration
const BUNNY_API_KEY = '7f0a1d07-a8a4-4e07-af7ed42722ee-bfbd-4896';
const LIBRARY_ID = '506159';
const DELIVERY_DOMAIN = 'vz-a01fffb9-e7a.b-cdn.net';

// Cache (stored in memory between requests)
let animeCache = null;
let cacheTimestamp = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Helper: Slugify anime titles
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Helper: Safe fetch from Bunny Video API (never self-calls)
async function fetchVideos() {
  try {
    const response = await fetch(`https://video.bunnycdn.com/library/${LIBRARY_ID}/videos`, {
      method: 'GET',
      headers: {
        'AccessKey': BUNNY_API_KEY,
        'Accept': 'application/json',
        'User-Agent': 'IshanimeEdgeScript/1.1.0'
      },
      redirect: 'follow',
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`Bunny API error: ${response.status}`);
    }

    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error('Error fetching Bunny videos:', error);
    throw error;
  }
}

// Helper: Convert video data → anime list
function parseAnime(videos) {
  const animeMap = new Map();

  videos.forEach(video => {
    const titleMatch = video.title.match(/^(.+?)\s*-\s*Episode\s*(\d+)/i);
    if (!titleMatch) return;

    const show = titleMatch[1].trim();
    const epNum = parseInt(titleMatch[2]);

    if (!animeMap.has(show)) {
      animeMap.set(show, {
        id: slugify(show),
        name: show,
        title: show,
        slug: slugify(show),
        episodes: []
      });
    }

    const episode = {
      id: video.guid,
      episode: epNum.toString().padStart(2, '0'),
      title: video.title,
      videoUrl: `https://iframe.mediadelivery.net/play/${LIBRARY_ID}/${video.guid}`,
      directMp4: `https://${DELIVERY_DOMAIN}/${video.guid}/play_720p.mp4`,
      directMp4_480p: `https://${DELIVERY_DOMAIN}/${video.guid}/play_480p.mp4`,
      directMp4_1080p: `https://${DELIVERY_DOMAIN}/${video.guid}/play_1080p.mp4`,
      hlsUrl: `https://${DELIVERY_DOMAIN}/${video.guid}/playlist.m3u8`,
      thumbnail: `https://${DELIVERY_DOMAIN}/${video.guid}/thumbnail.jpg`,
      uploadedAt: video.dateUploaded || video.createdAt || new Date().toISOString()
    };

    animeMap.get(show).episodes.push(episode);
  });

  // Sort episodes ascending
  animeMap.forEach(anime =>
    anime.episodes.sort((a, b) => parseInt(a.episode) - parseInt(b.episode))
  );

  return Array.from(animeMap.values());
}

// Cached getter
async function getAnimeData() {
  const now = Date.now();
  if (animeCache && now - cacheTimestamp < CACHE_TTL) return animeCache;

  const videos = await fetchVideos();
  animeCache = parseAnime(videos);
  cacheTimestamp = now;
  return animeCache;
}

// ============================================================
// 🧩 MAIN HANDLER
// ============================================================
export default {
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname;

    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json'
    };

    // Preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 200, headers });
    }

    try {
      // Health
      if (path === '/api/health') {
        return new Response(JSON.stringify({
          status: 'healthy',
          timestamp: new Date().toISOString(),
          service: 'Ishanime Bunny Edge API',
          version: '1.1.0'
        }), { status: 200, headers });
      }

      // Site meta
      if (path === '/api/site') {
        return new Response(JSON.stringify({
          success: true,
          data: {
            name: 'Ishrealmanime',
            description: 'Your ultimate anime streaming destination',
            version: '1.1.0',
            features: {
              multipleVideoQualities: true,
              adaptiveStreaming: true,
              thumbnailPreviews: true
            }
          }
        }), { status: 200, headers });
      }

      // All anime
      if (path === '/api/anime') {
        const animeData = await getAnimeData();
        return new Response(JSON.stringify({
          success: true,
          count: animeData.length,
          data: animeData
        }), { status: 200, headers });
      }

      // Specific anime
      if (path.startsWith('/api/anime/')) {
        const slug = path.split('/').pop();
        const animeData = await getAnimeData();
        const anime = animeData.find(a => a.slug === slug);

        if (anime) {
          return new Response(JSON.stringify({ success: true, data: anime }), { status: 200, headers });
        } else {
          return new Response(JSON.stringify({ success: false, error: 'Anime not found' }), { status: 404, headers });
        }
      }

      // Unknown routes
      return new Response(JSON.stringify({
        success: false,
        error: 'Not found',
        message: `Route ${path} not recognized`
      }), { status: 404, headers });

    } catch (err) {
      console.error('Edge Script Error:', err);
      return new Response(JSON.stringify({
        success: false,
        error: err.message || 'Internal error'
      }), { status: 500, headers });
    }
  }
};
