# Base Node image
FROM node:18-alpine AS base
WORKDIR /app
# Install pnpm
RUN npm install -g pnpm

COPY ./package.json ./
COPY ./pnpm-lock.yaml ./

RUN pnpm install

COPY . .

EXPOSE 5173

CMD ["pnpm", "run", "dev", "--host"]