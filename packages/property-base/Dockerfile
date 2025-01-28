FROM node:23-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm i --omit=dev

# Copy source files
COPY . .

# Generate Prisma client and build
RUN npm run generate

EXPOSE 3000

CMD ["npm", "start"]
