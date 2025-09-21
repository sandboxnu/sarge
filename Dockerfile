FROM node:22-slim AS builder
WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN corepack enable && pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

FROM node:22-slim
WORKDIR /app
ENV PORT=3000
# TODO: see if AWS needs the HOST env
# ENV HOST=0.0.0.0
ENV HOSTNAME=0.0.0.0
EXPOSE 3000

RUN apt-get update -y && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*;

RUN npm install -g prisma@^6.15.0

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
# TODO: uncomment once we add images to /public
# COPY --from=builder /app/public ./public

COPY --from=builder /app/prisma ./prisma

COPY docker-entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]

CMD ["node", "server.js"]
