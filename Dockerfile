ARG NODE_IMAGE=node:22.16-alpine

# 🏗️ Собираем фронт + бек
FROM ${NODE_IMAGE} AS build

WORKDIR /build

COPY package*.json .npmrc index.html vite.config.mjs tsconfig.json ./

RUN ADBLOCK=1 npm ci --no-audit --no-progress

COPY src ./src
COPY prisma ./prisma

RUN npm run build
RUN npm prune --omit=dev

# 🏁 Рантайм стадия
FROM ${NODE_IMAGE} AS runtime

RUN apk add --no-cache gettext

RUN addgroup -S app && adduser -S app -G app && \
    mkdir -p /app /app/storage && \
    touch /app/storage/.keep && \
    chown -R app:app /app /app/storage

USER app

# 🤟 Копируем файлы бека
COPY --chown=app:app --from=build /build/dist/app /app
COPY --chown=app:app --from=build /build/node_modules /app/node_modules

# 🤙 Копируем файлы фронта
COPY --chown=app:app --from=build /build/dist/web /app/public

# 🥳 И файлы для запуска бекенда
COPY --chown=app:app package.json .npmrc /app/
COPY --chown=app:app prisma /app/prisma

CMD ["npm", "run", "start"]
