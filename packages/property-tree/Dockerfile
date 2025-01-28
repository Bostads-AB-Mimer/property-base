FROM node:20-alpine AS builder

WORKDIR /app

# Copy source files
COPY . .

# Build
RUN npm run build

# Production image
FROM nginx:alpine

# Copy nginx configuration
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
