FROM node:20-alpine

WORKDIR /app

# Copy the entire monorepo
COPY . .

# Install dependencies at root level
RUN npm install

# Build only this package
WORKDIR /app/packages/property-tree
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
