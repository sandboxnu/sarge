FROM node:22-slim
WORKDIR /src/ws

RUN apt-get update -y && apt-get install -y python3 build-essential && rm -rf /var/lib/apt/lists/*

RUN corepack enable && corepack prepare pnpm@9.12.2 --activate
COPY package.json index.js pnpm-lock.yaml* ./
RUN pnpm install

CMD ["node", "index.js"]