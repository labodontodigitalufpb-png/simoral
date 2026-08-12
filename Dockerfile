FROM node:22-alpine

ENV NODE_ENV=production \
    PORT=7860 \
    DATA_FILE=/data/examosim-db.json

WORKDIR /app

COPY --chown=node:node package.json ./
COPY --chown=node:node server.js app.js index.html styles.css ./
COPY --chown=node:node data ./data
COPY --chown=node:node assets ./assets

RUN mkdir -p /data && chown node:node /data

USER node

EXPOSE 7860

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:7860/health >/dev/null || exit 1

CMD ["node", "server.js"]
