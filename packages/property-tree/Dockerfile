FROM node:23-alpine AS builder

WORKDIR /app

# Copy package files for dependency installation
COPY package*.json ./
COPY packages/property-tree/package*.json ./packages/property-tree/

# Install dependencies
RUN npm ci

# Copy source files
COPY packages/property-tree /app/packages/property-tree

# Build
WORKDIR /app/packages/property-tree

EXPOSE 80

CMD ["npm", "start"]
