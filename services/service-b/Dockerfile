FROM node:20-alpine

WORKDIR /app

# copy root files
COPY pnpm-lock.yaml ./
COPY package.json ./
COPY pnpm-workspace.yaml ./
COPY tsconfig.json ./

# copy shared package
COPY packages ./packages

# copy service code
COPY services/service-b ./services/service-b

RUN npm install -g pnpm && pnpm install

# build shared first
RUN cd /app/packages/shared && pnpm build

WORKDIR /app/services/service-b

RUN pnpm build

CMD ["pnpm", "start"]