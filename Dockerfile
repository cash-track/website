# syntax=docker/dockerfile:1
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

# Uploads source maps to Sentry when the build passes the optional sentry_auth_token secret.
RUN --mount=type=secret,id=sentry_auth_token,env=SENTRY_AUTH_TOKEN npm ci && npm run build

CMD ["node", "/web/.output/server/index.mjs"]
