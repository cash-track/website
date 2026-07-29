FROM node:22-alpine

ENV APP_ROOT=/web

WORKDIR ${APP_ROOT}

ADD package.json ${APP_ROOT}
ADD package-lock.json ${APP_ROOT}

RUN npm ci

ADD . ${APP_ROOT}

# Release metadata shown in the footer. Nuxt reads NUXT_PUBLIC_* from the environment at
# server start, so these ENV values flow into runtimeConfig.public without a rebuild.
ARG GIT_TAG=""
ARG GIT_COMMIT=""
ENV NUXT_PUBLIC_APP_VERSION=${GIT_TAG}
ENV NUXT_PUBLIC_APP_COMMIT=${GIT_COMMIT}

RUN npm ci && npm run build

CMD ["node", "/web/.output/server/index.mjs"]
