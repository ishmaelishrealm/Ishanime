# Ishanime Backend

Express.js API server for the Ishanime streaming platform.

## Environment Variables

Create a `.env` file in the server directory with the following variables:

```env
# Bunny CDN Configuration
BUNNY_API_KEY=your_bunny_api_key_here
LIBRARY_ID=your_library_id_here
DELIVERY_DOMAIN=your_delivery_domain_here

# Server Configuration
PORT=3000
NODE_ENV=production
```

## Installation

```bash
cd server
npm install
```

## Running Locally

```bash
npm start
```

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/anime` - Get all anime data
- `GET /api/site` - Get site information

## Railway Deployment

This backend is configured to deploy to Railway with the name "ishanimetest1".
