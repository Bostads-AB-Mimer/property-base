FROM node:23-alpine AS builder

WORKDIR /app

# Copy package files for dependency installation
COPY package*.json ./
COPY packages/property-tree/package*.json ./packages/property-tree/

# Install dependencies
RUN npm ci

# Copy source files
COPY packages/property-tree ./packages/property-tree

# Build
WORKDIR /app/packages/property-tree
RUN npm run build

# Production image
FROM nginx:alpine

# Copy nginx configuration
COPY --from=builder /app/packages/property-tree/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/packages/property-tree/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
