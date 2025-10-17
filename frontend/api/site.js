// Vercel Serverless Function - Site Information Endpoint
// Returns site configuration and features

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight OPTIONS requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Return site information
    res.status(200).json({
        success: true,
        data: {
            name: 'Ishrealmanime',
            description: 'Your ultimate anime streaming destination',
            domain: 'ishanime.me',
            version: '1.0.0',
            features: {
                multipleVideoQualities: true,
                adaptiveStreaming: true,
                thumbnailPreviews: true,
                episodeOrdering: 'oldest-first',
                serverlessBackend: true,
                vercelHosted: true
            },
            source: 'BunnyCDN Video Library + Vercel Serverless Functions',
            lastUpdated: new Date().toISOString()
        }
    });
}
