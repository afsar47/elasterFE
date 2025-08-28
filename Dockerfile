# --- Build Stage ---
FROM node:20-alpine AS build
WORKDIR /app

# Copy only package files first for caching
COPY package*.json ./

# Install all dependencies (including devDependencies for Vite/Tailwind)
ENV NODE_ENV=development
RUN --mount=type=cache,id=npm-cache,target=/root/.npm \
    npm ci

# Copy the rest of your app
COPY . .

# Build your app for production
RUN npm run build

# --- Run Stage ---
FROM node:20-alpine AS runner
WORKDIR /app

# Copy only the built output + package files
COPY --from=build /app/dist ./dist
COPY package*.json ./

# Install only production dependencies
ENV NODE_ENV=production
RUN npm ci --omit=dev

# Expose port and run
EXPOSE 3000
CMD ["npm", "run", "preview"]
