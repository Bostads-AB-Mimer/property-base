FROM node:23-alpine AS builder

WORKDIR /app

# Copy package files
# COPY package*.json ./
# COPY ../../package-lock.json ./
# skip these, we do it already in github actions

# Copy source files
COPY . .
# Generate Prisma client and build
RUN npm run generate

EXPOSE 3000

CMD ["npm", "start"]
