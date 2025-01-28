FROM node:20-alpine

WORKDIR /app

# Copy package files for dependency installation
COPY package*.json ./
COPY packages/property-base/package*.json ./packages/property-base/

# Install dependencies
RUN npm ci

# Copy source files
COPY packages/property-base ./packages/property-base
COPY prisma ./prisma
COPY tsconfig.json ./

# Generate Prisma client and build
WORKDIR /app/packages/property-base
RUN npx prisma generate
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
