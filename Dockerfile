# syntax=docker/dockerfile:1.6

# ---- Build stage ----
FROM node:20-alpine AS builder

WORKDIR /app

# Install deps with locked versions
COPY package.json package-lock.json ./
RUN npm ci && npm install --no-save @rollup/rollup-linux-x64-musl

COPY . .

# Production-time API base URL (relative — proxied by nginx)
# Override at build time with `--build-arg VITE_BASE_URL=...` if you need an absolute URL
ARG VITE_BASE_URL=/api
ENV VITE_BASE_URL=${VITE_BASE_URL}

RUN npm run build

# ---- Runtime stage ----
FROM nginx:1.27-alpine

# SPA + reverse-proxy config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Static build output
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1

CMD ["nginx", "-g", "daemon off;"]
