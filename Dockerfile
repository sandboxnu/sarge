FROM node:22-slim AS builder
WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl

COPY package.json pnpm-lock.yaml* ./
RUN corepack enable && pnpm install --frozen-lockfile

COPY . .
# RUN pnpm prisma:generate
RUN pnpm build

FROM node:22-slim
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
# TODO: check if AWS needs this env variable
# ENV HOST=0.0.0.0
ENV HOSTNAME=0.0.0.0
EXPOSE 3000

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
# TODO: uncomment when we add public directory
# COPY --from=builder /app/public ./public

COPY --from=builder /app/prisma ./prisma

COPY docker-entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]

CMD ["node", "server.js"]
