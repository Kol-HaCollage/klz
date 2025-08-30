# Multi-stage build for React Vite app
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files and workspace config
COPY package*.json ./
COPY nx.json ./
COPY tsconfig.base.json ./

# Copy the entire workspace (needed for Nx)
COPY . .

# Install dependencies
RUN npm ci

# Build the KLZ app specifically
RUN npx nx build @klz/KLZ

# Production stage - serve with nginx
FROM nginx:alpine

# Copy built app to nginx (Vite builds to apps/KLZ/dist)
COPY --from=builder /app/apps/KLZ/dist /usr/share/nginx/html

# Copy nginx config for React Router
COPY apps/KLZ/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]