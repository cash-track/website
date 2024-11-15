FROM node:20-alpine

ENV APP_ROOT=/web

WORKDIR ${APP_ROOT}

ADD package.json ${APP_ROOT}
ADD package-lock.json ${APP_ROOT}

RUN npm ci

ADD . ${APP_ROOT}

RUN npm ci && npm run build

CMD ["node", "/web/.output/server/index.mjs"]
