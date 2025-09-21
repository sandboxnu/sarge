FROM node:22-slim AS builder
WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN corepack enable && pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

FROM node:22-slim
WORKDIR /app
ENV PORT=3000
ENV HOST=0.0.0.0
EXPOSE 3000

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
# TODO: uncomment once we add images to /public
# COPY --from=builder /app/public ./public

CMD ["node", "server.js"]
