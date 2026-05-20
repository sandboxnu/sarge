FROM node:22-slim
WORKDIR /src/ws
RUN corepack enable && corepack prepare pnpm@9.12.2 --activate
COPY package.json index.js pnpm-lock.yaml* ./
RUN pnpm install

CMD ["node", "index.js"]
