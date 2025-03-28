FROM node:18-alpine as builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine as production

WORKDIR /app

# Copy package files for production
COPY package*.json ./

# Install only production dependencies
RUN npm install --production

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Expose port
EXPOSE 5000

# Start the application
CMD ["npm", "run", "start"]