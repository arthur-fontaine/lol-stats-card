FROM oven/bun:1 AS build
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
ENV VITE_API_URL ""
RUN bun run ./entrypoints/webapp/main.ts build

FROM caddy:2-alpine
WORKDIR /app
COPY --from=build /app/entrypoints/webapp/dist ./dist
COPY ./entrypoints/webapp/Caddyfile /etc/caddy/Caddyfile
ENV VITE_API_URL ""

EXPOSE 80
EXPOSE 443
