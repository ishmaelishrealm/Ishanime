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

// Fetch videos from Bunny Video Library
async function fetchVideos() {
    try {
        console.log('🔄 Fetching videos from Bunny Video Library...');
        
        const response = await fetch(`https://video.bunnycdn.com/library/${LIBRARY_ID}/videos`, {
            headers: { 
                'AccessKey': BUNNY_API_KEY, 
                'Accept': 'application/json' 
            }
        });

        if (!response.ok) {
            throw new Error(`Bunny API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log(`✅ Fetched ${data.items?.length || 0} videos from Bunny`);
        return data.items || [];
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

        // Add episode to the show with correct CDN URLs
        animeMap.get(showName).episodes.push({
            id: video.guid,
            episode: episodeNumber.toString().padStart(2, '0'),
            title: video.title,
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
        
        // Write to frontend directory
        const outputPath = path.join(__dirname, '..', 'frontend', 'anime.json');
        fs.writeFileSync(outputPath, JSON.stringify(animeJson, null, 2));
        
        console.log(`✅ Successfully generated anime.json with ${animeData.length} anime shows`);
        console.log(`📁 Output: ${outputPath}`);
        console.log(`📊 Total episodes: ${videos.length}`);
        console.log(`🕒 Generated at: ${animeJson.timestamp}`);
        
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
