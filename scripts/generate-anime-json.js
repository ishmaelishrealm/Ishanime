#!/usr/bin/env node
// Generate static anime.json from Bunny Video Library
// This script fetches all videos and creates a static JSON file for the frontend

const fs = require('fs');
const path = require('path');

// BunnyCDN Configuration - Your Library Details
const BUNNY_API_KEY = '7f0a1d07-a8a4-4e07-af7ed42722ee-bfbd-4896';
const LIBRARY_ID = '506159';
const CDN_HOSTNAME = 'vz-a01fffb9-e7a.b-cdn.net';

// Helper function to create URL-friendly slugs
function slugify(text) {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

// Fetch all videos from Bunny Video Library with pagination support
async function fetchVideos() {
    try {
        console.log('🔄 Fetching videos from Bunny Video Library (with pagination)...');

        const allItems = [];
        let page = 1;
        const perPage = 100; // Bunny API typically supports perPage up to 100

        // Keep fetching until an empty page is returned
        // API format assumption: /videos?page=X&perPage=Y
        for (;;) {
            const url = `https://video.bunnycdn.com/library/${LIBRARY_ID}/videos?page=${page}&perPage=${perPage}`;
            const response = await fetch(url, {
                headers: {
                    'AccessKey': BUNNY_API_KEY,
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Bunny API error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            const items = data.items || [];
            console.log(`📄 Page ${page}: ${items.length} items`);
            allItems.push(...items);

            if (items.length < perPage) {
                break; // last page
            }
            page += 1;
        }

        console.log(`✅ Total fetched videos: ${allItems.length}`);
        return allItems;
    } catch (error) {
        console.error('❌ Error fetching videos:', error);
        throw error;
    }
}

// Parse video data into organized anime shows and episodes
function parseAnimeData(videos) {
    console.log('🔄 Parsing video data into anime shows...');
    
    const animeMap = new Map();

    videos.forEach(video => {
        const title = (video.title || '').trim();
        let showName = '';
        let episodeNumber = null;

        // Robust title parsing supporting multiple formats
        const patterns = [
            /^(.+?)\s*-\s*Episode\s*(\d+)/i,           // Show - Episode 12
            /^(.+?)\s*-\s*Ep\.?\s*(\d+)/i,            // Show - Ep 12 or Ep. 12
            /^(.+?)\s+Ep\.?\s*(\d+)/i,                 // Show Ep 12
            /^(.+?)\s*S(\d+)\s*E(\d+)/i,               // Show S01 E12
            /^(.+?)\s*Season\s*\d+\s*Episode\s*(\d+)/i, // Show Season 1 Episode 12
            /^(.+?)\s*-\s*(\d{1,3})$/i                  // Show - 12
        ];

        for (const re of patterns) {
            const m = title.match(re);
            if (m) {
                showName = m[1].trim();
                // If SxxExx pattern, episode is group 3; otherwise group 2
                episodeNumber = parseInt(m[3] || m[2], 10);
                break;
            }
        }

        // Fallbacks if patterns didn't match
        if (!showName) {
            // Use part before the first dash as show name, or entire title
            const dashIdx = title.indexOf('-');
            showName = (dashIdx > 0 ? title.substring(0, dashIdx) : title).trim();
        }

        if (!animeMap.has(showName)) {
            animeMap.set(showName, {
                id: slugify(showName),
                name: showName,
                title: showName,
                slug: slugify(showName),
                episodes: []
            });
        }

        // Determine episode number if still missing
        if (episodeNumber == null || Number.isNaN(episodeNumber)) {
            // Use sequential order within the show as a last resort
            episodeNumber = animeMap.get(showName).episodes.length + 1;
        }

        // Add episode to the show with correct CDN URLs
        animeMap.get(showName).episodes.push({
            id: video.guid,
            episode: episodeNumber.toString().padStart(2, '0'),
            title: title,
            // Bunny iframe embed URL (most reliable for playback)
            videoUrl: `https://iframe.mediadelivery.net/play/${LIBRARY_ID}/${video.guid}`,
            // Direct MP4 URLs for different qualities
            directMp4: `https://${CDN_HOSTNAME}/${video.guid}/play_720p.mp4`,
            directMp4_480p: `https://${CDN_HOSTNAME}/${video.guid}/play_480p.mp4`,
            directMp4_1080p: `https://${CDN_HOSTNAME}/${video.guid}/play_1080p.mp4`,
            // HLS streaming URL
            hlsUrl: `https://${CDN_HOSTNAME}/${video.guid}/playlist.m3u8`,
            // Thumbnail URLs
            thumbnail: `https://${CDN_HOSTNAME}/${video.guid}/thumbnail.jpg`,
            thumbnailPreview: `https://${CDN_HOSTNAME}/${video.guid}/preview.jpg`,
            // Metadata
            uploadedAt: video.dateUploaded || video.createdAt || new Date().toISOString(),
            duration: video.duration || null,
            size: video.size || null
        });
    });

    // Sort episodes oldest → newest for each anime
    animeMap.forEach(anime => {
        anime.episodes.sort((a, b) => parseInt(a.episode) - parseInt(b.episode));
    });

    const animeList = Array.from(animeMap.values());
    console.log(`✅ Parsed ${animeList.length} anime shows with ${videos.length} total episodes`);
    
    return animeList;
}

// Generate the final JSON structure
function generateAnimeJson(animeData) {
    return {
        success: true,
        data: animeData,
        count: animeData.length,
        timestamp: new Date().toISOString(),
        generated: true,
        source: 'BunnyCDN Video Library',
        version: '1.0.0'
    };
}

// Main function
async function main() {
    try {
        console.log('🚀 Starting anime.json generation...');
        
        // Fetch videos from Bunny
        const videos = await fetchVideos();
        
        if (videos.length === 0) {
            console.log('⚠️ No videos found in Bunny Video Library');
            return;
        }
        
        // Parse into anime data
        const animeData = parseAnimeData(videos);
        
        // Generate final JSON
        const animeJson = generateAnimeJson(animeData);
        
        // Write to data directory with change detection
        const outputPath = path.join(__dirname, '..', 'data', 'anime.json');
        
        // Check if file exists and compare content
        let hasChanges = true;
        if (fs.existsSync(outputPath)) {
            try {
                const existingData = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
                // Compare video count
                if (existingData.count === animeJson.count && 
                    existingData.data && 
                    existingData.data.length === animeJson.data.length) {
                    console.log('📊 No changes detected - same video count, skipping update');
                    hasChanges = false;
                }
            } catch (e) {
                console.log('📊 Could not compare existing file, proceeding with update');
            }
        }
        
        if (hasChanges) {
            fs.writeFileSync(outputPath, JSON.stringify(animeJson, null, 2));
            console.log(`✅ Successfully generated anime.json with ${animeData.length} anime shows`);
            console.log(`📁 Output: ${outputPath}`);
            console.log(`📊 Total episodes: ${videos.length}`);
            console.log(`🕒 Generated at: ${animeJson.timestamp}`);
        } else {
            console.log('✅ No changes detected, file not updated');
        }
        
    } catch (error) {
        console.error('❌ Failed to generate anime.json:', error);
        process.exit(1);
    }
}

// Run the script
if (require.main === module) {
    main();
}

module.exports = { fetchVideos, parseAnimeData, generateAnimeJson };
