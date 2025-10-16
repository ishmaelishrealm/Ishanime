# Use Node.js 18
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json first for better caching
COPY server/package.json ./

# Install dependencies
RUN npm install

# Copy the rest of the server files
COPY server/ ./

# Expose port
EXPOSE 3000

# Start the server
CMD ["npm", "start"]
