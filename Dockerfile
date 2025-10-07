# Multi-stage build for production deployment
FROM node:18-alpine AS base

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

# Install dependencies
RUN cd client && pnpm install --frozen-lockfile
RUN cd server && npm install --production

# Build stage for client
FROM base AS client-build
COPY client/ ./client/
WORKDIR /app/client
RUN pnpm run build

# Production stage
FROM node:18-alpine AS production

# Install pnpm
RUN npm install -g pnpm

# Create app directory
WORKDIR /app

# Copy server files
COPY server/ ./server/
COPY database/ ./database/

# Copy built client files
COPY --from=client-build /app/client/dist ./client/dist

# Install server dependencies
WORKDIR /app/server
RUN npm install --production

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Change ownership
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/api/health || exit 1

# Start server
CMD ["npm", "start"]
