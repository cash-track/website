FROM node:14-alpine

ENV APP_ROOT /web

WORKDIR ${APP_ROOT}

ADD package.json ${APP_ROOT}
ADD package-lock.json ${APP_ROOT}

RUN npm ci

ADD . ${APP_ROOT}

RUN npm run build

CMD ["npm", "run", "start"]
