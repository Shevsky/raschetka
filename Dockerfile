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

RUN apk add --no-cache 'nginx<1.29' 'supervisor<4.3' fail2ban gettext

RUN addgroup -S app && adduser -S app -G app && \
    mkdir -p /run/nginx /run/supervisord /run/fail2ban /var/lib/nginx /var/log/nginx /var/cache/nginx /var/lib/fail2ban /usr/share/nginx/html /app /app/storage && \
    touch /var/log/fail2ban.log && touch /app/storage/.keep && \
    chown -R app:app /run/nginx /run/supervisord /run/fail2ban /var/lib/nginx /var/log/nginx /var/cache/nginx /var/lib/fail2ban /usr/share/nginx/html /etc/nginx/http.d /var/log/fail2ban.log /app /app/storage

USER app

COPY --chown=app:app nginx.conf /etc/nginx/http.d/default.conf.template
COPY --chown=app:app supervisord.conf /etc/supervisord.conf
COPY --chown=app:app config/fail2ban /etc/fail2ban

# 🤙 Копируем файлы фронта
COPY --chown=app:app --from=build /build/dist/web /usr/share/nginx/html

# 🤟 Копируем файлы бека
COPY --chown=app:app --from=build /build/dist/app /app
COPY --chown=app:app --from=build /build/node_modules /app/node_modules

# 🥳 И файлы для запуска бекенда
COPY --chown=app:app package.json .npmrc /app/
COPY --chown=app:app prisma /app/prisma

ENV PYTHONWARNINGS="ignore:pkg_resources is deprecated as an API:UserWarning"

RUN printf "[sshd]\nenabled = false\n"       >  /etc/fail2ban/jail.d/zzzz-disable-sshd.local && \
    printf "[sshd-ddos]\nenabled = false\n"  >  /etc/fail2ban/jail.d/zzzz-disable-sshd-ddos.local

RUN sed -i 's|^#\?dbfile .*|dbfile = /var/lib/fail2ban/fail2ban.sqlite3|' /etc/fail2ban/fail2ban.conf || true

EXPOSE 8080

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
