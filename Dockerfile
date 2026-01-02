# -----------------
# BASE STAGE
# Installs all dependencies using pnpm. This is a separate stage to cache dependencies.
# -----------------
FROM node:20-alpine AS base

# Enable pnpm through Corepack, which is bundled with Node.js
RUN corepack enable

WORKDIR /app

# Copy package files and install dependencies.
# NOTE: It's a best practice to commit pnpm-lock.yaml for reproducible builds.
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

# -----------------
# DEVELOPMENT STAGE
# Use this stage for development. It runs the Vite dev server.
# Build with: docker build --target development -t music-player:dev .
# -----------------
FROM base AS development
# Copy the rest of the application source code
COPY . .
# Vite's default dev port
EXPOSE 5173
# The 'dev' script in package.json already includes '--host 0.0.0.0'
CMD ["pnpm", "dev"]

# -----------------
# BUILD STAGE
# This stage builds the React application for production.
# -----------------
FROM base AS build
# Copy the rest of the application source code
COPY . .
# Run the production build
RUN pnpm build

# -----------------
# PRODUCTION STAGE
# This stage serves the built application using Vite's preview server.
# Build with: docker build --target production -t music-player:prod .
# -----------------
FROM node:20-alpine AS production
ENV NODE_ENV=production
WORKDIR /app

RUN corepack enable

COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json /app/vite.config.js ./
COPY --from=build /app/node_modules ./node_modules

EXPOSE 4173
CMD ["pnpm", "preview"]