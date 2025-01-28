FROM node:20-alpine


WORKDIR /app

# Copy package files for dependency installation
COPY package*.json ./
COPY packages/property-tree/package*.json ./packages/property-tree/

# Install dependencies
RUN npm ci

# Copy source files
COPY packages/property-tree ./packages/property-tree

# Build only this package
WORKDIR /app/packages/property-tree
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
