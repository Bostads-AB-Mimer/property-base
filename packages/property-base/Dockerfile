FROM node:23-slim

RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

# Copy package files for dependency installation
COPY package*.json ./
COPY packages/property-base/package*.json ./packages/property-base/

# Install dependencies
RUN npm ci

# Copy source files
COPY packages/property-base ./packages/property-base

# Generate Prisma client and build
WORKDIR /app/packages/property-base
RUN npm run generate

EXPOSE 3000

CMD ["npm", "start"]
