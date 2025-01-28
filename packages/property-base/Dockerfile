FROM node:23-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY ../../package-lock.json ./

# Install dependencies
RUN npm ci --omit=dev

# Copy source files
COPY . .

# Generate Prisma client and build
RUN npm run generate

# Production image
FROM node:23-alpine

WORKDIR /app

# Copy package files and install production dependencies
COPY package*.json ./
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["npm", "start"]
