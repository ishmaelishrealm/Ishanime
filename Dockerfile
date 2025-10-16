# Use Node.js 18
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy server files
COPY server/ ./server/

# Install dependencies
WORKDIR /app/server
RUN npm install

# Expose port
EXPOSE 3000

# Start the server
CMD ["npm", "start"]
