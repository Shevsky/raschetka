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

RUN apk add --no-cache 'nginx<1.29' 'supervisor<4.3' gettext

RUN addgroup -S app && adduser -S app -G app && \
    mkdir -p /run/nginx /run/supervisord /var/lib/nginx /var/log/nginx /var/cache/nginx /usr/share/nginx/html /app /app/storage && \
    chown -R app:app /run/nginx /run/supervisord /var/lib/nginx /var/log/nginx /var/cache/nginx /usr/share/nginx/html /etc/nginx/http.d /app /app/storage && \
    touch /app/storage/.keep

USER app

COPY --chown=app:app nginx.conf /etc/nginx/http.d/default.conf.template
COPY --chown=app:app supervisord.conf /etc/supervisord.conf

# 🤙 Копируем файлы фронта
COPY --chown=app:app --from=build /build/dist/web /usr/share/nginx/html

# 🤟 Копируем файлы бека
COPY --chown=app:app --from=build /build/dist/app /app
COPY --chown=app:app --from=build /build/node_modules /app/node_modules

# 🥳 И файлы для запуска бекенда
COPY --chown=app:app package.json .npmrc /app/
COPY --chown=app:app prisma /app/prisma

EXPOSE 8080

ENV PYTHONWARNINGS="ignore:pkg_resources is deprecated as an API:UserWarning"

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
