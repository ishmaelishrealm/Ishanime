// Test script to verify deployment
// Run this with: node test-deployment.js

const API_URL = 'https://ishanime-api-pzssf.bunny.run';

async function testAPI() {
    console.log('🧪 Testing Bunny Edge Script API...');
    
    try {
        // Test health endpoint
        console.log('1. Testing health endpoint...');
        const healthResponse = await fetch(`${API_URL}/api/health`);
        if (healthResponse.ok) {
            const healthData = await healthResponse.json();
            console.log('✅ Health check passed:', healthData);
        } else {
            console.log('❌ Health check failed:', healthResponse.status);
        }
        
        // Test anime endpoint
        console.log('2. Testing anime endpoint...');
        const animeResponse = await fetch(`${API_URL}/api/anime`);
        if (animeResponse.ok) {
            const animeData = await animeResponse.json();
            console.log('✅ Anime endpoint working, found', animeData.length, 'anime');
        } else {
            console.log('❌ Anime endpoint failed:', animeResponse.status);
        }
        
        // Test site endpoint
        console.log('3. Testing site endpoint...');
        const siteResponse = await fetch(`${API_URL}/api/site`);
        if (siteResponse.ok) {
            const siteData = await siteResponse.json();
            console.log('✅ Site endpoint working:', siteData);
        } else {
            console.log('❌ Site endpoint failed:', siteResponse.status);
        }
        
    } catch (error) {
        console.log('❌ API test failed:', error.message);
    }
}

testAPI();
