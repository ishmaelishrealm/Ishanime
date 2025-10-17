// Bunny Edge Scripting - Safe Standalone API for Ishrealmanime
// Version: 1.1.0 - Fixes 508 loop, adds self-call guard and stable CORS

// === Configuration ===
const BUNNY_API_KEY = '7f0a1d07-a8a4-4e07-af7ed42722ee-bfbd-4896';
const LIBRARY_ID = '506159';
const DELIVERY_DOMAIN = 'vz-a01fffb9-e7a.b-cdn.net';

// === Cache ===
let animeCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// === Utilities ===
function slugify(text) {
  return text.toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// === Fetch videos from Bunny ===
async function fetchVideos() {
  const apiUrl = `https://video.bunnycdn.com/library/${LIBRARY_ID}/videos`;
  try {
    const res = await fetch(apiUrl, {
      headers: {
        'AccessKey': BUNNY_API_KEY,
        'Accept': 'application/json'
      }
    });
    if (!res.ok) throw new Error(`Bunny API error: ${res.status}`);
    const data = await res.json();
    return data.items || [];
  } catch (err) {
    console.error('Error fetching videos:', err);
    throw err;
  }
}

// === Parse videos into anime episodes ===
function parseAnimeData(videos) {
  const animeMap = new Map();
  videos.forEach(video => {
    const match = video.title.match(/^(.+?)\s*-\s*Episode\s*(\d+)/i);
    if (match) {
      const show = match[1].trim();
      const epNum = parseInt(match[2]);
      if (!animeMap.has(show)) {
        animeMap.set(show, {
          id: slugify(show),
          name: show,
          title: show,
          slug: slugify(show),
          episodes: []
        });
      }
      animeMap.get(show).episodes.push({
        id: video.guid,
        episode: epNum.toString().padStart(2, '0'),
        title: video.title,
        videoUrl: `https://iframe.mediadelivery.net/play/${LIBRARY_ID}/${video.guid}`,
        hlsUrl: `https://${DELIVERY_DOMAIN}/${video.guid}/playlist.m3u8`,
        directMp4_480p: `https://${DELIVERY_DOMAIN}/${video.guid}/play_480p.mp4`,
        directMp4_720p: `https://${DELIVERY_DOMAIN}/${video.guid}/play_720p.mp4`,
        directMp4_1080p: `https://${DELIVERY_DOMAIN}/${video.guid}/play_1080p.mp4`,
        thumbnail: `https://${DELIVERY_DOMAIN}/${video.guid}/thumbnail.jpg`,
        preview: `https://${DELIVERY_DOMAIN}/${video.guid}/preview.jpg`,
        uploadedAt: video.dateUploaded || video.createdAt || new Date().toISOString()
      });
    }
  });
  // Sort episodes oldest → newest
  animeMap.forEach(a => a.episodes.sort((x, y) => parseInt(x.episode) - parseInt(y.episode)));
  return Array.from(animeMap.values());
}

// === Cache handling ===
async function getAnimeData() {
  const now = Date.now();
  if (animeCache && (now - cacheTimestamp < CACHE_DURATION)) return animeCache;
  const vids = await fetchVideos();
  animeCache = parseAnimeData(vids);
  cacheTimestamp = now;
  return animeCache;
}

// === Main handler ===
export default {
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname;

    // 🧱 Loop Protection (prevents 508)
    const host = url.hostname;
    if (host.includes('ishanime.me') || host.includes('b-cdn.net') || host.includes('bunny.run')) {
      if (path.startsWith('/api/')) {
        return new Response(JSON.stringify({ error: 'Loop prevented', path }), { status: 400 });
      }
    }

    // === CORS Headers ===
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json'
    };

    // === Handle OPTIONS ===
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers });
    }

    try {
      // === /api/health ===
      if (path === '/api/health') {
        return new Response(JSON.stringify({
          status: 'healthy',
          service: 'Ishanime Bunny Edge API',
          version: '1.1.0',
          timestamp: new Date().toISOString()
        }), { status: 200, headers });
      }

      // === /api/anime ===
      if (path === '/api/anime') {
        const anime = await getAnimeData();
        return new Response(JSON.stringify({
          success: true,
          count: anime.length,
          data: anime
        }), { status: 200, headers });
      }

      // === /api/anime/:slug ===
      if (path.startsWith('/api/anime/')) {
        const slug = path.split('/').pop();
        const anime = (await getAnimeData()).find(a => a.slug === slug);
        if (!anime) {
          return new Response(JSON.stringify({ success: false, error: 'Anime not found' }), { status: 404, headers });
        }
        return new Response(JSON.stringify({ success: true, data: anime }), { status: 200, headers });
      }

      // === /api/site ===
      if (path === '/api/site') {
        return new Response(JSON.stringify({
          success: true,
          data: {
            name: 'Ishrealmanime',
            domain: 'ishanime.me',
            features: ['adaptive streaming', 'multiple qualities', 'thumbnails'],
            source: 'BunnyCDN Video API'
          }
        }), { status: 200, headers });
      }

      // === 404 ===
      return new Response(JSON.stringify({
        success: false,
        error: 'Not found',
        path
      }), { status: 404, headers });

    } catch (err) {
      console.error('Edge Script error:', err);
      return new Response(JSON.stringify({
        success: false,
        error: 'Internal server error',
        message: err.message
      }), { status: 500, headers });
    }
  }
};

