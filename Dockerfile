FROM node:20-alpine AS builder

WORKDIR /app

# Install system dependencies
RUN apk add --no-cache openssl libc6-compat

# Copy dependency files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN yarn build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Install system dependencies for production
RUN apk add --no-cache openssl libc6-compat dumb-init

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Copy dependency files
COPY package.json yarn.lock ./

# Install only production dependencies
RUN yarn install --frozen-lockfile --production && yarn cache clean

# Copy built files from builder stage
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Copy environment files if they exist
COPY --from=builder /app/.env* ./ 2>/dev/null || true

# Switch to non-root user
USER nextjs

# Expose the port the app uses
EXPOSE 3000

# Use dumb-init for process management
ENTRYPOINT ["dumb-init", "--"]

# Command to start the application
CMD ["yarn", "start"]