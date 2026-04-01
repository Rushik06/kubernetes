FROM node:20-alpine

WORKDIR /app

COPY pnpm-lock.yaml ./
COPY package.json ./
COPY pnpm-workspace.yaml ./
COPY tsconfig.json ./
COPY packages ./packages
COPY services/service-a ./services/service-a

RUN npm install -g pnpm && pnpm install

RUN cd /app/packages/shared && pnpm build

WORKDIR /app/services/service-a

RUN pnpm build

CMD ["pnpm", "start"]