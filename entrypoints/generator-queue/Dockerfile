FROM oven/bun:1
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .

ENV RIOT_API_KEY="your_riot_api_key"
ENV REDIS_HOST="redis"
ENV REDIS_PORT="6379"
ENV REDIS_PASSWORD=""

EXPOSE 3000
CMD ["bun", "entrypoints/generator-queue/main.ts"]
