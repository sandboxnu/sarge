FROM public.ecr.aws/docker/library/node:22-slim AS builder
WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl ca-certificates libssl3 && rm -rf /var/lib/apt/lists/*

COPY package.json pnpm-lock.yaml* ./
RUN corepack enable && pnpm install --frozen-lockfile

ARG NEXT_PUBLIC_CDN_BASE
ENV NEXT_PUBLIC_CDN_BASE=$NEXT_PUBLIC_CDN_BASE

COPY . .
RUN pnpm prisma:generate
RUN pnpm build

FROM public.ecr.aws/docker/library/node:22-slim
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
# TODO: check if AWS needs this env variable
# ENV HOST=0.0.0.0
ENV HOSTNAME=0.0.0.0
EXPOSE 3000

RUN apt-get update -y && apt-get install -y openssl ca-certificates libssl3 && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

COPY --from=builder /app/prisma ./prisma

COPY docker-entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]

CMD ["node", "server.js"]
