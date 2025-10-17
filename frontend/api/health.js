// Vercel Serverless Function - Health Check Endpoint
// Simple health check for monitoring and debugging

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight OPTIONS requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Return health status
    res.status(200).json({
        status: 'healthy',
        service: 'Ishanime Vercel API',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
}
