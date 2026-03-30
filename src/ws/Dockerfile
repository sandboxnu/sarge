FROM node:22-slim
WORKDIR /src/ws
RUN corepack enable pnpm
COPY package.json index.js pnpm-lock.yaml* ./
RUN pnpm install

CMD ["node", "index.js"]
