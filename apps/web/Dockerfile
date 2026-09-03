FROM node:22-alpine AS build

RUN corepack enable
WORKDIR /workspace

COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @mc/web build

FROM node:22-alpine AS runtime

ENV NODE_ENV=production
WORKDIR /app
RUN mkdir /data && chown node:node /data

COPY --from=build /workspace/node_modules ./node_modules
COPY --from=build /workspace/apps/web/node_modules ./apps/web/node_modules
COPY --from=build /workspace/apps/web/package.json ./apps/web/package.json
COPY --from=build /workspace/apps/web/dist ./apps/web/dist
COPY --from=build /workspace/apps/web/server-dist ./apps/web/server-dist

WORKDIR /app/apps/web
USER node
EXPOSE 3000
CMD ["node", "server-dist/index.js"]
