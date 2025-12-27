# syntax=docker/dockerfile:1
#
# ColorSnap Docker image
#
# This builds:
# - Frontend (Vite/React) from `web/` -> `web/dist`
# - Backend (Node/Express) from `server/` -> `server/dist`
# Then serves the frontend from the backend container.
#
# NOTE:
# - If you commit `package-lock.json` files, the build will use `npm ci`.
# - If you don't have lockfiles yet, it will fall back to `npm install`.
#   TODO(you): Commit lockfiles for reproducible builds.

FROM node:22-alpine AS web-builder
WORKDIR /app/web
COPY web/package*.json ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi
COPY web ./
RUN npm run build

FROM node:22-alpine AS server-builder
WORKDIR /app/server
COPY server/package*.json ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi
COPY server ./
RUN npm run build
RUN npm prune --omit=dev

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Backend runtime
COPY --from=server-builder /app/server/dist ./server/dist
COPY --from=server-builder /app/server/node_modules ./server/node_modules
COPY --from=server-builder /app/server/package.json ./server/package.json

# Frontend static assets
COPY --from=web-builder /app/web/dist ./server/public

EXPOSE 3000
CMD ["node", "server/dist/index.js"]


